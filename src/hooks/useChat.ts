import { useQuery } from "@tanstack/react-query";
import { getChatHistory } from "@/lib/endpoints";

export const useChat = (recepientId: number) => 
    useQuery({
        queryKey: ["chat-history", recepientId],
        queryFn: () => getChatHistory(recepientId),
        staleTime: 0,
    });
