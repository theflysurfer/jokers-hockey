import { useQuery } from "@tanstack/react-query";
import type { Video } from "@shared/schema";

export function useVideos(category?: string) {
  return useQuery<Video[]>({
    queryKey: ["videos", category],
    queryFn: async () => {
      const url = category ? `/api/videos?category=${category}` : "/api/videos";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch videos");
      }
      return response.json();
    },
  });
}

export function useVideosByMatch(matchId: string) {
  return useQuery<Video[]>({
    queryKey: ["videos", "match", matchId],
    queryFn: async () => {
      const response = await fetch(`/api/videos/match/${matchId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch videos");
      }
      return response.json();
    },
    enabled: !!matchId,
  });
}
