import React, { useState, useEffect } from "react";

import Page403 from "./Page403";

import { useHistory } from "react-router-dom";

import Button from "react-bootstrap/Button";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

function LabelPage(props) {
  const history = useHistory();
  const [docData, setDocData] = useState(null);
  const [imgLink, setImgLink] = useState(null);

  const db = firebase.firestore();
  const docRef = db.collection("images").doc(props.match.params.id);

  const storage = firebase.storage();

  useEffect(() => {
    // Get doc info
    let tmpData = null;

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          tmpData = doc.data();
          setDocData(tmpData);

          if (tmpData.labelled) {
            // ALerady labelled
            // Don't go back, but instead show who completed it, what it was flagged as, and whether it was completed or not
            // history.push("/label");
          }

          // Get actual URL from storage ref
          storage
            .refFromURL(tmpData.img)
            .getDownloadURL()
            .then((url) => {
              setImgLink(url);
            });
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
          // Wrong ID, Reshuffle
          history.push("/label");
        }
      })
      .catch((error) => {
        if (error.code === "permission-denied") {
          // Likely happened because of logout, ignore
        } else {
          // DON'T reshuffle, something's wrong
          console.log("Error getting document:", error);
        }
      });
  }, [docRef, history, storage]); // [] added to make sure this only runs once

  if (props.user != null) {
    // Get doc info
    return (
      <div className="container">
        <h1>Labelling</h1>
        <p>
          Hello {props.user.email}, welcome to the labelling page! Please
          identify whether there is a car in the box or not.
        </p>

        <br />

        <p>ID of image: {props.match.params.id}</p>
        {docData && docData.labelled && (
          <p>
            <strong>Warning: </strong>This image has already been completed by{" "}
            {docData.labelledby}, and it was marked as{" "}
            {docData.hasCar === true ? "having a car." : "not having a car."}
          </p>
        )}
        <img
          src={imgLink}
          alt="Sample to label"
          className="img-fluid rounded"
          style={{ border: "3px solid #000000", borderRadius: "5px" }}
        />

        <br />
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
    return <Page403 />;
  }
}

export default LabelPage;
