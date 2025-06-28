import { useQuery } from "@tanstack/react-query";

const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "";

export const useReports = () => {
  return useQuery({
    queryKey: ["get-reports"],
    queryFn: async () => {
      const response = await fetch(`${api_url}/api/reports`);
      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }
      return response.json();
    },
    staleTime: 10000,
  });
};
