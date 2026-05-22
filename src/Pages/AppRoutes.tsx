import { Route, Routes } from "react-router-dom";

import Testes from "./Testes/Testes";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Testes />} />
      <Route path="/testes" element={<Testes />} />
      <Route path="*" element={<Testes />} />
    </Routes>
  );
}

export default AppRoutes;