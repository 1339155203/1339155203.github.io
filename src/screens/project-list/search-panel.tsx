import { Form, Input, Select } from "antd";
import React from "react";
export interface User {
  id: string;
  name: string;
  email: string;
  title: string;
  organization: string;
  token: string;
}
interface SearchPanelProps {
  params: {
    name: string;
    personId: string;
  };
  setParams: (params: SearchPanelProps["params"]) => void;
  users: User[];
}
export const SearchPanel = ({ params, setParams, users }: SearchPanelProps) => {
  return (
    <Form style={{ marginBottom: "2rem" }} layout={"inline"}>
      <Form.Item>
        <Input
          placeholder={"项目名"}
          type="text"
          value={params.name}
          onChange={(e) =>
            setParams({
              ...params,
              name: e.target.value,
            })
          }
        />
      </Form.Item>
      <Form.Item>
        <Select
          value={params.personId}
          onChange={(value) =>
            setParams({
              ...params,
              personId: value,
            })
          }
        >
          <Select.Option value={""}>负责人</Select.Option>
          {users.map((user) => (
            <Select.Option key={user.id} value={user.id}>
              {user.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};
