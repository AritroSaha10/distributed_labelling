import React, { useState, useEffect } from "react";

import Page403 from "./Page403";

import { useHistory } from "react-router-dom";

import Button from "react-bootstrap/Button";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/database";

function LabelPage(props) {
  const history = useHistory();
  const [docData, setDocData] = useState(null);
  const [imgLink, setImgLink] = useState(null);

  const firestoreDB = firebase.firestore();
  const realtimeDB = firebase.database();
  const storage = firebase.storage();

  const docRef = firestoreDB.collection("images").doc(props.match.params.id);

  const [stats, setStats] = useState([0, 0]); // First number is how much they did, and second number is how much everyone did
  const imgsInDataset = 22303; // This may vary based on your dataset

  useEffect(() => {
    // Get doc info
    let tmpData = null;

    // Only do if user exists
    if (props.user !== null) {
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

            // I am stupid. My stupidity caused a glitch where some of the sources are datalabelling=intellihelm instead of datalabelling-intellihelm
            // This fixes my stupidity.
            let imgLink = tmpData.img;
            imgLink = imgLink.replace(
              "datalabelling=intellihelm",
              "datalabelling-intellihelm"
            );

            storage
              .refFromURL(imgLink)
              .getDownloadURL()
              .then((url) => {
                setImgLink(url);
              });

            // Get the number of images they've labelled as well as everyone else's
            const refToAll = realtimeDB.ref("users");
            refToAll.on("value", (snapshot) => {
              if (snapshot === null) {
                return;
              }
              const snapshotVal = snapshot.val();

              let countForLoggedIn = 0;
              let totalCount = 0;

              for (const person in snapshot.val()) {
                const obj = snapshotVal[person];
                if (person === props.user.uid) {
                  countForLoggedIn = obj.count;
                }
                totalCount += obj.count;
              }

              setStats([countForLoggedIn, totalCount]);
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
            firebase.analytics().logEvent("documentFetchError", {
              message: error,
              userAgent: navigator.userAgent,
            });
          }
        });
    }
  }, []); // [] added to make sure this only runs once

  const updateInfoInDBs = (docRefData) => {
    // Push all data to firestore database (stores labelling info)
    docRef.set(docRefData).catch(error => {
      firebase.analytics().logEvent("documentUpdateError", {
        message: error,
        userAgent: navigator.userAgent,
      });
    });

    // Update RTDB with count of how many images this person has labelled
    // Check if a document for the person already exists, if not, then create one
    const userRef = realtimeDB.ref("users/" + props.user.uid);

    userRef
      .get()
      .then(function (snapshot) {
        if (snapshot.exists()) {
          // Does exist, only update the value
          userRef.transaction((user) => {
            if (user) user.count++;
            return user;
          });
        } else {
          // Does not exist, create a new doc for person
          userRef.set({
            email: props.user.email,
            count: 1,
          });
        }
      })
      .catch(function (error) {
        console.log(error);
        firebase.analytics().logEvent("rtdbUpdateError", {
          message: error,
          userAgent: navigator.userAgent,
        });
      });

    // Reshuffle
    history.push("/label");
  };

  const percentageDoneEveryone = Math.floor((stats[1] / imgsInDataset) * 100);
  const percentageDoneLoggedIn =
    Math.floor((stats[0] / imgsInDataset) * 100) + "%";
  const difference =
    percentageDoneEveryone - Math.floor((stats[0] / imgsInDataset) * 100) + "%";

  if (props.user != null) {
    return (
      <div className="container">
        <h1>Labelling</h1>
        <p>
          Hello {props.user.email}, welcome to the labelling page! Please
          identify whether there is a car in the box or not.
        </p>

        <div>
          <p>
            You have labelled {stats[0]} images ({percentageDoneLoggedIn}).{" "}
          </p>
          <div className="progress" style={{ height: "3vh" }}>
            <div
              className="progress-bar"
              style={{ width: percentageDoneLoggedIn }}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {stats[0]}
            </div>
            <div
              className="progress-bar bg-success"
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ width: difference }}
            >
              {stats[1] - stats[0]}
            </div>
          </div>
        </div>

        <br />

        <p>ID of image: {props.match.params.id}</p>

        <img
          src={imgLink}
          alt="Sample to label"
          className="img-fluid rounded"
          style={{
            border: "3px solid #000000",
            borderRadius: "5px",
            maxWidth: "80%",
            maxHeight: "80%",
          }}
        />

        <br />
        <br />

        {docData && docData.labelled && (
          <p>
            <strong>Warning: </strong>This image has already been completed by{" "}
            {docData.labelledby}, and it was marked as{" "}
            {docData.hasCar === true ? "having a car." : "not having a car."}
          </p>
        )}

        <br />

        <div className="">
          <div className="">
            <Button
              variant="success"
              className="mx-4"
              title="Car is in the box"
              onClick={() => {
                updateInfoInDBs({
                  img: imgLink,
                  hasCar: true,
                  labelled: true,
                  includeInDataset: true,
                  labelledby: props.user.email,
                });
              }}
            >
              Car in box
            </Button>

            <Button
              variant="danger"
              className="mx-4"
              title="Car is not in the box"
              onClick={() => {
                updateInfoInDBs({
                  img: imgLink,
                  hasCar: false,
                  labelled: true,
                  includeInDataset: true,
                  labelledby: props.user.email,
                });
              }}
            >
              No car in box
            </Button>
          </div>

          <br />

          <div className="">
            <Button
              variant="warning"
              className="mx-4"
              onClick={() => {
                updateInfoInDBs({
                  img: imgLink,
                  hasCar: null,
                  labelled: true,
                  includeInDataset: false,
                  labelledby: props.user.email,
                });
              }}
              title="Includes lane turns, unclear images, etc"
            >
              Don't include
            </Button>

            <Button
              variant="secondary"
              className="mx-4"
              title="Skip the image, will show up later"
              onClick={() => {
                // Just go to another one
                history.push("/label");
              }}
            >
              Skip image
            </Button>
          </div>
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
