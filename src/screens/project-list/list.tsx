import { Table } from "antd";
import React from "react";
import { User } from "screens/project-list/search-panel";
interface Project {
  id: string;
  name: string;
  personId: string;
  pin: boolean;
  organization: string;
}
interface ListProps {
  list: Project[];
  users: User[];
}
export const List = ({ list, users }: ListProps) => {
  return (
    <Table
      pagination={false}
      columns={[
        {
          title: "名称", //列名
          dataIndex: "name", //数据
          sorter: (a, b) => a.name.localeCompare(b.name), //按中文字母顺序排序
        },
        {
          title: "负责人",
          render(value, project) {
            //数据
            return (
              <span>
                {users.find((user) => user.id === project.personId)?.name ||
                  "未知"}
              </span>
            );
          },
        },
      ]}
      dataSource={list}
    />
  );
};
