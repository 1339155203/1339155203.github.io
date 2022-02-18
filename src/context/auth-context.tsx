import React, { ReactNode } from "react";
import * as auth from "auth-provider";
import { User } from "screens/project-list/search-panel";
import { http } from "utils/http";
import { useMount } from "utils";
import { FullPageErrorFallback, FullPageLoading } from "components/lib";
import { useAsync } from "utils/use-async";
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

//登陆以后刷新，使用useMount挂载，通过http去请求token获取user
const bootstrapUser = async () => {
  let user = null;
  const token = auth.getToken();
  //如果已经登陆。即token存在，那么给user赋值而不是让其为null，导致刷新又得重新登陆
  if (token) {
    const data = await http("me", { token });
    user = data.user;
  }
  return user;
};
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: user,
    setData: setUser,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
  } = useAsync<User | null>();
  //把auth-provider中写好的login，register，logout和获取到的user信息通过useContext中的value属性传给所有子组件
  const login = (form: AuthForm) => auth.login(form).then(setUser);
  const register = (form: AuthForm) => auth.register(form).then(setUser);
  const logout = () => auth.logout().then(() => setUser(null));

  //初始化
  useMount(() => {
    //async函数返回一个 Promise 对象，可以使用then方法添加回调函数，获得的值为函数的返回值
    run(bootstrapUser());
  });
  if (isIdle || isLoading) {
    return <FullPageLoading />;
  }
  if (isError) {
    return <FullPageErrorFallback error={error} />;
  }

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
