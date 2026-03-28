// Vision-First Archetypes for the Agentic Era
// These define creative roles, not technical skills

export type ArchetypeType = 
  | "visionary"
  | "polisher"
  | "connector"
  | "systems-thinker"
  | "vibe-curator"
  | "prompt-architect";

export interface Archetype {
  type: ArchetypeType;
  title: string;
  emoji: string;
  description: string;
  superpower: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  complementaryArchetypes: ArchetypeType[];
  skillSignals: string[]; // GitHub signals that indicate this archetype
  color: string;
}

export const ARCHETYPES: Record<ArchetypeType, Archetype> = {
  visionary: {
    type: "visionary",
    title: "The Visionary",
    emoji: "🔮",
    description: "Spots opportunities others miss and paints a compelling picture of what's possible.",
    superpower: "Transforms vague ideas into inspiring visions that motivate teams",
    rarity: "epic",
    complementaryArchetypes: ["polisher", "systems-thinker", "vibe-curator"],
    skillSignals: ["experimental", "diverse-projects", "early-adopter", "creative"],
    color: "from-purple-500 to-pink-500",
  },
  polisher: {
    type: "polisher",
    title: "The Polisher",
    emoji: "✨",
    description: "Makes things feel magical. Focuses on the final 20% that separates good from great.",
    superpower: "Adds the sparkle that makes users fall in love with a product",
    rarity: "rare",
    complementaryArchetypes: ["visionary", "vibe-curator", "prompt-architect"],
    skillSignals: ["ui-focused", "animation", "design-systems", "attention-to-detail"],
    color: "from-amber-400 to-orange-500",
  },
  connector: {
    type: "connector",
    title: "The Connector",
    emoji: "🔗",
    description: "Bridges domains. A developer who is also a marathon runner building fitness apps.",
    superpower: "Unique perspective from cross-domain expertise that creates novel solutions",
    rarity: "epic",
    complementaryArchetypes: ["visionary", "systems-thinker"],
    skillSignals: ["domain-specific", "specialized-knowledge", "niche-focus"],
    color: "from-emerald-400 to-teal-500",
  },
  "systems-thinker": {
    type: "systems-thinker",
    title: "The Systems Thinker",
    emoji: "🏗️",
    description: "Architects complex projects. Designs the foundation that everything else builds on.",
    superpower: "Structures chaos into scalable, maintainable systems",
    rarity: "rare",
    complementaryArchetypes: ["visionary", "connector", "prompt-architect"],
    skillSignals: ["backend-heavy", "database-design", "architecture", "devops"],
    color: "from-blue-500 to-indigo-600",
  },
  "vibe-curator": {
    type: "vibe-curator",
    title: "The Vibe Curator",
    emoji: "🎨",
    description: "Crafts experiences. Makes interactions delightful and memorable.",
    superpower: "Creates emotional connections through thoughtful design and micro-interactions",
    rarity: "legendary",
    complementaryArchetypes: ["polisher", "visionary"],
    skillSignals: ["frontend-heavy", "creative-coding", "animation", "ux-focus"],
    color: "from-rose-400 to-pink-600",
  },
  "prompt-architect": {
    type: "prompt-architect",
    title: "The Prompt Architect",
    emoji: "🤖",
    description: "AI whisperer. Gets the most from LLMs and knows how to orchestrate AI tools.",
    superpower: "10x productivity through masterful AI collaboration and prompt engineering",
    rarity: "legendary",
    complementaryArchetypes: ["polisher", "systems-thinker", "visionary"],
    skillSignals: ["ai-ml", "rapid-prototyping", "experimental", "llm-integration"],
    color: "from-cyan-400 to-blue-500",
  },
};

// Domain interests for vision matching
export const DOMAIN_INTERESTS = [
  { id: "climate-tech", label: "🌍 Climate Tech", category: "impact" },
  { id: "web3", label: "⛓️ Web3 / Crypto", category: "tech" },
  { id: "indie-games", label: "🎮 Indie Games", category: "creative" },
  { id: "ai-ml", label: "🤖 AI / Machine Learning", category: "tech" },
  { id: "social-impact", label: "💚 Social Impact", category: "impact" },
  { id: "dev-tools", label: "🛠️ Developer Tools", category: "tech" },
  { id: "creative-coding", label: "🎨 Creative Coding", category: "creative" },
  { id: "health-fitness", label: "💪 Health & Fitness", category: "lifestyle" },
  { id: "education", label: "📚 Education", category: "impact" },
  { id: "fintech", label: "💰 FinTech", category: "tech" },
  { id: "productivity", label: "⚡ Productivity", category: "lifestyle" },
  { id: "open-source", label: "📖 Open Source", category: "community" },
] as const;

export type DomainInterestId = typeof DOMAIN_INTERESTS[number]["id"];

// Builder philosophy options
export const BUILDER_PHILOSOPHIES = [
  {
    id: "ship-fast",
    label: "🚀 Ship fast, iterate later",
    description: "Get it out there and learn from real users",
  },
  {
    id: "polish-first",
    label: "🎨 Polish before publish",
    description: "First impressions matter - make it shine from day one",
  },
  {
    id: "experiment",
    label: "🔬 Experiment and explore",
    description: "Follow curiosity and see where it leads",
  },
  {
    id: "solve-real",
    label: "💼 Solve real problems",
    description: "Build what people actually need, not what's cool",
  },
] as const;

export type BuilderPhilosophyId = typeof BUILDER_PHILOSOPHIES[number]["id"];

// AI Workflow styles
export const AI_WORKFLOWS = [
  {
    id: "prompt-engineer",
    label: "Prompt Engineer",
    description: "🎯 I iterate fast with v0/Cursor - AI does the heavy lifting",
    icon: "⚡",
  },
  {
    id: "ai-augmented",
    label: "AI-Augmented",
    description: "🤝 AI for scaffolding, I craft the details",
    icon: "🤝",
  },
  {
    id: "traditionalist",
    label: "Traditionalist",
    description: "✍️ I write most code myself, AI for research",
    icon: "✍️",
  },
  {
    id: "purist",
    label: "Purist",
    description: "🧠 Prefer to understand every line deeply",
    icon: "🧠",
  },
] as const;

export type AIWorkflowId = typeof AI_WORKFLOWS[number]["id"];

// Project status options
export const PROJECT_STATUS = [
  { id: "has-idea", label: "💡 Has Idea", description: "I have a vision and need a team" },
  { id: "open-ideas", label: "🌱 Open to Ideas", description: "Looking to join someone's vision" },
  { id: "exploring", label: "🔍 Exploring", description: "Still figuring out what to build" },
  { id: "has-team", label: "👥 Has Team", description: "Already formed, but open to collaborators" },
] as const;

export type ProjectStatusId = typeof PROJECT_STATUS[number]["id"];

// Helper function to get archetype by type
export function getArchetype(type: ArchetypeType): Archetype {
  return ARCHETYPES[type];
}

// Helper to calculate archetype compatibility score
export function getArchetypeCompatibility(
  archetype1: ArchetypeType,
  archetype2: ArchetypeType
): number {
  if (archetype1 === archetype2) return 30; // Same archetype - some overlap but not ideal
  
  const archetype = ARCHETYPES[archetype1];
  if (archetype.complementaryArchetypes.includes(archetype2)) {
    return 100; // Perfect complement
  }
  
  // Check if reverse is true
  const archetype2Data = ARCHETYPES[archetype2];
  if (archetype2Data.complementaryArchetypes.includes(archetype1)) {
    return 100;
  }
  
  return 60; // Neutral
}
