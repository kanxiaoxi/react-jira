import { Link, Routes, Route, Navigate } from "react-router-dom";
import { KanbanScreen } from "screens/kanban";
import { EpicScreen } from "screens/epic";

export const ProjectScreen = () => {
  return (
    <div>
      <h1>ProjectScreen</h1>
      <Link to={"kanban"}>看版</Link>
      <Link to={"epic"}>任务组</Link>
      <Routes>
        {/* 添加replace，不然后退不了 */}
        <Route path={"*"} element={<Navigate replace to={"kanban"} />} />
        {/* /projects/:projectId/kanban */}
        <Route path={"kanban"} element={<KanbanScreen />} />
        {/* /projects/:projectId/epic */}
        <Route path={"epic"} element={<EpicScreen />} />
      </Routes>
    </div>
  );
};
