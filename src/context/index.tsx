import React, { ReactNode } from "react";
import { AuthProvider } from "context/auth-context";
import { QueryClientProvider, QueryClient } from "react-query";
export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider>
        {children}
        {console.log(children) /*children相当于里面的所有子标签 */}
      </AuthProvider>
    </QueryClientProvider>
  );
};
