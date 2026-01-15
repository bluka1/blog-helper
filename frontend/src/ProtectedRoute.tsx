import { Navigate } from "react-router-dom"
import { useAuthContext } from "./providers/AuthContextProvider"
import type { Props } from "./interfaces/Props";

export const ProtectedRoute = ({children}: Props) => {
  const { isAuthenticated } = useAuthContext();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }
  return children;
}
