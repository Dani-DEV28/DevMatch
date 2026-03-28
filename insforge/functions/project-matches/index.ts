// Find developers who match a project's skill requirements
// Uses the same matching logic as the main matching algorithm

export default async function(req: Request): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const baseUrl = Deno.env.get('INSFORGE_INTERNAL_URL') || 'http://localhost:8080';
  const apiKey = Deno.env.get('API_KEY') || '';

  try {
    const url = new URL(req.url);
    let skillsNeeded: string[] = [];
    let excludeOwnerId: string | null = null;

    // Get skills from query params or body
    if (req.method === 'GET') {
      const skillsParam = url.searchParams.get('skills');
      if (skillsParam) {
        skillsNeeded = skillsParam.split(',').map(s => s.trim()).filter(Boolean);
      }
      excludeOwnerId = url.searchParams.get('excludeOwner');
    } else if (req.method === 'POST') {
      const body = await req.json();
      skillsNeeded = body.skills || [];
      excludeOwnerId = body.excludeOwner || null;
    }

    if (!skillsNeeded.length) {
      return new Response(
        JSON.stringify({ error: 'Skills are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Finding matches for skills:', skillsNeeded);

    // Get all users with their skills
    const usersResponse = await fetch(`${baseUrl}/api/database/records/users?select=*`, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    const users = await usersResponse.json();

    // Get all skills
    const skillsResponse = await fetch(`${baseUrl}/api/database/records/skills?select=*`, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    const allSkills = await skillsResponse.json();

    // Group skills by user
    const skillsByUser: Record<string, Record<string, number>> = {};
    for (const skill of allSkills) {
      if (!skillsByUser[skill.user_id]) {
        skillsByUser[skill.user_id] = {};
      }
      skillsByUser[skill.user_id][skill.skill_name] = skill.skill_count;
    }

    // Normalize skills for matching
    const normalizeSkill = (skill: string) => skill.toLowerCase().replace(/[-_\s]/g, '');

    // Calculate match scores
    interface MatchedUser {
      id: string;
      name: string;
      avatar_url: string;
      bio: string;
      location: string;
      html_url: string;
      personality_type: string;
      personality_title: string;
      personality_rarity: string;
      skills: string[];
      matchingSkills: string[];
      matchScore: number;
      matchReason: string;
    }

    const matches: MatchedUser[] = [];

    for (const user of users) {
      // Skip project owner
      if (excludeOwnerId && user.id === excludeOwnerId) continue;

      const userSkills = skillsByUser[user.id] || {};
      const userSkillNames = Object.keys(userSkills);

      if (userSkillNames.length === 0) continue;

      // Find matching skills
      const matchingSkills: string[] = [];
      const complementarySkills: string[] = [];

      for (const neededSkill of skillsNeeded) {
        const normalizedNeeded = normalizeSkill(neededSkill);
        
        for (const userSkill of userSkillNames) {
          const normalizedUser = normalizeSkill(userSkill);
          
          if (normalizedNeeded === normalizedUser || 
              normalizedUser.includes(normalizedNeeded) || 
              normalizedNeeded.includes(normalizedUser)) {
            if (!matchingSkills.includes(userSkill)) {
              matchingSkills.push(userSkill);
            }
          }
        }
      }

      // Calculate match score
      let matchScore = 0;
      let matchReason = '';

      if (matchingSkills.length > 0) {
        // Direct skill match: 60 points per skill, max 60
        matchScore += Math.min(matchingSkills.length * 60, 60);
        matchReason = `Has ${matchingSkills.length} matching skill${matchingSkills.length > 1 ? 's' : ''}: ${matchingSkills.slice(0, 3).join(', ')}`;
      }

      // Check for complementary skills (related technologies)
      const SKILL_RELATIONSHIPS: Record<string, string[]> = {
        'react': ['javascript', 'typescript', 'next.js', 'redux'],
        'vue': ['javascript', 'typescript', 'nuxt'],
        'angular': ['typescript', 'javascript'],
        'node.js': ['javascript', 'typescript', 'express'],
        'python': ['django', 'flask', 'fastapi'],
        'docker': ['kubernetes', 'aws', 'devops'],
        'machine learning': ['python', 'tensorflow', 'pytorch'],
        'ai': ['python', 'tensorflow', 'pytorch', 'machine learning'],
      };

      for (const neededSkill of skillsNeeded) {
        const relatedSkills = SKILL_RELATIONSHIPS[neededSkill.toLowerCase()] || [];
        for (const related of relatedSkills) {
          for (const userSkill of userSkillNames) {
            if (normalizeSkill(userSkill) === normalizeSkill(related)) {
              if (!matchingSkills.includes(userSkill) && !complementarySkills.includes(userSkill)) {
                complementarySkills.push(userSkill);
              }
            }
          }
        }
      }

      // Complementary skills: 20 points per skill, max 40
      if (complementarySkills.length > 0) {
        matchScore += Math.min(complementarySkills.length * 20, 40);
        if (matchReason) {
          matchReason += `. Also knows related: ${complementarySkills.slice(0, 2).join(', ')}`;
        } else {
          matchReason = `Has related skills: ${complementarySkills.slice(0, 3).join(', ')}`;
        }
      }

      // Bonus for having a personality card (shows active user)
      if (user.personality_type) {
        matchScore += 5;
      }

      // Only include users with some relevance
      if (matchScore > 0) {
        matches.push({
          id: user.id,
          name: user.name,
          avatar_url: user.avatar_url,
          bio: user.bio,
          location: user.location,
          html_url: user.html_url,
          personality_type: user.personality_type,
          personality_title: user.personality_title,
          personality_rarity: user.personality_rarity,
          skills: userSkillNames,
          matchingSkills,
          matchScore: Math.min(matchScore, 100),
          matchReason
        });
      }
    }

    // Sort by match score
    matches.sort((a, b) => b.matchScore - a.matchScore);

    // Return top matches
    const topMatches = matches.slice(0, 10);

    return new Response(
      JSON.stringify({
        success: true,
        skillsNeeded,
        totalMatches: matches.length,
        matches: topMatches
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Project match error:', error);
    return new Response(
      JSON.stringify({ error: 'Match failed', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
