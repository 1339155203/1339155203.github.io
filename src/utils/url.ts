import { cleanObject } from "utils/index";
import { URLSearchParamsInit, useSearchParams } from "react-router-dom";
import { useMemo } from "react";

//从页面的url中，获取指定的参数值
/*
有两个功能
1.从url中把参数读取出来返回出去，给project-list中的params赋值
2.根据params改变网站的url
*/

export const useUrlQueryParam = <K extends string>(keys: K[]) => {
  //SearchParams：获取到url  setSearchParam：改变url
  const [SearchParams, setSearchParam] = useSearchParams();
  return [
    useMemo(
      () =>
        keys.reduce((prev, key) => {
          //SearchParams.get['key'] 从url中找到键为key的值（第一个）
          return { ...prev, [key]: SearchParams.get(key) || "" };
        }, {} as { [key in K]: string }),
      //由于这里面的值返回出去作为useEffect的检测值，所以形参keys不能作为检测值，否则会引起无限render
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [SearchParams] //当url改变时，就会触发这里
    ),
    (params: Partial<{ [key in K]: unknown }>) => {
      //cleanObject：取出对象中的undifined等类型
      const o = cleanObject({
        //Object.fromEntries传入的对象必须带有iterator，之后会将键值对类型转换为对象类型
        ...Object.fromEntries(SearchParams),
        ...params,
      }) as URLSearchParamsInit;
      return setSearchParam(o); //用于改变url
    },
  ] as const;
};
