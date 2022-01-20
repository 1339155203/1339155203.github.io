import React, { ReactNode } from "react";
import { AuthProvider } from "context/auth-context";
export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      {children}
      {console.log(children) /*children相当于里面的所有子标签 */}
    </AuthProvider>
  );
};
