import { Button, Drawer } from "antd";
import { useProjectModal } from "./util";

export const ProjectModal = () => {
  const { projectCreate, close } = useProjectModal();
  return (
    <Drawer onClose={close} visible={projectCreate} width={"100%"}>
      <h1>Project Modal</h1>
      <Button onClick={close}>关闭</Button>
    </Drawer>
  );
};
