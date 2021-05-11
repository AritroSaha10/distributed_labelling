import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import LoginPage from "./Pages/Login";
import Page404 from "./Pages/Page404";
import LabelRedirector from "./Pages/LabelRedirector";

import "bootstrap/dist/css/bootstrap.min.css";
import LabelPage from "./Pages/Label";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/performance";
import "firebase/analytics";

function App() {
  const [user, setUser] = useState(firebase.auth().currentUser);
  const [loading, setLoading] = useState(true);
  firebase.performance();
  
  useEffect(() => {
    setUser(firebase.auth().currentUser);
    firebase.auth().onAuthStateChanged((user) => {
      setLoading(false);
      setUser(user);
    });

    // Get the non-labelled
  }, []);

  if (!loading) {
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
                <LabelRedirector
                  {...routerProps}
                  user={user}
                  setUser={setUser}
                />
              )}
            />

            <Route path="*">
              <Page404 />
            </Route>
          </Switch>

          <br />

          <p>© Aritro Saha 2021</p>
        </div>
      </Router>
    );
  } else {
    return (
      <div className="App">
        <div className="container">
          <br />
          <h1>Loading...</h1>
          <p>Please wait...</p>
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
