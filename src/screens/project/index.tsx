import { Link, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { KanbanScreen } from "screens/kanban";
import { EpicScreen } from "screens/epic";
import styled from "@emotion/styled";
import { Menu } from "antd";

const useRouteTypep = () => {
  const units = useLocation().pathname.split("/");
  return units[units.length - 1];
};

export const ProjectScreen = () => {
  const routeType = useRouteTypep();
  return (
    <Container>
      <Aside>
        <Menu mode={"inline"} selectedKeys={[routeType]}>
          <Menu.Item key={"kanban"}>
            <Link to={"kanban"}>看板</Link>
          </Menu.Item>
          <Menu.Item key={"epic"}>
            <Link to={"epic"}>任务组</Link>
          </Menu.Item>
        </Menu>
      </Aside>
      <Main>
        <Routes>
          {/* 添加replace，不然后退不了 */}
          <Route path={"*"} element={<Navigate replace to={"kanban"} />} />
          {/* /projects/:projectId/kanban */}
          <Route path={"kanban"} element={<KanbanScreen />} />
          {/* /projects/:projectId/epic */}
          <Route path={"epic"} element={<EpicScreen />} />
        </Routes>
      </Main>
    </Container>
  );
};

const Aside = styled.aside`
  background-color: rgb(244, 245, 247);
  display: flex;
`;
const Main = styled.div`
  box-shadow: -5px 0 5px -5px rgba(0, 0, 0, 0.1);
  display: flex;
`;
const Container = styled.div`
  display: grid;
  grid-template-columns: 16rem 1fr;
`;
