import api from "@/lib/api";
import {
  OwnProfile,
  PublicProfile,
  Match,
  MapType,
  FriendRequest,
  ChatHistory,
  TokenPair,
  PaginatedResponse,
} from "@/types";

// Auth Endpoints - Login and Registration
export const createToken = (credentials: {
  username: string;
  password: string;
}): Promise<TokenPair> =>
  api.post("/auth/jwt/create/", credentials).then((r) => r.data);

export const registerUser = (data: {
  username: string;
  email: string;
  password: string;
  re_password: string;
}): Promise<void> =>
  api.post("/auth/users/", data).then((r) => r.data);

export const logout = (): Promise<void> => api.post("/auth/logout/").then((r) => r.data);

// Accounts Endpoints 
export const getOwnProfile = (): Promise<OwnProfile> =>
  api.get("/api/accounts/me/").then((r) => r.data);

export const updateOwnProfile = (data: Partial<OwnProfile>): Promise<OwnProfile> =>
  api.patch("/api/accounts/me/", data).then((r) => r.data);

export const getPublicProfile = (id: number): Promise<PublicProfile> =>
  api.get(`/api/accounts/users/${id}/`).then((r) => r.data);

export const getFriends = (): Promise<PublicProfile[]> =>
  api.get("/api/accounts/friends/").then((r) => r.data.results);

export const getFriendRequests = (): Promise<FriendRequest[]> =>
  api.get("/api/accounts/friend-requests/").then((r) => r.data);

export const sendFriendRequest = (receiverId: number): Promise<FriendRequest> =>
  api.post("/api/accounts/friend-requests/", { receiver_id: receiverId }).then((r) => r.data);

export const respondToFriendRequest = (
  id: number,
  accepting: boolean
): Promise<FriendRequest> =>
  api.patch(`/api/accounts/friend-requests/${id}/respond/`, { accepting }).then((r) => r.data);

// Matches Endpoints
export const getMatches = (page = 1): Promise<PaginatedResponse<Match>> =>
  api.get("/api/matches/", { params: { page } }).then((r) => r.data);

export const getMatch = (id: number): Promise<Match> =>
  api.get(`/api/matches/${id}/`).then((r) => r.data);

export const createMatch = (data: unknown): Promise<Match> =>
  api.post("/api/matches/", data).then((r) => r.data);

export const deleteMatch = (id: number): Promise<void> =>
  api.delete(`/api/matches/${id}/`).then((r) => r.data);

export const getMatchStateAtRound = (
  matchId: number,
  roundN: number
): Promise<Record<string, number>> =>
  api.get(`/api/matches/${matchId}/state/${roundN}/`).then((r) => r.data);

// Maps Endpoints
export const getMaps = (): Promise<MapType[]> =>
  api.get("/api/matches/maps/").then((r) => r.data.results);

// Chats Endpoints
export const getChatHistory = (recepientId: number): Promise<ChatHistory[]> =>
  api.get(`api/chat/${recepientId}`).then((r) => r.data);
