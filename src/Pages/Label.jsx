import React, { useState, useEffect } from "react";

import { useHistory } from "react-router-dom";

import Button from "react-bootstrap/Button";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

import Page404 from "./Page404";

function LabelPage(props) {
  const history = useHistory();
  const [docData, setDocData] = useState(null);
  const [imgLink, setImgLink] = useState(null);

  const db = firebase.firestore();
  const docRef = db.collection("images").doc(props.match.params.id);

  const storage = firebase.storage();
  const storageRef = storage.ref();

  useEffect(() => {
    console.log("Running use effect!");
    // Get doc info

    let tmpData = null;

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          tmpData = doc.data();
          setDocData(tmpData);

          if (tmpData.labelled) {
            // ALerady labelled
            history.push("/label");
          } else {
            // If it's not labelled and it exists, then we can assign to person
            // Get image link
            storage
              .refFromURL(tmpData.img)
              .getDownloadURL()
              .then((url) => {
                setImgLink(url);
              });
          }
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
          // Wrong ID, Reshuffle
          history.push("/label");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
        // DON'T reshuffle, something's wrong
      });
  }, []); // [] added to make sure this only runs once

  if (props.user != null) {
    // Get doc info
    return (
      <div className="container">
        <h1>Labelling</h1>

        <img src={imgLink} alt="Sample to label" />

        <br />

        <div>
          <Button
            variant="success"
            className="mx-2"
            onClick={() => {
              // Set all parameteres required
              docRef.set({
                img: imgLink,
                hasCar: true,
                labelled: true,
                labelledby: props.user.email,
              });

              // Reshuffle
              history.push("/label");
            }}
          >
            Car in box
          </Button>

          <Button
            variant="danger"
            className="mx-2"
            onClick={() => {
              // Set all parameters required
              docRef.set({
                img: imgLink,
                hasCar: false,
                labelled: true,
                labelledby: props.user.email,
              });

              // Reshuffle
              history.push("/label");
            }}
          >
            No car in box
          </Button>
        </div>

        <br />
        <br />

        <Button
          variant="primary"
          onClick={() => {
            firebase.auth().signOut();
            props.setUser(null);
            history.push("/");
          }}
        >
          Logout
        </Button>
      </div>
    );
  } else {
    history.push("/");
    return (
      <div className="container">
        <h1>403: Access Denied</h1>
        <p>Please log in.</p>
      </div>
    );
  }
}

export default LabelPage;
