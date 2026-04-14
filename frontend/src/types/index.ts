export interface User {
  id: number
  email: string
  name: string
  picture: string
  plan: 'free' | 'premium'
}

export interface Course {
  id: number
  title: string
  week_number: number
  description: string
}

export interface Section {
  id: number
  order: number
  title: string
  is_free: boolean
}

export interface SectionContent {
  id: number
  title: string
  content_md: string
}

export interface Progress {
  id: number
  section_id: number
  completed_at: string
}
