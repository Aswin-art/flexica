import { useQuery } from "@tanstack/react-query";

const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "";

export const useFeedbacks = () => {
  return useQuery({
    queryKey: ["get-feedbacks"],
    queryFn: async () => {
      const response = await fetch(`${api_url}/api/feedbacks`);
      if (!response.ok) {
        throw new Error("Failed to fetch feedbacks");
      }
      return response.json();
    },
    staleTime: 10000,
  });
};
