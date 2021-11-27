// import * as qs from "qs";
import { useDebounce, useDocumentTitle } from "utils";
import { List } from "./list";
import { SearchPanel } from "./search-panel";
import styled from "@emotion/styled";
import { Typography } from "antd";
import { useProjects } from "utils/project";
import { useUsers } from "utils/user";
import { useProjectsSearchParams } from "./util";

// 基本类型，组件状态可以放到依赖里，非组件状态的对象，绝不可以放到依赖里

export const ProjectListScreen = () => {
  useDocumentTitle("项目列表", false);

  // const [keys, setKeys] = useState<("name" | "personId")[]>(['name', 'personId'])

  const [param, setParam] = useProjectsSearchParams();
  const {
    isLoading,
    error,
    data: list,
    retry,
  } = useProjects(useDebounce(param, 200));
  const { data: users } = useUsers();

  return (
    <Container>
      <h1>项目列表</h1>
      <SearchPanel users={users || []} param={param} setParam={setParam} />
      {error ? (
        <Typography.Text type={"danger"}>{error.message}</Typography.Text>
      ) : null}
      <List
        refresh={retry}
        users={users || []}
        dataSource={list || []}
        loading={isLoading}
      />
    </Container>
  );
};

const Container = styled.div`
  padding: 3.2rem;
`;

ProjectListScreen.whyDidYouRender = true;

// class Test extends React.Component<any, any> {
//   static whyDidYouRender = true
// }
