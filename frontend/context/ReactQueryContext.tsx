import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false, // No automatic retries for queries
			staleTime: 30 * 1000, // 30 seconds: messages should be relatively fresh
			gcTime: 5 * 60 * 1000, // 5 minutes: cache garbage collection timing
			refetchOnWindowFocus: true, // Important: fetch latest messages when user returns to the window
			refetchOnReconnect: true, // Refetch when network reconnects
			refetchInterval: false, // Disable polling – rely on WebSocket for real-time updates
		},
		mutations: {
			retry: 0, // No automatic retries for mutations – users should retry manually on failure
		},
	},
});

export function ReactQueryProvider({ children }: { children: ReactNode }) {
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
