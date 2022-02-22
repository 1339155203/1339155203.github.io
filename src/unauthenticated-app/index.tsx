import { Button, Card, Divider } from "antd";
import React, { useState } from "react";
import { LoginScreen } from "unauthenticated-app/login";
import { RegisterScreen } from "unauthenticated-app/register";
import styled from "@emotion/styled";
import logo from "assets/logo.svg";
import right from "assets/right.svg";
import left from "assets/left.svg";
import { useDocumentTitle } from "utils";
import { ErrorBox } from "components/lib";
export const UnauthenticatedApp = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  useDocumentTitle("请登录注册以继续");
  return (
    <Container>
      <Header />
      <Backgrount />
      <ShadowCard>
        <Title>{isRegister ? "请注册" : "请登录"}</Title>
        <ErrorBox error={error} />
        {isRegister ? (
          <RegisterScreen onError={setError} />
        ) : (
          <LoginScreen onError={setError} />
        )}
        <Divider />
        <Button type={"link"} onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "已经有帐号了？直接登陆" : "没有账号？注册新账号"}
        </Button>
      </ShadowCard>
    </Container>
  );
};

//css in js 方法相比于直接在组件上写style={} 的优势在于他能对伪类等进行操作
//用法为emotion库 通过库里的style定义一个新的组件来代替原有组件
const Container = styled.div`
  //如果是html中的元素，用styled.
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;

const ShadowCard = styled(Card)`
  //如果不是html中的元素，如antd的，用styled（）
  width: 40rem;
  min-height: 56rem;
  padding: 3.2rem 4rem;
  border-radius: 0.3rem;
  box-sizing: border-box;
  box-shadow: rgba(0, 0, 0, 0.1) 0 0 10px;
  text-align: center;
`;

const Header = styled.header`
  background: url(${logo}) no-repeat center;
  padding: 5rem 0;
  background-size: 8rem;
  width: 100%;
`;

const Backgrount = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-attachment: fixed; //决定背景是否随页面滑动而滑动
  background-position: left bottom, right bottom;
  background-size: calc(((100vw - 40rem) / 2)-3.2rem),
    calc(((100vw - 40rem) / 2)-3.2rem), cover;
  background-image: url(${left}), url(${right});
`;

const Title = styled.h2`
  margin-bottom: 2.4rem;
  color: rgb(94, 108, 132);
`;

export const LongButton = styled(Button)`
  width: 100%;
`;
