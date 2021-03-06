import styled from "@emotion/styled";
import { ButtonNoPadding, Row } from "components/lib";
import { useAuth } from "context/auth-context";
import { ProjectListScreen } from "screens/project-list";
import { ReactComponent as SoftwareLogo } from "assets/software-logo.svg";
import { Button, Dropdown, Menu } from "antd";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { ProjectScreen } from "screens/project";
import { ProjectModal } from "screens/project-list/project-modal";
import { ProjectPopover } from "components/project-popover";
import { UserPopover } from "components/user-popover";

export const AuthenticatedApp = () => {
  // const [projectModalOpen, setProjectModalOpen] = useState(false);
  // 使用URL保存全局状态

  return (
    <Container>
      <Router>
        <PageHeader />
        <Main>
          <Routes>
            <Route path={"/"} element={<Navigate replace to={"/projects"} />} />
            <Route path={"/projects"} element={<ProjectListScreen />} />
            <Route
              path={"/projects/:projectId/*"}
              element={<ProjectScreen />}
            />
          </Routes>
        </Main>
        <ProjectModal />
      </Router>
    </Container>
  );
};

// const PageHeader = styled.header`
//   height: 6rem;
//   background: gray;
// `

// const Main = styled.main`
//   height: calc(100vh - 6rem);
// `
/**
 * grid和flex很多情况下能实现同样的效果；但它们有各自的应用场景：
 * 1. 要考虑， 是一维布局还是二维布局？一维布局用flex，二维布局用grid；
 * 2. 是从内容出发还是从布局触发？
 * 从内容出发： 现有一组内容(数量一般不固定)，然后希望它们均匀的分布在容器中; 由内容自己的大小决定占据的空间。
 * 从布局出发：先规划网格(数量一般比较固定)，然后再把元素往里填充;
 * 从内容出发，用flex
 * 从布局出发，用grid
 */
const Container = styled.div`
  display: grid;
  grid-template-rows: 6rem 1fr;
  height: 100vh;
`;

// grid-area 用来给grid子元素起名字
const Header = styled(Row)`
  padding: 3.2rem;
  box-shadow: 0 0 5px 0 rgba(0 0 0 / 0.1);
  z-index: 1;
`;
const HeaderLeft = styled(Row)``;
const HeaderRight = styled.div``;
const Main = styled.main`
  display: flex;
  overflow: hidden;
`;

const PageHeader = () => {
  return (
    <Header between={true}>
      <HeaderLeft gap={true}>
        <ButtonNoPadding type={"link"} onClick={resetRoute}>
          <SoftwareLogo width={"18rem"} color={"rgb(38, 132, 255)"} />
        </ButtonNoPadding>
        <ProjectPopover />
        <UserPopover />
      </HeaderLeft>
      <HeaderRight>
        <User />
      </HeaderRight>
    </Header>
  );
};

const User = () => {
  const { logout, user } = useAuth();
  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item key={"logout"}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            {/* <a onClick={logout}>登出</a> */}
            <Button
              type={"link"}
              onClick={() => {
                logout();
                window.history.pushState(null, "", window.location.origin);
              }}
            >
              登出
            </Button>
          </Menu.Item>
        </Menu>
      }
    >
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      {/* <a onClick={(e) => e.preventDefault()}>Hi, {user?.name}</a> */}
      <Button type={"link"}>Hi, {user?.name}</Button>
    </Dropdown>
  );
};
export const resetRoute = () => (window.location.href = window.location.origin);
