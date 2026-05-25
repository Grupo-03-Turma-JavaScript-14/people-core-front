import { Route, Routes } from "react-router-dom";

import Testes from "./Testes/Testes";
import Departamentos from "./Departamentos/Departamentos";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Testes />} />
      <Route path="/testes" element={<Testes />} />
      <Route path="*" element={<Testes />} />
      <Route path="/departamentos" element={<Departamentos />}></Route>
    </Routes>
  );
}

export default AppRoutes;