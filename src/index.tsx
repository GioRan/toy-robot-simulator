import React from "react";
import ReactDOM from "react-dom";
import Grid from "./Modules/Grid/Grid";
import Form from "./Modules/Form/Form";
import { Provider } from "react-redux";
import * as serviceWorker from "./serviceWorker";
import MainStoreReducer from "./Reducers/MainStoreReducer";
import { createStore } from "redux";

const MainStore = createStore(MainStoreReducer);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={MainStore}>
      <Form />
      <Grid />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
