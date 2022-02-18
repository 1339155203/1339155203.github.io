import React from "react";
import { SearchPanel } from "./search-panel";
import { List } from "./list";
import styled from "@emotion/styled";
import { useProjects } from "utils/project";
import { useUsers } from "utils/user";
import { Typography } from "antd";
import { useDebounce, useDocumentTitle } from "utils";
import { useProjectSearchParams } from "./util";

export const ProjectListScreen = () => {
  useDocumentTitle("任务列表", false);

  const [params, setParams] = useProjectSearchParams();
  const {
    isLoading,
    error,
    data: list /*将获取到的data重命名为list */,
    retry,
  } = useProjects(useDebounce(params, 200));
  console.log("retry", retry);
  const { data: users } = useUsers();

  return (
    <Container>
      <h1>项目列表</h1>
      <SearchPanel users={users || []} setParams={setParams} params={params} />
      {error ? (
        <Typography.Text type={"danger"}>{error.message}</Typography.Text>
      ) : null}
      <List
        refresh={retry}
        loading={isLoading}
        dataSource={list || []}
        users={users || []}
      />
    </Container>
  );
};

const Container = styled.div`
  padding: 3.2rem;
`;
