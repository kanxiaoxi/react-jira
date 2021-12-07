import { Kanban } from "types/kanban";
import { useTasks } from "utils/task";
import { useTasksTypes } from "utils/task-type";
import {
  useKanbansQueryKey,
  useTasksModal,
  useTasksSearchParams,
} from "./util";
import taskIcon from "assets/task.svg";
import bugIcon from "assets/bug.svg";
import styled from "@emotion/styled";
import { Button, Card, Dropdown, Menu, Modal } from "antd";
import { CreateTask } from "./create-task";
import { Task } from "types/task";
import { Mark } from "components/mark";
import { useDeleteKanban } from "utils/kanban";
import { Row } from "components/lib";
import { forwardRef } from "react";
import { Drag, Drop, DropChild } from "components/drag-and-drop";

const TaskTypeIcon = ({ id }: { id: number }) => {
  const { data: taskTypes } = useTasksTypes();
  const name = taskTypes?.find((taskType) => taskType.id === id)?.name;
  if (!name) {
    return null;
  }
  return <img src={name === "task" ? taskIcon : bugIcon} alt={"task-icon"} />;
};

const TaskCard = ({ task }: { task: Task }) => {
  const { startEdit } = useTasksModal();
  const [{ name: keyword }] = useTasksSearchParams();
  return (
    <Card
      onClick={() => startEdit(task.id)}
      style={{ marginBottom: "0.5rem", cursor: "pointer" }}
      key={task.id}
    >
      <p>
        <Mark name={task.name} keyword={keyword} />
      </p>
      <TaskTypeIcon id={task.typeId} />
    </Card>
  );
};

// 暴露ref给父组件调用
export const KanbanColumn = forwardRef<HTMLDivElement, { kanban: Kanban }>(
  ({ kanban, ...props }, ref) => {
    const [params] = useTasksSearchParams();
    const { data: allTasks } = useTasks(params);
    // 筛选出所属看板的tasks
    const tasks = allTasks?.filter((task) => task.kanbanId === kanban.id);
    return (
      // Unable to find drag handle
      <Container {...props} ref={ref}>
        <Row between={true}>
          <h3>{kanban.name}</h3>
          <More kanban={kanban} key={kanban.id} />
        </Row>
        <TasksContainer>
          <Drop
            droppableId={String(kanban.id)}
            type={"ROW"}
            direction={"vertical"}
          >
            <DropChild style={{ minHeight: "5px" }}>
              {tasks?.map((task, index) => (
                <Drag
                  key={task.id}
                  index={index}
                  draggableId={"task" + task.id}
                >
                  {/* 这里使用普通html元素接收ref，而不是forwardRef 转发ref 给函数组件*/}
                  <div>
                    <TaskCard key={task.id} task={task} />
                  </div>
                </Drag>
              ))}
            </DropChild>
          </Drop>
          <CreateTask kanbanId={kanban.id} />
        </TasksContainer>
      </Container>
    );
  }
);

export const Container = styled.div`
  min-width: 27rem;
  border-radius: 6px;
  background-color: rgb(244, 245, 247);
  display: flex;
  flex-direction: column;
  padding: 0.7rem 0.7rem 1rem;
  margin-right: 1.5rem;
`;

const TasksContainer = styled.div`
  overflow: scroll;
  flex: 1;
  /* 不显示滚动条 */
  ::-webkit-scrollbar {
    display: none;
  }
`;

const More = ({ kanban }: { kanban: Kanban }) => {
  const { mutateAsync } = useDeleteKanban(useKanbansQueryKey());
  const startEdit = () => {
    Modal.confirm({
      title: "确定删除看板吗",
      okText: "确定",
      cancelText: "取消",
      onOk() {
        mutateAsync({ id: kanban.id });
      },
    });
  };
  const overlay = (
    <Menu>
      <Menu.Item>
        <Button type={"link"} onClick={startEdit}>
          删除
        </Button>
      </Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={overlay}>
      <Button type={"link"}>...</Button>
    </Dropdown>
  );
};
