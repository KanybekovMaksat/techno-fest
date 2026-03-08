import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/* ===== Types ===== */

export interface TeamMember {
    id?: number
    registration_id?: number
    name: string
    age: number
}

export interface Registration {
    id?: number
    institution: string
    leader_name: string
    leader_phone: string
    event: string
    team_name: string | null
    created_at?: string
    team_members?: TeamMember[]
}
