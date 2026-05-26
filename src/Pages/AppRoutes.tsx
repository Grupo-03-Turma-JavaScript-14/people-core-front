import { Route, Routes } from "react-router-dom";
import Home from "./Home/Home";
import Testes from "./Testes/Testes";
import Departamentos from "./Departamentos/Departamentos";
import Funcionarios from "./Funcionarios/Funcionarios";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/testes" element={<Testes />} />
      <Route path="/funcionarios" element={<Funcionarios />} />
      <Route path="/departamentos" element={<Departamentos />}></Route>
      <Route path="*" element={<Testes />} />
      <Route path="/departamentos" element={<Departamentos />}></Route>
    </Routes>
  );
}

export default AppRoutes;