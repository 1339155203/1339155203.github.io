import { useCallback, useReducer, useState } from "react";
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
  //该reducer的操作：1....state保留之前的值，2. ...action覆盖新传入的值，内部对state没有其他操作，只是用于更新state
  const [state, dispatch] = useReducer(
    (state: State<D>, action: Partial<State<D>>) => ({ ...state, ...action }),
    {
      ...defaultInitialState,
      ...initalState,
    }
  );
  //改写dispatch，使其功能更全面
  const useSafeDispatch = <T>(dispatch: (...args: T[]) => void) => {
    //防止页面数据等待时就卸载组件引发的错误
    const mountedRef = useMountedRef();
    //当你的useEffect等hooks的依赖是个函数时，大概率需要将函数包裹一层useCallback，否则作为引用类型的函数很可能造成无限render
    //useMemo同理,不过useMemo返回的是函数return的值，而useCallback返回的是函数本身
    return useCallback(
      (...args: T[]) => (mountedRef.current ? dispatch(...args) : void 0),
      [dispatch, mountedRef]
    );
  };

  const safeDispatch = useSafeDispatch(dispatch);
  // useState直接传入函数的含义是：惰性初始化；所以，要用useState保存函数，不能直接传入函数
  // https://codesandbox.io/s/blissful-water-230u4?file=/src/App.js
  const [retry, setRetry] = useState(() => () => {});

  const setData = useCallback(
    (data: D) => {
      safeDispatch({
        data,
        stat: "success",
        error: null,
      });
    },
    [safeDispatch]
  );

  const setError = useCallback(
    (error: Error) => {
      safeDispatch({
        data: null,
        stat: "error",
        error,
      });
    },
    [safeDispatch]
  );

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
      safeDispatch({ stat: "loading" });
      return promise
        .then((data) => {
          setData(data);

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
    [config.throwOnError, setData, setError, safeDispatch]
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
