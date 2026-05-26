import { BrowserRouter } from "react-router-dom";
import { LeftBar } from "./Components/Global/LeftBar";
import { Footer } from "./Components/Global/Footer";

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', alignItems: 'stretch', minHeight: '100vh', width: '100vw' }}>

        {/* Sidebar */}
        <LeftBar />

        {/* Conteúdo + Footer */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100vh', overflowY: 'auto' }}>
          <main style={{ flex: 1, padding: '2rem' }}>
          </main>
          <Footer />
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;