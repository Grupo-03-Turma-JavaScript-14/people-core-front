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
}

export default App
