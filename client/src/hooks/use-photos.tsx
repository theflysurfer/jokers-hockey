import { useQuery } from "@tanstack/react-query";
import type { Photo } from "@shared/schema";

export function usePhotos(category?: string) {
  return useQuery<Photo[]>({
    queryKey: ["photos", category],
    queryFn: async () => {
      const url = category ? `/api/photos?category=${category}` : "/api/photos";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch photos");
      }
      return response.json();
    },
  });
}

export function usePhotosByMatch(matchId: string) {
  return useQuery<Photo[]>({
    queryKey: ["photos", "match", matchId],
    queryFn: async () => {
      const response = await fetch(`/api/photos/match/${matchId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch photos");
      }
      return response.json();
    },
    enabled: !!matchId,
  });
}
