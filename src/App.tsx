import { BrowserRouter, useLocation } from "react-router-dom";
import { LeftBar } from "./Components/Global/LeftBar";
import { Footer } from "./Components/Global/Footer";
import AppRoutes from "../AppRoutes";

const AUTH_ROUTES = ["/login", "/cadastro"];

function Layout() {
  const location = useLocation();
  const isAuthPage = AUTH_ROUTES.includes(location.pathname);

  if (isAuthPage) {
    return (
      <div className="min-h-screen w-screen bg-[#011a1b] flex items-center justify-center">
        <AppRoutes />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'stretch', minHeight: '100vh', width: '100vw' }}>
      <LeftBar />
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100vh', overflowY: 'auto' }}>
        <main style={{ flex: 1, padding: '2rem' }}>
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;