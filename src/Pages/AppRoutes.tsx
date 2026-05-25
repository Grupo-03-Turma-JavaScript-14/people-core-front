import { Route, Routes } from "react-router-dom";

import Testes from "./Testes/Testes";
import Register from "./Auth/Register";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Testes />} />
      <Route path="/testes" element={<Testes />} />
      <Route path="/cadastro" element={<Register />} />
      <Route path="*" element={<Testes />} />
    </Routes>
  );
}

export default AppRoutes;