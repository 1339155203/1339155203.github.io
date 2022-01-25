import React, { useState, useEffect } from "react";
import { SearchPanel } from "./search-panel";
import { List } from "./list";
import { cleanObject } from "utils";
import { useHttp } from "utils/http";
import styled from "@emotion/styled";

export const ProjectListScreen = () => {
  const [params, setParams] = useState({
    name: "",
    personId: "",
  });
  const [users, setUsers] = useState([]);
  const [list, setList] = useState([]);
  const clientProjects = useHttp();
  const clientUsers = useHttp();
  //输入框或者下拉框改变时，更改params，同时发送请求获取符合的项目名称，更新list
  useEffect(() => {
    const sendMessage = setTimeout(() => {
      clientProjects("projects", { data: cleanObject(params) }).then((list) => {
        setList(list);
      });
    }, 500);
    return () => {
      clearTimeout(sendMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);
  //刚开始的时候获取所有的用户信息
  useEffect(() => {
    clientUsers("users").then(setUsers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Container>
      <h1>项目列表</h1>
      <SearchPanel users={users} setParams={setParams} params={params} />
      <List list={list} users={users} />
    </Container>
  );
};

const Container = styled.div`
  padding: 3.2rem;
`;
