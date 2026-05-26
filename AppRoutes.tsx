import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./src/Components/Auth/ProtectedRoute";

import Login from "./src/Pages/Auth/Login";
import Register from "./src/Pages/Auth/Register";

import Home from "./src/Pages/Home/Home";
import Funcionarios from "./src/Pages/Funcionarios/Funcionarios";
import Departamentos from "./src/Pages/Departamentos/Departamentos";
import Perfil from "./src/Pages/Perfil/Perfil";

import SobreNos from "./src/Pages/AboutUs/Sobrenos";

function AppRoutes() {
  return (
    <Routes>

      {/* PÁGINA INICIAL */}
      <Route path="/" element={<SobreNos />} />

      {/* SOBRE */}
      <Route path="/sobre" element={<SobreNos />} />

      {/* LOGIN */}
      <Route path="/login" element={<Login />} />

      {/* CADASTRO */}
      <Route path="/cadastro" element={<Register />} />

      {/* ROTAS PROTEGIDAS */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/funcionarios"
        element={
          <ProtectedRoute>
            <Funcionarios />
          </ProtectedRoute>
        }
      />

      <Route
        path="/departamentos"
        element={
          <ProtectedRoute>
            <Departamentos />
          </ProtectedRoute>
        }
      />

      <Route
        path="/perfil"
        element={
          <ProtectedRoute>
            <Perfil />
          </ProtectedRoute>
        }
      />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Navigate to="/home" replace />
          </ProtectedRoute>
        }
      />

      {/* QUALQUER ROTA ERRADA */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;