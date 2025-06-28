import { useQuery } from "@tanstack/react-query";

const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "";

export const useCardDashboardData = () => {
  return useQuery({
    queryKey: ["get-dashboard-data"],
    queryFn: async () => {
      const response = await fetch(`${api_url}/api/dashboards/all`);
      if (!response.ok) {
        throw new Error("Failed to fetch places");
      }
      return response.json();
    },
    staleTime: 10000,
  });
};

export const useSubmissionCardData = () => {
  return useQuery({
    queryKey: ["get-submission-card-data"],
    queryFn: async () => {
      const response = await fetch(`${api_url}/api/dashboards/submission`);
      if (!response.ok) {
        throw new Error("Failed to fetch places");
      }
      return response.json();
    },
    staleTime: 10000,
  });
};

export const useVisitorChartData = () => {
  return useQuery({
    queryKey: ["get-visitor-chart-data"],
    queryFn: async () => {
      const response = await fetch(`${api_url}/api/visitors`);
      if (!response.ok) {
        throw new Error("Failed to fetch places");
      }
      return response.json();
    },
    staleTime: 10000,
  });
};
