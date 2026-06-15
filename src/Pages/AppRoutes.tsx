import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import LeftBar from "../Components/Global/LeftBar";
import { Footer } from "../Components/Global/Footer";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import Home from "./Home/Home";
import Funcionarios from "./Funcionarios/Funcionarios";
import Departamentos from "./Departamentos/Departamentos";
import Perfil from "./Perfil/Perfil";
import Sobre from "./Sobre/Sobre";



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
    <div className="private-layout">
      <LeftBar />

      <div className="private-layout__body">
        <main className="private-layout__main">
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
