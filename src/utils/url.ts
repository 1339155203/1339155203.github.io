import { cleanObject, subset } from "utils/index";
import { URLSearchParamsInit, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";

//从页面的url中，获取指定的参数值
/*
有两个功能
1.从url中把参数读取出来返回出去，给project-list中的params赋值
2.根据params改变网站的url
*/

export const useUrlQueryParam = <K extends string>(keys: K[]) => {
  //SearchParams：获取到url  setSearchParam：改变url
  const [searchParams] = useSearchParams();
  const setSearchParams = useSetUrlSearchParam();
  const [stateKeys] = useState(keys);
  return [
    useMemo(
      () =>
        subset(Object.fromEntries(searchParams), stateKeys) as {
          [key in K]: string;
        },
      [searchParams, stateKeys]
    ),
    (params: Partial<{ [key in K]: unknown }>) => {
      return setSearchParams(params);
      // iterator
      // iterator: https://codesandbox.io/s/upbeat-wood-bum3j?file=/src/index.js
    },
  ] as const;
};

export const useSetUrlSearchParam = () => {
  const [searchParams, setSearchParam] = useSearchParams();
  return (params: { [key in string]: unknown }) => {
    //cleanObject：取出对象中的undifined等类型
    const o = cleanObject({
      //Object.fromEntries传入的对象必须带有iterator，之后会将键值对类型转换为对象类型
      ...Object.fromEntries(searchParams),
      ...params,
    }) as URLSearchParamsInit;
    return setSearchParam(o); //用于改变url
  };
};
