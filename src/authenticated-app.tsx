import styled from "@emotion/styled";
import { Row } from "components/lib";
import { useAuth } from "context/auth-context";
import React from "react";
import { ProjectListScreen } from "screens/project-list";
import { ProjectScreen } from "screens/project";
import { ReactComponent as SoftwareLogo } from "assets/software-logo.svg";
import { Button, Dropdown, Menu } from "antd";
import { Route, Routes } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import { resetRoute } from "utils";
export const AuthenticatedApp = () => {
  /**两种布局
   * grid 和 flex 各自的应用场景
   * 1. 要考虑，是一维布局 还是 二维布局
   * 一般来说，一维布局用flex，二维布局用grid
   * 2. 是从内容出发还是从布局出发？
   * 从内容出发：你先有一组内容(数量一般不固定),然后希望他们均匀的分布在容器中，由内容自己的大小决定占据的空间
   * 从布局出发：先规划网格(数量一般比较固定)，然后再把元素往里填充
   * 从内容出发，用flex
   * 从布局出发，用grid
   *
   */
  return (
    <Container>
      <PageHeader />
      <Main>
        <Router>
          <Routes>
            <Route path={"/projects"} element={<ProjectListScreen />}></Route>
            <Route
              path={"/projects/:projectId/*"}
              element={<ProjectScreen />}
            ></Route>
            {/*下面这个index element用来代替navigate，目前navigate已经不能在routes中使用 */}
            <Route index element={<ProjectListScreen />} />
          </Routes>
        </Router>
      </Main>
    </Container>
  );
};

const PageHeader = () => {
  const { logout, user } = useAuth();
  return (
    <Header between={true}>
      <HeaderLeft gap={true}>
        <Button type={"link"} onClick={resetRoute}>
          <SoftwareLogo width={"18rem"} color={"rgb(38,132,255)"} />
        </Button>
        <h2>项目</h2>
        <h2>用户</h2>
      </HeaderLeft>
      <HeaderRight>
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key={"logout"}>
                <Button type={"link"} onClick={logout}>
                  退出登录
                </Button>
              </Menu.Item>
            </Menu>
          }
        >
          <Button type={"link"} onClick={(e) => e.preventDefault()}>
            Hi,{user?.name}
          </Button>
        </Dropdown>
      </HeaderRight>
    </Header>
  );
};

//grid布局
const Container = styled.div`
  display: grid;
  grid-template-rows: 6rem 1fr; //用来描述每一行的高度
  //footer：6rem header：6rem 中间的（nav main aside）：总高度-6rem-6rem
  //grid-template-columns: 20rem 1fr 20rem; //用来描述一行中每一列的宽度--》fr：自适应，总宽度-20*2rem
  /* grid-template-areas: 
//下面的名字为子组件中的grid-area属性的值，位置为布局的位置
    "header header header" //一行为header铺满
    "nav main aside" //从左到右依次为grid-area值为nav main aside的组件
    "footer footer footer"; */
  height: 100vh;
  //grid-gap: 10rem; //列之间的间隔
`;

//grid-area:用于给grid中的子元素起名字,这个名字会在父组件的grid-template-areas属性中用到
const Header = styled(Row)`
  padding: 3.2rem;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  z-index: 1;
`;

const HeaderLeft = styled(Row)``;
const HeaderRight = styled.div``;

const Main = styled.main``;
