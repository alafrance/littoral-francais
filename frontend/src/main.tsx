import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import "./styles/index.css";
import { BrowserRouter } from "react-router";

import { Provider } from 'react-redux'
import store from './stores/stores'

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
