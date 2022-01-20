import React, { useState, useEffect } from "react";
import { SearchPanel } from "./search-panel";
import { List } from "./list";
import axios from "axios";
import qs from "qs";
import { cleanObject } from "utils";
const apiUrl = process.env.REACT_APP_API_URL;

export const ProjectListScreen = () => {
  const [params, setParams] = useState({
    name: "",
    personId: "",
  });
  const [users, setUsers] = useState([]);
  const [list, setList] = useState([]);
  //输入框或者下拉框改变时，更改params，同时发送请求获取符合的项目名称，更新list
  useEffect(() => {
    const sendMessage = setTimeout(() => {
      axios({
        url: `${apiUrl}/projects?${qs.stringify(cleanObject(params))}`,
        method: "GET",
      }).then(
        (response) => {
          setList(response.data);
        },
        (error) => {
          console.log(error);
        }
      );
    }, 500);
    return () => {
      clearTimeout(sendMessage);
    };
  }, [params]);
  //刚开始的时候获取所有的用户信息
  useEffect(() => {
    axios({
      url: `${apiUrl}/users`,
      method: "GET",
    }).then(
      (response) => {
        setUsers(response.data);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);
  return (
    <div>
      <SearchPanel users={users} setParams={setParams} params={params} />
      <List list={list} users={users} />
    </div>
  );
};
