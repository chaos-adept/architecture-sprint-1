import React from "react";
import ReactDOM from "react-dom/client";
import Login from "./components/Login";
import "./index.css";

const onLogin = () => {

};

const App = () => (
  <div className="container">
    <div>Name: auth-microfrontend</div>
    <div>Framework: react</div>
    <div>Language: JavaScript</div>
    <div>CSS: Empty CSS</div>
    <Login onLogin={onLogin}></Login>
  </div>
);
const rootElement = document.getElementById("app")
if (!rootElement) throw new Error("Failed to find the root element")

const root = ReactDOM.createRoot(rootElement)

root.render(<App />)