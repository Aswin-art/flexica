import { useQuery } from "@tanstack/react-query";

const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "";

export const useTags = () => {
  return useQuery({
    queryKey: ["get-tags"],
    queryFn: async () => {
      const response = await fetch(`${api_url}/api/tags`);
      if (!response.ok) {
        throw new Error("Failed to fetch tags");
      }
      return response.json();
    },
    staleTime: 10000,
  });
};
