import { Card } from "antd";
import React, { useState } from "react";
import { LoginScreen } from "unauthenticated-app/login";
import { RegisterScreen } from "unauthenticated-app/register";

export const UnauthenticatedApp = () => {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Card>
        {isRegister ? <RegisterScreen /> : <LoginScreen />}
        <button onClick={() => setIsRegister(!isRegister)}>
          切换为{isRegister ? "登陆" : "注册"}
        </button>
      </Card>
    </div>
  );
};
