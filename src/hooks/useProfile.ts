import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOwnProfile,
  getPublicProfile,
  updateOwnProfile,
} from "@/lib/endpoints";

export const useOwnProfile = () =>
  useQuery({
    queryKey: ["profile", "me"],
    queryFn: getOwnProfile,
  });

export const usePublicProfile = (id: number) =>
  useQuery({
    queryKey: ["profile", id],
    queryFn: () => getPublicProfile(id),
  });

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateOwnProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
  });
};