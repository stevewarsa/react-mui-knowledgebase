import React from 'react';
import {Redirect, Route, Switch} from "react-router-dom";
import Main from "./pages/Main";

function App() {
  return (
      <Switch>
        <Route path="/" exact>
          <Redirect to="/main"/>
        </Route>
        <Route path="/main" exact>
            <Main/>
        </Route>
      </Switch>
  );
}

export default App;
