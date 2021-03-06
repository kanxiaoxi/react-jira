import { Modal, Form, Input, Button } from "antd";
import { useForm } from "antd/lib/form/Form";
import { TaskTypeSelect } from "components/task-type-select";
import { UserSelect } from "components/user-select";
import { useEffect } from "react";
import { useDeleteTask, useEditTask } from "utils/task";
import { useTasksModal, useTasksQueryKey } from "./util";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export const TaskModal = () => {
  const [form] = useForm();
  const { editingTaskId, editingTask, close } = useTasksModal();
  const { mutateAsync: editTask, isLoading: editingLoading } = useEditTask(
    useTasksQueryKey()
  );
  const { mutateAsync: delteTask } = useDeleteTask(useTasksQueryKey());
  const onCancle = () => {
    close();
    form.resetFields();
  };
  const onOk = async () => {
    await editTask({ ...editingTask, ...form.getFieldsValue() });
    close();
  };
  const startDelete = () => {
    close();

    Modal.confirm({
      title: "确定删除任务吗",
      okText: "确定",
      cancelText: "取消",
      onOk() {
        delteTask({ id: Number(editingTaskId) });
      },
    });
  };
  useEffect(() => {
    form.setFieldsValue(editingTask);
  }, [form, editingTask]);

  return (
    <Modal
      forceRender={true}
      onCancel={onCancle}
      onOk={onOk}
      okText={"确认"}
      cancelText={"取消"}
      confirmLoading={editingLoading}
      title={"编辑任务"}
      visible={!!editingTaskId} //控制Modal显示与否
    >
      <Form {...layout} initialValues={editingTask} form={form}>
        <Form.Item
          label={"任务名"}
          name={"name"}
          rules={[{ required: true, message: "请输入任务名" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label={"经办人"} name={"processorId"}>
          <UserSelect defaultOptionName={"经办人"} />
        </Form.Item>
        <Form.Item label={"类型"} name={"typeId"}>
          <TaskTypeSelect />
        </Form.Item>
        <div style={{ textAlign: "right" }}>
          <Button
            onClick={startDelete}
            style={{ fontSize: "14px" }}
            size={"small"}
          >
            删除
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
