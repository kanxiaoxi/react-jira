import styled from "@emotion/styled";
import { Spin } from "antd";
import { Drag, Drop, DropChild } from "components/drag-and-drop";
import { ScreenContainer } from "components/lib";
import { useCallback } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useDebounce, useDocumentTitle } from "utils";
import { useKanbans, useReorderKanban } from "utils/kanban";
import { useTasks, useReorderTask } from "utils/task";
import { CreateKanban } from "./create-kanban";
import { KanbanColumn } from "./kanban-column";
import { SearchPanel } from "./search-panel";
import { TaskModal } from "./task-modal";
import {
  useKanbansQueryKey,
  useKanbansSearchParams,
  useProjectInUrl,
  useTasksQueryKey,
  useTasksSearchParams,
} from "./util";

export const KanbanScreen = () => {
  useDocumentTitle("看板列表");

  const { data: currentProject } = useProjectInUrl();
  const { data: kanbans, isLoading: kanbanIsLoading } = useKanbans(
    useKanbansSearchParams()
  );
  const [params] = useTasksSearchParams();
  const { isLoading: taskIsLoading } = useTasks(useDebounce(params, 200));
  const isLoading = taskIsLoading || kanbanIsLoading;
  const onDragEnd = useDragEnd();
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <ScreenContainer>
        <h1>{currentProject?.name}看板</h1>
        <SearchPanel />
        {isLoading ? (
          <Spin size={"large"} />
        ) : (
          <ColumnContainer>
            <Drop
              droppableId={"kanban"}
              type={"COLUMN"}
              direction={"horizontal"}
            >
              <DropChild style={{ display: "flex" }}>
                {kanbans?.map((kanban, index) => (
                  <Drag
                    key={kanban.id}
                    draggableId={"kanban" + kanban.id}
                    index={index}
                  >
                    {/* index.js:1 Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()? */}
                    <KanbanColumn kanban={kanban} key={kanban.id} />
                  </Drag>
                ))}
              </DropChild>
            </Drop>
            <CreateKanban />
          </ColumnContainer>
        )}
        <TaskModal />
      </ScreenContainer>
    </DragDropContext>
  );
};

const ColumnContainer = styled("div")`
  display: flex;
  overflow-x: scroll;
  flex: 1;
`;

export const useDragEnd = () => {
  const { data: kanbans } = useKanbans(useKanbansSearchParams());
  const { mutate: reorderKanban } = useReorderKanban(useKanbansQueryKey());
  const { data: allTasks = [] } = useTasks(useTasksSearchParams()[0]);
  const { mutate: reorderTask } = useReorderTask(useTasksQueryKey());
  return useCallback(
    ({ source, destination, type }: DropResult) => {
      // 没有拖拽排序
      if (!destination) {
        return;
      }
      // 看板排序
      if (type === "COLUMN") {
        const fromId = kanbans?.[source.index].id;
        const toId = kanbans?.[destination.index].id;
        if (!fromId || !toId || fromId === toId) {
          return;
        }
        const type = destination.index > source.index ? "after" : "before";
        // console.log({ fromId, referenceId: toId, type });
        // 使用带乐观更新的看板排序
        reorderKanban({ fromId, referenceId: toId, type });
      }
      // 任务排序
      if (type === "ROW") {
        const fromKanbanId = +source.droppableId;
        const toKanbanId = +destination.droppableId;

        // 允许看板内排序
        // if (fromKanbanId === toKanbanId) {
        //   return
        // }

        // 过滤出所属看板的tasks，并通过索引区分是源task和目的task
        const fromTask = allTasks?.filter(
          (task) => task.kanbanId === fromKanbanId
        )[source.index];
        const toTask = allTasks?.filter((task) => task.kanbanId === toKanbanId)[
          destination.index
        ];
        if (fromTask?.id === toTask?.id) {
          return;
        }
        // 使用带乐观更新的任务排序
        reorderTask({
          fromId: fromTask?.id,
          referenceId: toTask?.id,
          fromKanbanId,
          toKanbanId,
          type:
            fromKanbanId === toKanbanId && destination.index > source.index
              ? "after"
              : "before",
        });
      }
    },
    [kanbans, reorderKanban, allTasks, reorderTask]
  );
};
