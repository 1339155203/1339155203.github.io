import { useQuery } from "react-query";
import { useHttp } from "./http";
import { TaskType } from "types/Task-type";
//用于获取任务是bug还是task
export const useTaskTypes = () => {
  const client = useHttp();

  return useQuery<TaskType[]>(["taskTypes"], () => client("taskTypes"));
};
