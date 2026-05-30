import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import { LeftBar } from "../Components/Global/LeftBar";
import { Footer } from "../Components/Global/Footer";
import Sobre from "./Sobre/Sobre";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import Home from "./Home/Home";
import Departamentos from "./Departamentos/Departamentos";
import Funcionarios from "./Funcionarios/Funcionarios";
import Perfil from "./Perfil/Perfil";

function isAuthenticated() {
  return Boolean(localStorage.getItem("token"));
}

function ProtectedRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function PublicRoute() {
  if (isAuthenticated()) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}

function PrivateLayout() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        minHeight: "100vh",
        width: "100vw",
      }}
    >
      <LeftBar />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: "100vh",
          overflowY: "auto",
        }}
      >
        <main
          style={{
            flex: 1,
            padding: "2rem",
          }}
        >
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated() ? (
            <Navigate to="/home" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<PrivateLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/funcionarios" element={<Funcionarios />} />
          <Route path="/departamentos" element={<Departamentos />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/sobre" element={<Sobre />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;