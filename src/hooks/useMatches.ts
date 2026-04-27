import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMatches,
  getMatch,
  createMatch,
  deleteMatch,
  getMatchStateAtRound,
  getMaps,
} from "@/lib/endpoints";

export const useMatches = (page = 1) =>
  useQuery({
    queryKey: ["matches", page],
    queryFn: () => getMatches(page),
  });

export const useMatch = (id: number) =>
  useQuery({
    queryKey: ["match", id],
    queryFn: () => getMatch(id),
  });

export const useCreateMatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
  });
};

export const useDeleteMatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
  });
};

export const useMatchStateAtRound = (matchId: number, roundN: number) =>
  useQuery({
    queryKey: ["match", matchId, "state", roundN],
    queryFn: () => getMatchStateAtRound(matchId, roundN),
    enabled: roundN > 0,
  });

export const useMaps = () =>
  useQuery({
    queryKey: ["maps"],
    queryFn: getMaps,
    staleTime: Infinity,
  });