import { Input, Select } from "antd";

export interface User {
  id: string;
  name: string;
  email: string;
  title: string;
  organization: string;
  token: string;
}

interface SeachPanelProps {
  users: User[];
  param: {
    name: string;
    personId: string;
  };
  setParam: (param: SeachPanelProps["param"]) => void;
}
export const SearchPanel = ({ users, param, setParam }: SeachPanelProps) => {
  return (
    <form>
      {/* setParam(Object.assign({},param, {name: e.target.value })) */}
      <Input
        value={param.name}
        onChange={(e) => setParam({ ...param, name: e.target.value })}
      />
      <Select
        value={param.personId}
        onChange={(value) => setParam({ ...param, personId: value })}
      >
        <Select.Option value={""}>负责人</Select.Option>
        {users.map((user) => (
          <Select.Option key={user.id} value={user.id}>
            {user.name}
          </Select.Option>
        ))}
      </Select>
    </form>
  );
};
