import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import firebase from "firebase/app";
import "firebase/auth";

import { useHistory } from "react-router-dom";

import { Formik } from "formik";
import * as yup from "yup";

const schema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});

function LoginPage(props) {
  const history = useHistory();

  // Check if user is already logged in
  if (props.user != null) {
    history.push("/label");
    return (
        <h1>
            Hi!
        </h1>
    )
  }

  const loginUser = (data) => {
    const persistencePromise = firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL);

    persistencePromise.then(() => {
      firebase
        .auth()
        .signInWithEmailAndPassword(data.username, data.password)
        .then((userCredential) => {
          let user = userCredential.user;
          props.setUser(user);
          history.push("/label");
        })
        .catch((error) => {
          props.setUser(null);
          console.log(error.code);
          console.log(error.message);
          window.alert(error.message);
        });
    });

    persistencePromise.catch((error) => {
      console.log(error.code);
      console.log(error.message);
    });

    console.log(props.user);
  };

  return (
    <div className="container">
      <div
        className="container"
        style={{
          margin: 0,
          position: "absolute",
          top: "40%",
          transform: "translateY(-40%)",
        }}
      >
        <h1>Login Page</h1>
        <br />

        <Formik
          validationSchema={schema}
          onSubmit={loginUser}
          initialValues={{
            username: "",
            password: "",
          }}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            isValid,
            errors,
          }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group md="4" controlId="validationFormikUsername2">
                <Form.Label>Username</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    isInvalid={!!errors.username}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {errors.username}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Form.Group md="4" controlId="validationFormikPassword2">
                <Form.Label>Password</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {errors.password}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Button type="submit">Login</Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default LoginPage;
