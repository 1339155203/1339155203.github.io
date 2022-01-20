import React, { ReactNode, useState } from "react";
import * as auth from "auth-provider";
import { User } from "screens/project-list/search-panel";
interface AuthForm {
  username: string;
  password: string;
}
//创建容器
const AuthContext = React.createContext<
  | {
      user: User | null;
      login: (form: AuthForm) => Promise<void>;
      register: (form: AuthForm) => Promise<void>;
      logout: () => Promise<void>;
    }
  | undefined
>(undefined);
AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  //point free
  const login = (form: AuthForm) => auth.login(form).then(setUser);
  const register = (form: AuthForm) => auth.register(form).then(setUser);
  const logout = () => auth.logout().then(() => setUser(null));
  //重点：
  /*
    下面return中必须带有children，相当于
    return 
    		<AuthContext.Provider value={num}>
            children中的所有子标签：
				<Son1 />
				<Son2 />
			</AuthContext.Provider>
    */
  //给被<AppProviders>包裹的所有子标签，都传入value={{user,login,register,logout}}
  return (
    <AuthContext.Provider
      children={children}
      value={{ user, login, register, logout }}
    />
  );
};

//在被<AppProviders>包裹的子标签中使用，用于获取value={{user,login,register,logout}}中的值
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth必须在被<AppProviders>包裹的子标签中使用");
  }
  return context;
};
