import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./src/pages/Auth/Login";
import Register from "./src/pages/Auth/Register";
import DepartamentosPage from "./src/pages/Departamentos/Departamentos";
import Funcionarios from "./src/pages/Funcionarios/Funcionarios";
import Perfil from "./src/pages/Perfil/Perfil";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Register />} />
      <Route path="/funcionarios" element={<Funcionarios />} />
      <Route path="/departamentos" element={<DepartamentosPage />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/dashboard" element={<Navigate to="/funcionarios" />} />
      <Route path="/home" element={<Navigate to="/funcionarios" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default AppRoutes;