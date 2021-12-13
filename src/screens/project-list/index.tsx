// import * as qs from "qs";
import { useDebounce, useDocumentTitle } from "utils";
import { List } from "./list";
import { SearchPanel } from "./search-panel";
import { useProjects } from "utils/project";
import { useUsers } from "utils/user";
import { useProjectModal, useProjectsSearchParams } from "./util";
import {
  ButtonNoPadding,
  ErrorBox,
  Row,
  ScreenContainer,
} from "components/lib";
import { Profiler } from "components/profiler";

// 基本类型，组件状态可以放到依赖里，非组件状态的对象，绝不可以放到依赖里

export const ProjectListScreen = () => {
  useDocumentTitle("项目列表", false);

  // const [keys, setKeys] = useState<("name" | "personId")[]>(['name', 'personId'])

  const { open } = useProjectModal();
  const [param, setParam] = useProjectsSearchParams();
  const { isLoading, error, data: list } = useProjects(useDebounce(param, 200));
  const { data: users } = useUsers();

  return (
    <Profiler id={"项目列表"}>
      <ScreenContainer>
        <Row between={true}>
          <h1>项目列表</h1>
          <ButtonNoPadding onClick={open} type={"link"}>
            创建项目
          </ButtonNoPadding>
        </Row>
        <SearchPanel users={users || []} param={param} setParam={setParam} />
        <ErrorBox error={error} />
        <List users={users || []} dataSource={list || []} loading={isLoading} />
      </ScreenContainer>
    </Profiler>
  );
};

// ProjectListScreen.whyDidYouRender = true;

// class Test extends React.Component<any, any> {
//   static whyDidYouRender = true
// }
