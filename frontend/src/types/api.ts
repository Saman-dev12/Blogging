// API Types
export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBlogPayload {
  title: string;
  content: string;
  author_id: string;
}

export interface UpdateBlogPayload {
  title: string;
  content: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
}
