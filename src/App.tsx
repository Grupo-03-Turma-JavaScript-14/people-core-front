import { BrowserRouter, useLocation } from "react-router-dom";
import { LeftBar } from "./Components/Global/LeftBar";
import { Footer } from "./Components/Global/Footer";
import AppRoutes from "../AppRoutes";

// Rotas que NÃO mostram sidebar/footer interno (têm layout próprio)
const NO_LAYOUT_ROUTES = ["/login", "/cadastro", "/", "/sobre"];

function Layout() {
  const location = useLocation();
  const isNoLayout = NO_LAYOUT_ROUTES.includes(location.pathname);

  if (isNoLayout) {
    return <AppRoutes />;
  }

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      {/* Sidebar fixa */}
      <div className="shrink-0 h-screen sticky top-0">
        <LeftBar />
      </div>
      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1 h-screen overflow-y-auto">
        <main className="flex-1 p-0">
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