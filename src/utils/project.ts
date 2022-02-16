import { Project } from "screens/project-list/list";
import { useAsync } from "./use-async";
import { useHttp } from "utils/http";
import { useEffect } from "react";
import { cleanObject } from "utils/index";

export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp();
  const { run, ...result } = useAsync<Project[]>();

  useEffect(() => {
    const sendMessage = setTimeout(() => {
      run(client("projects", { data: cleanObject(param) }));
    }, 500);
    return () => {
      clearTimeout(sendMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param]);

  return result;
};
