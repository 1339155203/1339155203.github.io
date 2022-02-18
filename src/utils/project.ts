import { Project } from "screens/project-list/list";
import { useAsync } from "./use-async";
import { useHttp } from "utils/http";
import { useCallback, useEffect } from "react";
import { cleanObject } from "utils/index";

export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp();
  const { run, ...result } = useAsync<Project[]>();

  const fetchProjects = useCallback(
    () => client("projects", { data: cleanObject(param || {}) }),
    [client, param]
  );

  useEffect(() => {
    run(fetchProjects(), {
      retry: fetchProjects,
    });
  }, [param, run, fetchProjects]);

  return result;
};

export const useEditProject = () => {
  const client = useHttp();
  const { run, ...asyncReault } = useAsync();
  const mutate = (params: Partial<Project>) => {
    return run(
      client(`projects/${params.id}`, { data: params, method: "PATCH" })
    );
  };
  return {
    mutate,
    ...asyncReault,
  };
};

export const useAddProject = () => {
  const client = useHttp();
  const { run, ...asyncReault } = useAsync();
  const mutate = (params: Partial<Project>) => {
    return run(
      client(`projects/${params.id}`, { data: params, method: "POST" })
    );
  };
  return {
    mutate,
    ...asyncReault,
  };
};
