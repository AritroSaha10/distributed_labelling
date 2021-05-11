import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Firebase dependencies 
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";
import "firebase/performance";

const firebaseConfig = {
  apiKey: "AIzaSyBA73N67aet1kkKVll2au36Nac-COMpMxA",
  authDomain: "datalabelling-intellihelm.firebaseapp.com",
  projectId: "datalabelling-intellihelm",
  databaseURL: "https://datalabelling-intellihelm-default-rtdb.firebaseio.com/",
  storageBucket: "datalabelling-intellihelm.appspot.com",
  messagingSenderId: "421034121336",
  appId: "1:421034121336:web:b81eb5829d85b7b862758d",
  measurementId: "G-KWF7PETS0V"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

const logWebVitals = (obj) => {
  firebase.analytics().logEvent(obj.name, {
    ...obj,
    userAgent: navigator.userAgent
  });
};

reportWebVitals(logWebVitals);

window.onerror = (message, source, lineno, colno, error) => {
  if (error) message = error.stack;
  firebase.analytics().logEvent("webError", {
    message: message,
    source: source,
    userAgent: navigator.userAgent
  });
};