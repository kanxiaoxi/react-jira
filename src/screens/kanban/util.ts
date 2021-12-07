import { useCallback, useMemo } from "react";
import { useLocation } from "react-router";
import { useProject } from "utils/project";
import { useTask } from "utils/task";
import { useUrlQueryParam } from "utils/url";

export const useProjectIdInUrl = () => {
  const { pathname } = useLocation();
  const id = pathname.match(/projects\/(\d+)/)?.[1];
  return Number(id);
};

// 获取url中指定projectId的project
export const useProjectInUrl = () => useProject(useProjectIdInUrl());

export const useKanbansSearchParams = () => ({
  projectId: useProjectIdInUrl(),
});

export const useKanbansQueryKey = () => ["kanbans", useKanbansSearchParams()];

export const useTasksSearchParams = () => {
  const [params, setParams] = useUrlQueryParam([
    "name",
    "typeId",
    "processorId",
    "tagId",
  ]);
  const projectId = useProjectIdInUrl();
  return [
    useMemo(
      () => ({
        projectId,
        typeId: Number(params.typeId) || undefined,
        processorId: Number(params.processorId) || undefined,
        tagId: Number(params.tagId) || undefined,
        name: params.name,
      }),
      [projectId, params]
    ),
    setParams,
  ] as const;
};

export const useTasksQueryKey = () => ["tasks", useTasksSearchParams()[0]];

export const useTasksModal = () => {
  // 控制任务编辑Modal展示与关闭
  const [{ editingTaskId }, setEditingTaskId] = useUrlQueryParam([
    "editingTaskId",
  ]);
  // Modal展示时使用到的原始数据
  const { data: editingTask, isLoading } = useTask(Number(editingTaskId));

  // 打开任务编辑Modal的方法
  const startEdit = useCallback(
    (id: number) => {
      setEditingTaskId({ editingTaskId: id });
    },
    [setEditingTaskId]
  );
  // 关闭任务编辑Modal的方法
  const close = useCallback(() => {
    setEditingTaskId({ editingTaskId: "" });
  }, [setEditingTaskId]);

  return {
    editingTaskId,
    editingTask,
    startEdit,
    close,
    isLoading,
  };
};
