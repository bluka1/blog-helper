import { useEffect } from "react"
import { useAuthContext } from "./providers/AuthContextProvider"
import type { Props } from "./interfaces/Props";

export const ProtectedRoute = ({children}: Props) => {
  const { isAuthenticated, login } = useAuthContext();

  useEffect(() => {
    if (!isAuthenticated) {
      login();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }
  return children;
}
