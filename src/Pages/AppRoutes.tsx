import { Route, Routes } from "react-router-dom";

import Testes from "./Testes/Testes";
import Funcionarios from "./Funcionarios/Funcionarios";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Testes />} />
      <Route path="/testes" element={<Testes />} />
      <Route
        path="/funcionarios"
        element={<Funcionarios />}
      />
      <Route path="*" element={<Testes />} />
    </Routes>
  );
}

export default AppRoutes;