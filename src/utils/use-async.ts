import { useCallback, useState } from "react";
import { useMountedRef } from "utils";
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
  const mountedRef = useMountedRef();
  // useState直接传入函数的含义是：惰性初始化；所以，要用useState保存函数，不能直接传入函数
  // https://codesandbox.io/s/blissful-water-230u4?file=/src/App.js
  const [retry, setRetry] = useState(() => () => {});

  //当你的useEffect等hooks的依赖是个函数时，大概率需要将函数包裹一层useCallback，否则作为引用类型的函数很可能造成无限render
  //useMemo同理,不过useMemo返回的是函数return的值，而useCallback返回的是函数本身
  const setData = useCallback((data: D) => {
    setState({
      data,
      stat: "success",
      error: null,
    });
  }, []);

  const setError = useCallback((error: Error) => {
    setState({
      data: null,
      stat: "error",
      error,
    });
  }, []);

  const run = useCallback(
    (promise: Promise<D>, runConfig?: { retry: () => Promise<D> }) => {
      if (!promise || !promise.then) {
        throw new Error("请传入 Promise 类型数据");
      }
      setRetry(() => () => {
        if (runConfig?.retry) {
          run(runConfig?.retry(), runConfig);
        }
      });
      //setState的第二种用法，传入一个函数，入参为之前的值，返回的值为更新的值
      //这种情况在当改变的state作为hooks的依赖时，会造成setState和依赖state相互嵌套而无限render的情况
      setState((prevState) => ({
        ...prevState,
        stat: "loading", //run中请求数据时，会将状态改为loading
      }));
      return promise
        .then((data) => {
          if (mountedRef.current) {
            setData(data); //run中请求数据成功时，会将状态改为success
          }
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
    },
    [config.throwOnError, mountedRef, setData, setError]
  );

  return {
    isIdle: state.stat === "idle",
    isLoading: state.stat === "loading",
    isError: state.stat === "error",
    isSuccess: state.stat === "success",
    run,
    setData,
    setError,
    retry,
    ...state,
  };
};
