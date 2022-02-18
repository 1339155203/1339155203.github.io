import { useMemo } from "react";
import { useUrlQueryParam } from "utils/url";
//用于项目列表的搜索参数
export const useProjectSearchParams = () => {
  const [params, setParams] = useUrlQueryParam(["name", "personId"]);
  return [
    useMemo(
      () => ({ ...params, personId: Number(params.personId) || undefined }),
      [params]
    ),
    setParams,
  ] as const;
};
