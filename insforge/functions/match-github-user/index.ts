// Match any GitHub user by username (no login required)
// Uses public GitHub data only

interface GitHubRepo {
  name: string;
  language: string | null;
  owner: { login: string };
}

interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  html_url: string;
  public_repos: number;
}

// Skill categories for personality calculation
const SKILL_CATEGORIES: Record<string, string[]> = {
  frontend: ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'Vue', 'React', 'Angular', 'Svelte', 'Tailwind'],
  backend: ['Python', 'Java', 'Go', 'Rust', 'Ruby', 'PHP', 'C', 'C++', 'Node.js', 'Django', 'Flask', 'Spring'],
  devops: ['Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Jenkins', 'GitHub Actions', 'AWS', 'Azure', 'GCP'],
  mobile: ['Swift', 'Kotlin', 'Dart', 'Flutter', 'React Native', 'Objective-C'],
  gamedev: ['C#', 'Unity', 'Unreal Engine', 'Godot', 'GameMaker'],
  ai: ['Python', 'Jupyter Notebook', 'TensorFlow', 'PyTorch', 'CUDA', 'R']
};

const PERSONALITIES = {
  frontend: {
    type: 'frontend',
    title: 'The Frontend Artisan',
    description: 'Crafts beautiful user interfaces and experiences. React, Vue, or vanilla - they make the web shine.',
    rarity: 'rare'
  },
  backend: {
    type: 'backend',
    title: 'The Systems Architect',
    description: 'Builds robust, scalable systems that power applications. Database optimization is their superpower.',
    rarity: 'rare'
  },
  fullstack: {
    type: 'fullstack',
    title: 'The Full Stack Wizard',
    description: 'Masters both frontend magic and backend sorcery. Can build entire applications from scratch.',
    rarity: 'epic'
  },
  devops: {
    type: 'devops',
    title: 'The DevOps Engineer',
    description: 'Bridges development and operations. CI/CD pipelines and infrastructure as code are their domain.',
    rarity: 'rare'
  },
  mobile: {
    type: 'mobile',
    title: 'The Mobile Developer',
    description: 'Creates apps that live in your pocket. iOS, Android, or cross-platform - they build for mobile first.',
    rarity: 'rare'
  },
  gamedev: {
    type: 'gamedev',
    title: 'The Game Creator',
    description: 'Brings worlds to life through code. Unity, Unreal, or custom engines - they build experiences.',
    rarity: 'legendary'
  },
  ai: {
    type: 'ai',
    title: 'The AI Specialist',
    description: 'Builds intelligent systems with machine learning. Neural networks and data pipelines are their playground.',
    rarity: 'epic'
  },
  versatile: {
    type: 'versatile',
    title: 'The Polyglot Developer',
    description: 'Jack of all trades, master of many. Adapts to any tech stack with ease.',
    rarity: 'epic'
  }
};

function calculatePersonality(languages: Record<string, number>): { type: string; title: string; description: string; rarity: string; breakdown: Record<string, number> } {
  const categoryScores: Record<string, number> = {
    frontend: 0,
    backend: 0,
    devops: 0,
    mobile: 0,
    gamedev: 0,
    ai: 0
  };

  // Calculate scores for each category
  for (const [language, count] of Object.entries(languages)) {
    for (const [category, langs] of Object.entries(SKILL_CATEGORIES)) {
      if (langs.includes(language)) {
        categoryScores[category] += count;
      }
    }
  }

  const total = Object.values(categoryScores).reduce((a, b) => a + b, 0);
  
  // Find dominant category
  let maxCategory = 'backend';
  let maxScore = 0;
  
  for (const [category, score] of Object.entries(categoryScores)) {
    if (score > maxScore) {
      maxScore = score;
      maxCategory = category;
    }
  }

  // Count how many categories have significant presence
  const significantCategories = Object.values(categoryScores).filter(s => s > 0).length;

  // Determine personality type
  let personality;
  if (significantCategories >= 3 && total > 5) {
    personality = PERSONALITIES.versatile;
  } else if (maxCategory === 'gamedev') {
    personality = PERSONALITIES.gamedev;
  } else if (maxCategory === 'ai') {
    personality = PERSONALITIES.ai;
  } else if (categoryScores.frontend > 0 && categoryScores.backend > 0 && total > 3) {
    personality = PERSONALITIES.fullstack;
  } else {
    personality = PERSONALITIES[maxCategory as keyof typeof PERSONALITIES] || PERSONALITIES.backend;
  }

  return {
    ...personality,
    breakdown: categoryScores
  };
}

export default async function(req: Request): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const baseUrl = Deno.env.get('INSFORGE_INTERNAL_URL') || 'http://localhost:8080';
    const apiKey = Deno.env.get('API_KEY') || '';
    
    // Parse request
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { githubUsername } = body;

    if (!githubUsername) {
      return new Response(
        JSON.stringify({ error: 'githubUsername is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Matching GitHub user:', githubUsername);

    // Step 1: Fetch GitHub user profile
    const userResponse = await fetch(`https://api.github.com/users/${githubUsername}`, {
      headers: {
        'User-Agent': 'DevMatch',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!userResponse.ok) {
      if (userResponse.status === 404) {
        return new Response(
          JSON.stringify({ error: 'GitHub user not found', username: githubUsername }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify({ error: 'Failed to fetch GitHub user', status: userResponse.status }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const githubUser: GitHubUser = await userResponse.json();
    console.log('Found GitHub user:', githubUser.login);

    // Step 2: Fetch user's public repos
    const reposResponse = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?sort=pushed&per_page=30`,
      {
        headers: {
          'User-Agent': 'DevMatch',
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    const repos: GitHubRepo[] = reposResponse.ok ? await reposResponse.json() : [];
    console.log('Found repos:', repos.length);

    // Step 3: Extract languages
    const languageCounts: Record<string, number> = {};
    for (const repo of repos) {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }
    }

    console.log('Languages found:', languageCounts);

    // Step 4: Calculate personality
    const personality = calculatePersonality(languageCounts);

    // Step 5: Get all users from database for matching
    const usersResponse = await fetch(`${baseUrl}/api/database/records/users?select=*`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const dbUsers = usersResponse.ok ? await usersResponse.json() : [];

    // Step 6: Get all skills for matching
    const skillsResponse = await fetch(`${baseUrl}/api/database/records/skills?select=*`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const allSkills = skillsResponse.ok ? await skillsResponse.json() : [];

    // Group skills by user
    const skillsByUser: Record<string, Record<string, number>> = {};
    for (const skill of allSkills) {
      if (!skillsByUser[skill.user_id]) {
        skillsByUser[skill.user_id] = {};
      }
      skillsByUser[skill.user_id][skill.skill_name] = skill.skill_count;
    }

    // Step 7: Calculate match scores
    const userLanguages = Object.keys(languageCounts);
    
    interface MatchResult {
      userId: string;
      name: string;
      avatar: string;
      skills: string[];
      matchScore: number;
      sharedSkills: string[];
      complementarySkills: string[];
      location?: string;
      bio?: string;
      htmlUrl?: string;
      personality?: { type: string; title: string; description: string; rarity: string };
    }

    const matches: MatchResult[] = [];

    for (const dbUser of dbUsers) {
      const dbUserSkills = skillsByUser[dbUser.id] || {};
      const dbUserLanguages = Object.keys(dbUserSkills);

      // Calculate shared skills
      const sharedSkills = userLanguages.filter(lang => dbUserLanguages.includes(lang));
      
      // Calculate complementary skills (skills the user doesn't have)
      const complementarySkills = dbUserLanguages.filter(lang => !userLanguages.includes(lang));

      // Calculate score
      let score = 0;
      
      // Shared skills: +15 each
      score += sharedSkills.length * 15;
      
      // Complementary skills: +10 each (good for collaboration)
      score += Math.min(complementarySkills.length * 10, 50);
      
      // Location bonus (if available)
      if (githubUser.location && dbUser.location && 
          githubUser.location.toLowerCase().includes(dbUser.location.toLowerCase())) {
        score += 10;
      }

      // Normalize score to 0-100
      score = Math.min(score, 100);

      if (dbUserLanguages.length > 0) {
        matches.push({
          userId: dbUser.id,
          name: dbUser.name,
          avatar: dbUser.avatar_url,
          skills: dbUserLanguages,
          matchScore: score,
          sharedSkills,
          complementarySkills,
          location: dbUser.location,
          bio: dbUser.bio,
          htmlUrl: dbUser.html_url,
          personality: dbUser.personality_type ? {
            type: dbUser.personality_type,
            title: dbUser.personality_title,
            description: dbUser.personality_description,
            rarity: dbUser.personality_rarity
          } : undefined
        });
      }
    }

    // Sort by match score
    matches.sort((a, b) => b.matchScore - a.matchScore);

    // Return results
    return new Response(
      JSON.stringify({
        success: true,
        user: {
          login: githubUser.login,
          name: githubUser.name || githubUser.login,
          avatar: githubUser.avatar_url,
          bio: githubUser.bio,
          location: githubUser.location,
          htmlUrl: githubUser.html_url,
          publicRepos: githubUser.public_repos
        },
        skills: Object.entries(languageCounts).map(([name, count]) => ({ name, count })),
        personality,
        matches: matches.slice(0, 10) // Top 10 matches
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Match error:', error);
    return new Response(
      JSON.stringify({ error: 'Match failed', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
