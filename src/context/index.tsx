import React, { ReactNode } from "react";
import { AuthProvider } from "context/auth-context";
import { QueryClientProvider, QueryClient } from "react-query";
export const AppProviders = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        {console.log(children) /*children相当于里面的所有子标签 */}
      </AuthProvider>
    </QueryClientProvider>
  );
};
