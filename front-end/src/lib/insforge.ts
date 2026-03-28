import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type User = {
  id: string
  github_id: string
  name: string
  avatar_url: string
  bio: string
  location: string
  html_url: string
}

export type Skill = {
  id: string
  user_id: string
  skill_name: string
  skill_count: number
}

export type Match = {
  userId: string
  name: string
  avatar: string
  skills: string[]
  matchScore: number
  sharedSkills: string[]
  location?: string
  bio?: string
  htmlUrl?: string
}
