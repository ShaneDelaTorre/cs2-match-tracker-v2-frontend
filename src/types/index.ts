export interface User {
  id: number;
  username: string;
  email: string;
  rank: string;
  bio: string;
  avatar_url: string;
}

export interface PublicUser {
  id: number;
  username: string;
  rank: string;
  bio: string;
  avatar_url: string;
}

export interface MapType {
  id: number;
  name: string;
  image_url: string;
}

export interface RoundEvent {
  id: number;
  round_number: number;
  round_result: "Win" | "Loss";
  kills: number;
  headshots: number;
  survived: boolean;
  mvp: boolean;
}

export interface MatchStat {
  kills: number;
  deaths: number;
  assists: number;
  headshots: number;
  mvp_rounds: number;
  score: number;
  kd_ratio: number;
  headshot_percentage: number;
}

export interface Match {
  id: number;
  map: MapType;
  game_mode: "Premier" | "Competitive";
  result: "Win" | "Loss" | "Draw";
  team_score: number;
  opponent_score: number;
  duration: number;
  played_at: string;
  rounds: RoundEvent[];
  stat: MatchStat;
}

export interface MapStat {
  map: string;
  played: number;
  won: number;
  win_rate: number;
}

export interface CareerSummary {
  total_matches: number;
  wins: number;
  losses: number;
  draws: number;
  win_rate: number;
  avg_kd: number;
  avg_headshot_pct: number;
  map_stats: MapStat[];
  best_map: MapStat | null;
  current_form: ("Win" | "Loss" | "Draw")[];
}

export interface OwnProfile extends User {
  career_summary: CareerSummary;
}

export interface PublicProfile extends PublicUser {
  career_summary: CareerSummary;
  are_friends: boolean;
}

export interface FriendRequest {
  id: number;
  sender: PublicUser;
  receiver: PublicUser;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
}

export interface ChatHistory {
  id: number;
  sender: PublicUser;
  receiver: PublicUser;
  body: string;
  is_read: boolean;
  sent_at: string;
}

export interface ChatMessage {
  type: string;
  message_id: number;
  sender_id: number;
  body: string;
  sent_at: string
}

export interface NewsItem {
  id: number;
  source_name: string;
  title: string;
  url: string;
  summary: string;
  published_at: string;
  fetched_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface TokenPair {
  access: string;
  refresh: string;
}