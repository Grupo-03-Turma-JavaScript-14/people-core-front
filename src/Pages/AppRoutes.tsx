import { Route, Routes } from "react-router-dom";

import Home from "./Home/Home";
import Testes from "./Testes/Testes";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/testes" element={<Testes />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default AppRoutes;