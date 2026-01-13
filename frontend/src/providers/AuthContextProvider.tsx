import { createContext, useContext, useState } from "react";
import { useLoadingContext } from "./LoadingContextProvider";
import { getToken } from "../api/auth";

const AuthContext = createContext<{
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  authenticate: () => Promise<void>;
  token?: string | null;
}>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  authenticate: async () => {},
  token: null
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const { setIsLoading } = useLoadingContext();

  const authenticate = async () => {
    setIsLoading(true);
    try {
      const fetchedToken = await getToken();
      setToken(fetchedToken);
      setIsAuthenticated(true);
    } catch(e) {
      console.error("Failed to authenticate:", e);
      setIsAuthenticated(false);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, authenticate, token }}>
      {children}
    </AuthContext.Provider>
  );
}
