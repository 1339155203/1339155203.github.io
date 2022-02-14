import { Table, TableProps } from "antd";
import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";
import { User } from "screens/project-list/search-panel";
export interface Project {
  id: string;
  name: string;
  personId: string;
  pin: boolean;
  organization: string;
  created: number;
}
interface ListProps extends TableProps<Project> {
  users: User[];
}
export const List = ({ users, ...props }: ListProps) => {
  return (
    <Table
      rowKey={"id"}
      pagination={false}
      columns={[
        {
          title: "名称", //列名
          sorter: (a, b) => a.name.localeCompare(b.name), //按中文字母顺序排序
          render(value, project) {
            return (
              <Link to={`projects/${String(project.id)}`}>{project.name}</Link>
            );
          },
        },
        {
          title: "部门", //列名
          dataIndex: "organization", //数据
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
        {
          title: "创建时间",
          render(value, project) {
            return (
              <span>
                {project.created
                  ? dayjs(project.created).format("YYYY-MM-DD")
                  : "无"}
              </span>
            );
          },
        },
      ]}
      {...props}
    />
  );
};
