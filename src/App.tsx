<<<<<<< HEAD
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Departamento from './pages/Departamentos/Departamentos'

function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/departamentos" element={<Departamento />}></Route>
      </Routes>
      
      </BrowserRouter>
    </>
  )
=======
import AppRoutes from "./Pages/AppRoutes";

function App() {
  return <AppRoutes />;
>>>>>>> 1ad60b0b688ec2d870c83774a624cee648ebca5f
}

export default App;