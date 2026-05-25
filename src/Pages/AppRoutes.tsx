import { Route, Routes } from "react-router-dom";
import Home from "./Home/Home";
import Testes from "./Testes/Testes";
import Register from "./Auth/Register";
import Login from "./Auth/Login";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/testes" element={<Testes />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Register />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default AppRoutes;