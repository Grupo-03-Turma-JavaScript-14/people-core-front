import {Route, Routes } from 'react-router-dom'
import Departamento from './pages/Departamentos/Departamentos'

function App() {

  return (
    <>
      <Routes>
        <Route path="/departamentos" element={<Departamento />}></Route>
      </Routes>
    </>
  )
}

export default App;