/** @jsxImportSource @emotion/react */
import { Input, Form } from "antd";
import { UserSelect } from "components/user-select";
import { Project } from "../../types/project";
import { User } from "../../types/user";

interface SeachPanelProps {
  users: User[];
  param: Partial<Pick<Project, "name" | "personId">>;
  setParam: (param: SeachPanelProps["param"]) => void;
}
export const SearchPanel = ({ users, param, setParam }: SeachPanelProps) => {
  return (
    <Form css={{ marginBottom: "2rem", ">*": "" }} layout={"inline"}>
      <Form.Item>
        <Input
          placeholder="项目名"
          type="text"
          value={param.name}
          onChange={(e) => setParam({ ...param, name: e.target.value })}
        />
      </Form.Item>
      <Form.Item>
        <UserSelect
          defaultOptionName="负责人"
          value={param.personId}
          onChange={(value) => setParam({ ...param, personId: value })}
        />
      </Form.Item>
    </Form>
  );
};
