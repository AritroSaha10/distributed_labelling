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

const firebaseConfig = {
  apiKey: "AIzaSyCvD5rSvR7c72l0aNNOnNWooMpdkRS51Dg",
  authDomain: "intellihelm-datalabelling.firebaseapp.com",
  projectId: "intellihelm-datalabelling",
  storageBucket: "intellihelm-datalabelling.appspot.com",
  messagingSenderId: "825808281805",
  appId: "1:825808281805:web:f9822fefb12c927fb54984",
  measurementId: "G-TRQGWT7TEG"
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
reportWebVitals();
