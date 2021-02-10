import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import LoginPage from "./Pages/login";
import Page404 from "./Pages/Page404";
import LabelRedirector from "./Pages/LabelRedirector";

import "bootstrap/dist/css/bootstrap.min.css";
import LabelPage from "./Pages/Label";

import firebase from "firebase/app";
import "firebase/auth";

function App() {
  const [user, setUser] = useState(firebase.auth().currentUser);

  console.log(firebase.auth().currentUser);
  return (
    <Router>
      <div className="App">
        <br />

        <Switch>
          <Route
            path="/"
            exact
            component={(routerProps) => (
              <LoginPage {...routerProps} user={user} setUser={setUser} />
            )}
          />

          <Route
            path="/label/:id"
            exact
            component={(routerProps) => (
              <LabelPage {...routerProps} user={user} setUser={setUser} />
            )}
          />
          <Route
            path="/label"
            exact
            component={(routerProps) => (
              <LabelRedirector {...routerProps} user={user} setUser={setUser} />
            )}
          />

          <Route path="*">
            <Page404 />
          </Route>
        </Switch>

        <br />

        <p style={{ position: "fixed", bottom: 20, width: "101%", margin: "0 auto"}}>© Aritro Saha 2021</p>
      </div>
    </Router>
  );
}

export default App;
