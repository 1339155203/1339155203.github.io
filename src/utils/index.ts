import { useEffect, useRef, useState } from "react";
export const isFalsy = (value: unknown) => (value === 0 ? false : !value); //防止把id为0的情况判断为空值
export const isVoid = (value: unknown) =>
  value === undefined || value === null || value === "";
//为了清除发送请求中携带的query中有空值
export const cleanObject = (object?: { [key: string]: unknown }) => {
  // Object.assign({}, object)
  if (!object) {
    return {};
  }
  const result = { ...object };
  Object.keys(result).forEach((key) => {
    const value = result[key];
    if (isVoid(value)) {
      delete result[key];
    }
  });
  return result;
};
export const useDebounce = <V>(value: V, delay?: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 每次在value变化以后，设置一个定时器
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    // 每次在上一个useEffect处理完以后再运行
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
};
export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
    //TODO 依赖项里加上callback会造成无限循环，这个和useCallback和useMemo有关系
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export const useDocumentTitle = (
  title: string,
  keepOnUnmount: boolean = true
) => {
  const oldTitle = useRef(document.title).current;
  useEffect(() => {
    document.title = title;
  }, [title]);
  //在组件卸载时将标题恢复为之前的标题，默认为恢复
  useEffect(() => {
    return () => {
      if (!keepOnUnmount) {
        document.title = oldTitle;
      }
    };
  }, [keepOnUnmount, oldTitle]);
};
//用于authenticated中点击左上角图标跳转到根路由地址
export const resetRoute = () => {
  window.location.href = window.location.origin;
};

//标记组件是否被卸载，如果被卸载的同时还在请求数据，那么数据到了之后将不会展示数据
export const useMountedRef = () => {
  const mountedRef = useRef(false);

  useEffect(() => {
    //一开始组件挂载时标记为true：组件挂载
    mountedRef.current = true;
    return () => {
      //被卸载后标记组件false，已被卸载
      mountedRef.current = false;
    };
  });

  return mountedRef;
};
export const subset = <
  O extends { [key in string]: unknown },
  K extends keyof O
>(
  obj: O,
  keys: K[]
) => {
  const filteredEntries = Object.entries(obj).filter(([key]) =>
    keys.includes(key as K)
  );
  return Object.fromEntries(filteredEntries) as Pick<O, K>;
};
