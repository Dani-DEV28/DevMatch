import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@insforge/sdk";

const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_BASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
});

interface GitHubRepo {
  name: string;
  language: string | null;
  pushed_at: string;
  created_at: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  description: string | null;
  has_readme: boolean;
  topics: string[];
}

interface GitHubCommit {
  commit: {
    message: string;
    author: {
      date: string;
    };
  };
}

interface GitHubIssue {
  state: string;
  created_at: string;
  closed_at: string | null;
  comments: number;
}

interface BehavioralSignals {
  // Velocity patterns
  commitVelocity: "sprinter" | "marathoner" | "consistent" | "sporadic";
  velocityScore: number; // 0-100
  
  // README quality
  readmeQuality: "minimal" | "functional" | "polished" | "visionary";
  readmeScore: number; // 0-100
  
  // Collaboration style
  collaborationStyle: "solo" | "responsive" | "mentor" | "leader";
  collaborationScore: number; // 0-100
  
  // Builder philosophy
  builderPhilosophy: "hacker" | "craftsman" | "architect" | "perfectionist";
  builderScore: number; // 0-100
  
  // Intellectual curiosity
  curiosityAreas: string[];
  curiosityScore: number; // 0-100
  
  // Repo lifecycle
  completionTendency: "abandoner" | "mvp-shipper" | "maintainer" | "polisher";
  completionScore: number; // 0-100
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { github_id } = body;

    if (!github_id) {
      return NextResponse.json(
        { error: "github_id is required" },
        { status: 400 }
      );
    }

    // Look up the user
    const { data: users, error: userError } = await insforge.database
      .from("users")
      .select()
      .eq("github_id", String(github_id));

    if (userError || !users || users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = users[0] as { id: string; name: string };

    // GitHub API headers
    const ghHeaders: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
    };
    if (process.env.GITHUB_TOKEN) {
      ghHeaders.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    // Get GitHub login from numeric ID
    const ghUserRes = await fetch(
      `https://api.github.com/user/${github_id}`,
      { headers: ghHeaders }
    );
    if (!ghUserRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch GitHub user" },
        { status: 502 }
      );
    }
    const ghUser = await ghUserRes.json();
    const login = ghUser.login;

    // Fetch repos with more detail
    const reposRes = await fetch(
      `https://api.github.com/users/${login}/repos?sort=pushed&per_page=20`,
      { headers: ghHeaders }
    );
    if (!reposRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch repositories" },
        { status: 502 }
      );
    }

    const repos = await reposRes.json();

    // Fetch starred repos for curiosity analysis
    const starredRes = await fetch(
      `https://api.github.com/users/${login}/starred?per_page=50`,
      { headers: ghHeaders }
    );
    const starred = starredRes.ok ? await starredRes.json() : [];

    // Analyze behavioral signals
    const signals = await analyzeBehavioralSignals(
      login,
      repos,
      starred,
      ghHeaders
    );

    // Store in database
    const { error: upsertError } = await insforge.database
      .from("user_taste_profiles")
      .upsert({
        user_id: user.id,
        builder_archetype: signals.builderPhilosophy,
        velocity_style: signals.commitVelocity,
        documentation_taste: signals.readmeQuality,
        collaboration_style: signals.collaborationStyle,
        code_aesthetic: signals.completionTendency,
        taste_signals: {
          velocity_score: signals.velocityScore,
          readme_score: signals.readmeScore,
          collaboration_score: signals.collaborationScore,
          builder_score: signals.builderScore,
          curiosity_score: signals.curiosityScore,
          completion_score: signals.completionScore,
          curiosity_areas: signals.curiosityAreas,
        },
        analyzed_at: new Date().toISOString(),
      }, {
        onConflict: "user_id",
      });

    if (upsertError) {
      console.error("Failed to store taste profile:", upsertError);
    }

    return NextResponse.json({
      signals,
      summary: generateSummary(signals),
    });
  } catch (err) {
    console.error("Behavioral analysis error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}

async function analyzeBehavioralSignals(
  login: string,
  repos: any[],
  starred: any[],
  headers: Record<string, string>
): Promise<BehavioralSignals> {
  // 1. Analyze commit velocity
  const velocityAnalysis = analyzeCommitVelocity(repos, login, headers);
  
  // 2. Analyze README quality
  const readmeAnalysis = analyzeReadmeQuality(repos);
  
  // 3. Analyze collaboration style
  const collaborationAnalysis = await analyzeCollaborationStyle(repos, login, headers);
  
  // 4. Analyze builder philosophy
  const builderAnalysis = analyzeBuilderPhilosophy(repos);
  
  // 5. Analyze intellectual curiosity
  const curiosityAnalysis = analyzeCuriosity(starred);
  
  // 6. Analyze repo lifecycle
  const completionAnalysis = analyzeCompletionTendency(repos);

  return {
    commitVelocity: velocityAnalysis.style,
    velocityScore: velocityAnalysis.score,
    readmeQuality: readmeAnalysis.quality,
    readmeScore: readmeAnalysis.score,
    collaborationStyle: collaborationAnalysis.style,
    collaborationScore: collaborationAnalysis.score,
    builderPhilosophy: builderAnalysis.philosophy,
    builderScore: builderAnalysis.score,
    curiosityAreas: curiosityAnalysis.areas,
    curiosityScore: curiosityAnalysis.score,
    completionTendency: completionAnalysis.tendency,
    completionScore: completionAnalysis.score,
  };
}

function analyzeCommitVelocity(
  repos: any[],
  login: string,
  headers: Record<string, string>
): { style: BehavioralSignals["commitVelocity"]; score: number } {
  // Calculate average time between commits across repos
  const pushDates = repos
    .map((r) => new Date(r.pushed_at))
    .filter((d) => !isNaN(d.getTime()))
    .sort((a, b) => b.getTime() - a.getTime());

  if (pushDates.length < 2) {
    return { style: "sporadic", score: 30 };
  }

  // Calculate average gap between pushes
  let totalGap = 0;
  for (let i = 0; i < pushDates.length - 1; i++) {
    totalGap += pushDates[i].getTime() - pushDates[i + 1].getTime();
  }
  const avgGap = totalGap / (pushDates.length - 1);
  const avgGapDays = avgGap / (1000 * 60 * 60 * 24);

  // Analyze burst patterns
  const recentPushes = pushDates.filter(
    (d) => Date.now() - d.getTime() < 30 * 24 * 60 * 60 * 1000
  ).length;

  if (recentPushes >= 15) {
    return { style: "sprinter", score: 90 };
  } else if (avgGapDays < 3) {
    return { style: "consistent", score: 70 };
  } else if (avgGapDays < 14) {
    return { style: "marathoner", score: 60 };
  } else {
    return { style: "sporadic", score: 30 };
  }
}

function analyzeReadmeQuality(repos: any[]): { quality: BehavioralSignals["readmeQuality"]; score: number } {
  let totalScore = 0;
  let analyzedCount = 0;

  for (const repo of repos.slice(0, 10)) {
    if (!repo.description) continue;
    
    let score = 0;
    const desc = repo.description || "";
    
    // Length scoring
    if (desc.length > 100) score += 20;
    else if (desc.length > 50) score += 10;
    
    // Has vision/why statement
    if (/because|why|purpose|mission|vision/i.test(desc)) score += 20;
    
    // Has features/benefits
    if (/feature|benefit|allows|enables|helps/i.test(desc)) score += 15;
    
    // Has emoji or formatting
    if (/[\u{1F300}-\u{1F9FF}]/u.test(desc)) score += 10;
    
    // Has tech keywords
    if (/built with|using|powered by/i.test(desc)) score += 10;
    
    totalScore += Math.min(score, 100);
    analyzedCount++;
  }

  const avgScore = analyzedCount > 0 ? totalScore / analyzedCount : 0;

  if (avgScore >= 70) return { quality: "visionary", score: avgScore };
  if (avgScore >= 50) return { quality: "polished", score: avgScore };
  if (avgScore >= 30) return { quality: "functional", score: avgScore };
  return { quality: "minimal", score: avgScore };
}

async function analyzeCollaborationStyle(
  repos: any[],
  login: string,
  headers: Record<string, string>
): Promise<{ style: BehavioralSignals["collaborationStyle"]; score: number }> {
  // Check for PR reviews, issue responses, etc.
  let collaborationScore = 0;
  
  // Check if repos have contributors
  const reposWithContributors = repos.filter((r) => r.forks_count > 0 || r.open_issues_count > 0).length;
  if (reposWithContributors > 5) collaborationScore += 30;
  else if (reposWithContributors > 2) collaborationScore += 15;

  // Check topics for collaboration indicators
  const hasTeamTopics = repos.some((r) =>
    r.topics?.some((t: string) =>
      ["team", "collaboration", "community", "open-source"].includes(t)
    )
  );
  if (hasTeamTopics) collaborationScore += 20;

  // Analyze repo ownership vs collaboration
  const ownRepos = repos.filter((r) => !r.fork).length;
  const forkedRepos = repos.filter((r) => r.fork).length;
  
  if (forkedRepos > ownRepos) collaborationScore += 20; // Contributes to others
  if (ownRepos > 5) collaborationScore += 15; // Owns projects

  if (collaborationScore >= 70) return { style: "leader", score: collaborationScore };
  if (collaborationScore >= 50) return { style: "mentor", score: collaborationScore };
  if (collaborationScore >= 30) return { style: "responsive", score: collaborationScore };
  return { style: "solo", score: collaborationScore };
}

function analyzeBuilderPhilosophy(repos: any[]): { philosophy: BehavioralSignals["builderPhilosophy"]; score: number } {
  let score = 0;
  
  // Check for testing/framework indicators
  const hasTests = repos.some((r) =>
    r.topics?.some((t: string) =>
      ["testing", "test", "ci-cd", "quality"].includes(t)
    )
  );
  if (hasTests) score += 25;

  // Check for architecture patterns
  const hasArchitecture = repos.some((r) =>
    r.topics?.some((t: string) =>
      ["architecture", "design-patterns", "clean-code", "solid"].includes(t)
    )
  );
  if (hasArchitecture) score += 25;

  // Check for hack/experiment repos
  const hasHacks = repos.some((r) =>
    /hack|experiment|prototype|demo|playground/i.test(r.name) ||
    r.topics?.some((t: string) =>
      ["hackathon", "experiment", "prototype"].includes(t)
    )
  );
  if (hasHacks) score += 20;

  // Check for polish indicators
  const hasPolish = repos.some((r) =>
    r.stargazers_count > 10 ||
    r.topics?.some((t: string) =>
      ["production", "polished", "mature"].includes(t)
    )
  );
  if (hasPolish) score += 30;

  if (score >= 70) return { philosophy: "perfectionist", score };
  if (score >= 55) return { philosophy: "architect", score };
  if (score >= 35) return { philosophy: "craftsman", score };
  return { philosophy: "hacker", score };
}

function analyzeCuriosity(starred: any[]): { areas: string[]; score: number } {
  const topicCounts: Record<string, number> = {};
  
  for (const repo of starred) {
    for (const topic of repo.topics || []) {
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    }
    
    // Also analyze language
    if (repo.language) {
      topicCounts[repo.language.toLowerCase()] = (topicCounts[repo.language.toLowerCase()] || 0) + 1;
    }
  }

  // Get top interest areas
  const sortedTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([topic]) => topic);

  // Score based on diversity
  const uniqueTopics = Object.keys(topicCounts).length;
  const score = Math.min(uniqueTopics * 5, 100);

  return { areas: sortedTopics, score };
}

function analyzeCompletionTendency(repos: any[]): { tendency: BehavioralSignals["completionTendency"]; score: number } {
  let completedRepos = 0;
  let abandonedRepos = 0;
  let activeRepos = 0;

  const now = Date.now();
  const sixMonthsAgo = now - 180 * 24 * 60 * 60 * 1000;

  for (const repo of repos) {
    const lastPush = new Date(repo.pushed_at).getTime();
    const created = new Date(repo.created_at).getTime();
    const age = now - created;

    // Has releases or tags
    if (repo.stargazers_count > 5 && age > 90 * 24 * 60 * 60 * 1000) {
      completedRepos++;
    }
    // Recently active
    else if (lastPush > sixMonthsAgo) {
      activeRepos++;
    }
    // Old and inactive
    else if (age > 180 * 24 * 60 * 60 * 1000) {
      abandonedRepos++;
    }
  }

  const total = repos.length || 1;
  const completionRate = completedRepos / total;
  const abandonmentRate = abandonedRepos / total;

  if (completionRate > 0.3) {
    return { tendency: "polisher", score: 80 + completionRate * 20 };
  } else if (activeRepos / total > 0.5) {
    return { tendency: "maintainer", score: 70 };
  } else if (abandonmentRate > 0.5) {
    return { tendency: "abandoner", score: 30 };
  } else {
    return { tendency: "mvp-shipper", score: 60 };
  }
}

function generateSummary(signals: BehavioralSignals): string {
  const summaries = [];
  
  if (signals.velocityScore > 70) {
    summaries.push("high-velocity shipper");
  } else if (signals.velocityScore < 40) {
    summaries.push("thoughtful architect");
  }
  
  if (signals.readmeScore > 70) {
    summaries.push("storyteller");
  }
  
  if (signals.collaborationScore > 60) {
    summaries.push("team player");
  } else {
    summaries.push("independent builder");
  }
  
  if (signals.builderScore > 70) {
    summaries.push("craftsman");
  } else if (signals.builderScore < 40) {
    summaries.push("rapid prototyper");
  }

  return summaries.join(" • ") || "unique builder";
}
