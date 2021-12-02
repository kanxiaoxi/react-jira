import { useSetUrlSearchParma, useUrlQueryParam } from "utils/url";
import { useMemo } from "react";
import { useProject } from "utils/project";

// 项目列表搜索的参数
export const useProjectsSearchParams = () => {
  const [param, setParam] = useUrlQueryParam(["name", "personId"]);
  return [
    useMemo(
      () => ({ ...param, personId: Number(param.personId) || undefined }),
      [param]
    ),
    setParam,
  ] as const;
};

export const useProjectsQueryKey = () => {
  const [params] = useProjectsSearchParams();
  return ["projects", params];
};

export const useProjectModal = () => {
  const [{ projectCreate }, setProjectCreate] = useUrlQueryParam([
    "projectCreate",
  ]);
  const [{ editingProjectId }, setEdtingProjectId] = useUrlQueryParam([
    "editingProjectId",
  ]);
  const open = () => setProjectCreate({ projectCreate: true });
  // const close = () => {
  //   setProjectCreate({ projectCreate: "" });
  //   setEdtingProjectId({ editingProjectId: "" });
  // };

  const setUrlParams = useSetUrlSearchParma();
  const close = () => setUrlParams({ projectCreate: "", editingProjectId: "" });

  const { data: editingProject, isLoading } = useProject(
    Number(editingProjectId)
  );
  const startEdit = (id: number) =>
    setEdtingProjectId({ editingProjectId: id });
  return {
    projectModalOpen: projectCreate === "true" || Boolean(editingProject),
    open,
    close,
    startEdit,
    editingProject,
    isLoading,
  };
  // return [
  //   projectCreate === 'true',
  //   open,
  //   close
  // ] as const
};
