import { useState } from "react";

interface State<D> {
  error: Error | null;
  data: D | null;
  stat: "idle" | "loading" | "error" | "success";
}
//初始默认状态
const defaultInitialState: State<null> = {
  stat: "idle",
  data: null,
  error: null,
};
//用于判断是抛出错误还是promise.reject
const defaultConfig = {
  throwOnError: false,
};
//本文件用于获取服务器发来的信息，并标记该过程的状态：未开始 加载中 加载成功 加载失败
export const useAsync = <D>(
  initalState?: State<D>,
  initialConfig?: typeof defaultConfig
) => {
  let config = { ...defaultConfig };
  if (initialConfig) {
    config = initialConfig;
  }
  const [state, setState] = useState<State<D>>({
    ...defaultInitialState,
    ...initalState,
  });

  const setData = (data: D) => {
    setState({
      data,
      stat: "success",
      error: null,
    });
  };

  const setError = (error: Error) => {
    setState({
      data: null,
      stat: "error",
      error,
    });
  };

  const run = (promise: Promise<D>) => {
    if (!promise || !promise.then) {
      throw new Error("请输入Primise类型数据");
    }
    setState({
      ...state,
      stat: "loading", //run中请求数据时，会将状态改为loading
    });
    return promise
      .then((data) => {
        setData(data); //run中请求数据成功时，会将状态改为success
        return data;
      })
      .catch((error) => {
        setError(error); //run中请求数据失败时，会将状态改为error
        if (config.throwOnError) {
          return Promise.reject(error);
        } else {
          return error;
        }
      });
  };

  return {
    isIdle: state.stat === "idle",
    isLoading: state.stat === "loading",
    isError: state.stat === "error",
    isSuccess: state.stat === "success",
    run,
    setData,
    setError,
    ...state,
  };
};
