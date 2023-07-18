import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {initializeApp} from 'firebase/app'

const firebaseConfig = {
  apiKey: "AIzaSyBWpsDIxwZ-oF3wal3ypIyHy0vAWT7Ozw4",
  authDomain: "link-shortener-4a1d6.firebaseapp.com",
  projectId: "link-shortener-4a1d6",
  storageBucket: "link-shortener-4a1d6.appspot.com",
  messagingSenderId: "580234093106",
  appId: "1:580234093106:web:acdabe54bd5ae3ad62122b",
  measurementId: "G-J6LTYLMSJP"
};

initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
