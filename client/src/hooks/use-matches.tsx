import { useQuery } from "@tanstack/react-query";
import type { Match } from "@shared/schema";

export function useUpcomingMatches(limit = 5) {
  return useQuery<Match[]>({
    queryKey: ["matches", "upcoming", limit],
    queryFn: async () => {
      const response = await fetch(`/api/matches/upcoming?limit=${limit}`);
      if (!response.ok) {
        throw new Error("Failed to fetch upcoming matches");
      }
      return response.json();
    },
  });
}

export function useRecentResults(limit = 3) {
  return useQuery<Match[]>({
    queryKey: ["matches", "results", limit],
    queryFn: async () => {
      const response = await fetch(`/api/matches/results?limit=${limit}`);
      if (!response.ok) {
        throw new Error("Failed to fetch recent results");
      }
      return response.json();
    },
  });
}

export function useAllMatches() {
  return useQuery<Match[]>({
    queryKey: ["matches", "all"],
    queryFn: async () => {
      const response = await fetch("/api/matches");
      if (!response.ok) {
        throw new Error("Failed to fetch matches");
      }
      return response.json();
    },
  });
}

export function useMatch(id: string) {
  return useQuery<Match>({
    queryKey: ["matches", id],
    queryFn: async () => {
      const response = await fetch(`/api/matches/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch match");
      }
      return response.json();
    },
    enabled: !!id,
  });
}
