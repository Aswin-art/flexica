"use client";
// RTK Query
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// BProgress
import { ProgressProvider } from "@bprogress/next/app";

const queryClient = new QueryClient();
const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ProgressProvider
        height="4px"
        color="#2373eb"
        options={{ showSpinner: false }}
        shallowRouting
      >
        {children}
      </ProgressProvider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default Providers;
