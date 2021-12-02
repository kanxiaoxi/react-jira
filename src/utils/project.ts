// import { useCallback, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Project } from "screens/project-list/list";
// import { cleanObject } from "utils";
import { useHttp } from "./http";
// import { useAsync } from "./use-async";

export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp();
  // param变化，重新触发请求
  // return useQuery<Project[],Error>(['projects',param],()=>client('projects', {data: param}))
  return useQuery<Project[]>(["projects", param], () =>
    client("projects", { data: param })
  );

  // const { run, ...result } = useAsync<Project[]>();
  // const fetchProjects = useCallback(
  //   () => client("projects", { data: cleanObject(param || {}) }),
  //   [client, param]
  // );
  // useEffect(() => {
  //   run(fetchProjects(), { retry: fetchProjects });
  // }, [param, run, fetchProjects]);

  // return result;
};

export const useEditProject = () => {
  const client = useHttp();
  const queryClient = useQueryClient();
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects/${params.id}`, {
        method: "PATCH",
        data: params,
      }),
    {
      // 刷新缓存
      onSuccess: () => queryClient.invalidateQueries("projects"),
    }
  );

  // const { run, ...asyncResult } = useAsync();
  // const mutate = (params: Partial<Project>) => {
  //   return run(
  //     client(`projects/${params.id}`, {
  //       data: params,
  //       method: "PATCH",
  //     })
  //   );
  // };
  // return {
  //   mutate,
  //   ...asyncResult,
  // };
};

export const useAddProject = () => {
  const client = useHttp();
  const queryClient = useQueryClient();
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects`, {
        method: "POST",
        data: params,
      }),
    {
      onSuccess: () => queryClient.invalidateQueries("projects"),
    }
  );
  // const { run, ...asyncResult } = useAsync();
  // const mutate = (params: Partial<Project>) => {
  //   return run(
  //     client(`projects/${params.id}`, {
  //       data: params,
  //       method: "POST",
  //     })
  //   );
  // };
  // return {
  //   mutate,
  //   ...asyncResult,
  // };
};

export const useProject = (id?: number) => {
  const client = useHttp();
  return useQuery<Project>(
    ["project", { id }],
    () => client(`projects/${id}`),
    {
      // id为undefined时不触发请求
      enabled: Boolean(id),
    }
  );
};
