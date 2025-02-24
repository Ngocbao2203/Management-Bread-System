import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Login from "../pages/authentication/Login";
import Register from "../pages/authentication/Register";
import ForgotPassword from "../pages/authentication/ForgotPassword";
import ResetPassword from "../pages/authentication/ResetPassword";
import HomePage from "../components/homepage/HomePage";

const AppRouter = () => {
  return (
    <AnimatePresence mode="wait">
      <Routes>

        <Route path="/" element={<HomePage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AppRouter;
