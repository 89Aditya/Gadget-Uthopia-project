import React from "react";
import { Routes, Route } from "react-router-dom";
import WelcomeLogin from "./components/WelcomeLogin";
import FormCard from "./components/FormCard";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Profile from "./components/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomeLogin />} />
      <Route path="/register" element={<FormCard />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;

