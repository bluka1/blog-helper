import { createContext, useContext, useEffect, useState } from "react";
import { useLoadingContext } from "./LoadingContextProvider";
import { getToken } from "../api/auth";
import { useNavigate } from "react-router";
import type { Props } from "../interfaces/Props";
import { AUTH_SERVICE_URL } from "../constants";

const AuthContext = createContext<{
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  authenticate: () => Promise<void>;
  token?: string | null;
  login: () => void;
}>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  authenticate: async () => {},
  token: null,
  login: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: Props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check localStorage first
    if (localStorage.getItem("auth_token")) return true;
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has("token");
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem("auth_token"));
  const { setIsLoading } = useLoadingContext();
  const navigate = useNavigate();

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

  const login = () => {
    window.location.href = `${AUTH_SERVICE_URL}/login`;
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("auth_token", tokenFromUrl);
      setToken(tokenFromUrl);
      setIsAuthenticated(true);
      // Remove token from URL and navigate to home
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, authenticate, token, login}}>
      {children}
    </AuthContext.Provider>
  );
}
