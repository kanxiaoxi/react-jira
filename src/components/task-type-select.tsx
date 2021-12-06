import { useTasksTypes } from "utils/task-type";
import { IdSelect } from "./id-select";

export const TaskTypeSelect = (
  props: React.ComponentProps<typeof IdSelect>
) => {
  const { data: taskTypes } = useTasksTypes();
  return <IdSelect options={taskTypes || []} {...props} />;
};
