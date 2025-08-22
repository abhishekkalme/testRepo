import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import App from "./App"; // your existing component (was App)
import App1 from "./App1";
import App3 from "./App3"
import App4 from "./App4"
import Dashboard from "./dashboard";
import Login from "./login";
import History from "./History";

export default function App2() {

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-quiz" element={<App />} />
      <Route path="/view" element={<App1 />} />
      <Route path="/result" element={<App3 />} />
      <Route path="/group-results" element={<App4 />} />
      <Route path="/history" element={<History />} />
    </Routes>
  );
}