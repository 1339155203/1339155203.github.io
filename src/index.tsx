import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { DevTools, loadServer } from "jira-dev-tool";
// 务必在jira-dev-tool后面引入
import "antd/dist/antd.less";
import { AppProviders } from "context";

loadServer(() =>
  ReactDOM.render(
    <React.StrictMode>
      <AppProviders>
        <DevTools />
        <App />
      </AppProviders>
    </React.StrictMode>,
    document.getElementById("root")
  )
);

reportWebVitals();
