import { Navigate } from "react-router-dom";
import { estaLogado } from "../../Service/Service";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {

  if (!estaLogado()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}