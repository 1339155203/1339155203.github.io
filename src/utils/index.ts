import { useEffect } from "react";
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

export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
    //TODO 依赖项里加上callback会造成无限循环，这个和useCallback和useMemo有关系
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
