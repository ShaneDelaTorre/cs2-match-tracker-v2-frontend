import { useQuery } from "@tanstack/react-query"
import { getNewsItems } from "@/lib/endpoints"

export const useNews = () =>
  useQuery({
    queryKey: ["news"],
    queryFn: getNewsItems,
    refetchInterval: 60000,
  })