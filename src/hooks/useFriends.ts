import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFriends,
  getFriendRequests,
  searchAccounts,
  sendFriendRequest,
  respondToFriendRequest,
} from "@/lib/endpoints";

export const useFriends = () =>
  useQuery({
    queryKey: ["friends"],
    queryFn: getFriends,
  });

export const useFriendRequests = () =>
  useQuery({
    queryKey: ["friend-requests"],
    queryFn: getFriendRequests,
  });

export const useAccountSearch = (query: string) =>
  useQuery({
    queryKey: ["user-search", query],
    queryFn: () => searchAccounts(query),
    enabled: query.length > 0,
  });

export const useSendFriendRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });
};

export const useRespondToFriendRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, accepting }: { id: number; accepting: boolean }) =>
      respondToFriendRequest(id, accepting),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["friend-requests"] });
    },
  });
};