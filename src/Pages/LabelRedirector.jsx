import React, { useEffect, useState } from "react";

import Page403 from "./Page403";

import { useHistory } from "react-router-dom";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

function LabelRedirector(props) {
  const history = useHistory();
  let [finishedLabel, setFinishedLabel] = useState(false);
  
  useEffect(() => {
    let db = firebase.firestore();

    if (props.user != null) {
      // Run after 0.5s to ensure that the shuffler doesn't go over two of them
      setTimeout(() => {
        db.collection("images")
          .where("labelled", "==", false)
          .limit(10)
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.empty) {
              window.alert("All images have been labelled!");
              setFinishedLabel(true);
            } else {
              history.push(
                "/label/" +
                  querySnapshot.docs[
                    Math.floor(Math.random() * 100) % querySnapshot.docs.length
                  ].id
              );
            }
          });
      }, 500);
    }
  }, []);

  if (props.user != null) {
    if (finishedLabel) {
      return (
        <div className="container">
          <h1>All images have been labelled!</h1>
          <p>
            Congrats! Unless this is a glitch, all images should have been
            labelled! 🥳
          </p>
        </div>
      );
    } else {
      return (
        <div className="container">
          <h1>Please wait...</h1>
          <p>Finding an unlabelled image for you...</p>
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    }
  } else {
    return <Page403 />;
  }
}

export default LabelRedirector;
