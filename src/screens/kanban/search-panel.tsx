import { Button, Input } from "antd";
import { Row } from "components/lib";
import { TaskTypeSelect } from "components/task-type-select";
import { UserSelect } from "components/user-select";
import { useSetUrlSearchParma } from "utils/url";
import { useTasksSearchParams } from "./util";

export const SearchPanel = () => {
  const [params, setParams] = useTasksSearchParams();
  const setSearchParams = useSetUrlSearchParma();
  const reset = () => {
    setSearchParams({
      typeId: undefined,
      processorId: undefined,
      tagId: undefined,
      name: undefined,
    });
  };

  return (
    <Row marginBottom={4} gap={true}>
      <Input
        style={{ width: "20rem" }}
        placeholder={"任务名"}
        value={params.name}
        onChange={(evt) => setParams({ ...params, name: evt.target.value })}
      />
      <UserSelect
        defaultOptionName={"经办人"}
        value={params.processorId}
        onChange={(value) => setParams({ ...params, processorId: value })}
      />
      <TaskTypeSelect
        defaultOptionName={"类型"}
        value={params.typeId}
        onChange={(value) => setParams({ ...params, typeId: value })}
      />
      <Button onClick={reset}>清除筛选器</Button>
    </Row>
  );
};
