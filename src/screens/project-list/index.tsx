import React, { useState } from "react";
import { SearchPanel } from "./search-panel";
import { List } from "./list";
import styled from "@emotion/styled";
import { useProjects } from "utils/project";
import { useUsers } from "utils/user";
import { Typography } from "antd";
import { useDocumentTitle } from "utils";

export const ProjectListScreen = () => {
  const [params, setParams] = useState({
    name: "",
    personId: "",
  });

  const {
    isLoading,
    error,
    data: list /*将获取到的data重命名为list */,
  } = useProjects(params);
  const { data: users } = useUsers();
  useDocumentTitle("任务列表", false);
  return (
    <Container>
      <h1>项目列表</h1>
      <SearchPanel users={users || []} setParams={setParams} params={params} />
      {error ? (
        <Typography.Text type={"danger"}>{error.message}</Typography.Text>
      ) : null}
      <List loading={isLoading} dataSource={list || []} users={users || []} />
    </Container>
  );
};

const Container = styled.div`
  padding: 3.2rem;
`;
