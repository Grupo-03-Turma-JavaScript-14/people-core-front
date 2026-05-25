import {Route, Routes } from 'react-router-dom'
import Departamentos from './pages/Departamentos/Departamentos'

function App() {

  return (
    <>
      <Routes>
        <Route path="/departamentos" element={<Departamentos />}></Route>
      </Routes>
    </>
  )
}

export default App;