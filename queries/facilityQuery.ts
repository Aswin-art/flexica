import { useQuery } from "@tanstack/react-query";

const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "";

export const useFacilities = () => {
  return useQuery({
    queryKey: ["get-facilities"],
    queryFn: async () => {
      const response = await fetch(`${api_url}/api/facilities`);
      if (!response.ok) {
        throw new Error("Failed to fetch facilities");
      }
      return response.json();
    },
    staleTime: 10000,
  });
};
