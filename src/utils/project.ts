// import { useCallback, useEffect } from "react";
import { QueryKey, useMutation, useQuery } from "react-query";
import { Project } from "types/project";
import { cleanObject } from "utils";
// import { useProjectsSearchParams } from "screens/project-list/util";
// import { cleanObject } from "utils";
import { useHttp } from "./http";
import {
  useAddConfig,
  useDeleteConfig,
  useEditConfig,
} from "./use-optimistic-options";
// import { useAsync } from "./use-async";

export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp();
  // param变化，重新触发请求
  // return useQuery<Project[],Error>(['projects',param],()=>client('projects', {data: param}))
  return useQuery<Project[]>(["projects", cleanObject(param)], () =>
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

export const useEditProject = (queryKey: QueryKey) => {
  const client = useHttp();
  // const queryClient = useQueryClient();
  // const [searcheParams] = useProjectsSearchParams()
  // const queryKey = ['projects', searcheParams]
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects/${params.id}`, {
        method: "PATCH",
        data: params,
      }),
    useEditConfig(queryKey)
    // {
    //   // 刷新缓存
    //   onSuccess: () => queryClient.invalidateQueries(queryKey),
    //   // 实现乐观更新
    //   async onMutate(target){
    //     const previousItems = queryClient.getQueryData(queryKey)
    //     queryClient.setQueryData(queryKey, (old?: Project[])=>{
    //       return old?.map(project=>project.id === target.id ? {...project, ...target}: project) || []
    //     })
    //     return previousItems
    //   },
    //   // 发生错误，回滚
    //   onError(error, newItem, context){
    //     queryClient.setQueryData(queryKey,(context as {previousItems: Project[]}).previousItems)
    //   }
    // }
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

export const useAddProject = (queryKey: QueryKey) => {
  const client = useHttp();
  // const queryClient = useQueryClient();
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects`, {
        method: "POST",
        data: params,
      }),
    useAddConfig(queryKey)
    // {
    //   onSuccess: () => queryClient.invalidateQueries("projects"),
    // }
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

export const useDeleteProject = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation(
    ({ id }: { id: number }) =>
      client(`projects/${id}`, {
        method: "DELETE",
      }),
    useDeleteConfig(queryKey)
  );
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
