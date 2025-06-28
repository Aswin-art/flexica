import { useQuery } from "@tanstack/react-query";

const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "";

export const useLocations = (
  type: string,
  query?: {
    name?: string | null;
    facilities?: string | null;
    sort_asc?: string | null;
    tag?: string | null;
  } | null,
  page: number = 1
) => {
  return useQuery({
    queryKey: ["get-all-locations-" + page, query],
    queryFn: async () => {
      const response = await fetch(
        `${api_url}/api/locations?page=${page}&name=${
          query?.name ?? ""
        }&facilities=${query?.facilities ?? ""}&sort_asc=${
          query?.sort_asc ?? ""
        }&tag=${query?.tag ?? ""}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch locations");
      }
      return response.json();
    },
    enabled: type === "all",
    staleTime: 10000,
  });
};

export const useLocationsDashboard = (type: string) => {
  return useQuery({
    queryKey: ["get-all-locations"],
    queryFn: async () => {
      const response = await fetch(`${api_url}/api/locations`);
      if (!response.ok) {
        throw new Error("Failed to fetch locations");
      }
      return response.json();
    },
    enabled: type === "all",
    staleTime: 10000,
  });
};

export const usePotentialsDashboard = () => {
  return useQuery({
    queryKey: ["get-potentials"],
    queryFn: async () => {
      const response = await fetch(`${api_url}/api/submissions`);
      if (!response.ok) {
        throw new Error("Failed to fetch locations");
      }

      return response.json();
    },
    staleTime: 10000,
  });
};

export const usePotentials = (
  type: string,
  query?: {
    name?: string | null;
    facilities?: string | null;
    sort_asc?: string | null;
  } | null,
  page: number = 1
) => {
  return useQuery({
    queryKey: ["get-all-potentials-" + page, query],
    queryFn: async () => {
      const response = await fetch(
        `${api_url}/api/submissions?page=${page}&status=${true}&name=${
          query?.name ?? ""
        }&status=true&facilities=${query?.facilities ?? ""}&sort_asc=${
          query?.sort_asc ?? ""
        }`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch potentials");
      }
      return response.json();
    },
    enabled: type === "potential",
    staleTime: 10000,
  });
};

export const useDetailLocation = (id: string) => {
  return useQuery({
    queryKey: ["get-detail-locations-" + id],
    queryFn: async () => {
      const response = await fetch(`${api_url}/api/locations/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch place");
      }
      return response.json();
    },
    staleTime: 10000,
  });
};

export const useDetailSubmission = (id: string) => {
  return useQuery({
    queryKey: ["get-detail-submissions-" + id],
    queryFn: async () => {
      const response = await fetch(`${api_url}/api/submissions/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch place");
      }
      return response.json();
    },
    staleTime: 10000,
  });
};
