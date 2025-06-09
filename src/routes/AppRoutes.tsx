// routes/AppRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../components/auth/LoginPage";
import Layout from "../components/Layout";
import { useAppSelector } from "../redux/hooks";
import HomePage from "../components/Dashboard/HomePage";
import OopsPage from "../components/auth/OppsPage";

const AppRoutes = () => {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <LoginPage />}
        />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <HomePage /> : <Navigate to="/" />}
        />
      </Route>
      <Route path="*" element={<OopsPage />} />
    </Routes>
  );
};

export default AppRoutes;
