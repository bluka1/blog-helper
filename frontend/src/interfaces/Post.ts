export interface Post {
  id: number
  title: string
  content: string
  user_id: number
  author_name: string
  author_auth0_id: string
  created_at: string
  updated_at: string | null
}
