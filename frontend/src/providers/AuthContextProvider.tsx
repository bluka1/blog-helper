import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { Props } from "../interfaces/Props";
import { AUTH_SERVICE_URL } from "../constants";

interface CurrentUser {
  auth0_id: string;
  name: string;
  email: string;
}

function parseJwtPayload(token: string): CurrentUser | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      auth0_id: payload.sub ?? "",
      name: payload.name ?? payload.email ?? "",
      email: payload.email ?? "",
    };
  } catch {
    return null;
  }
}

const AuthContext = createContext<{
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  token?: string | null;
  currentUser: CurrentUser | null;
  login: () => void;
  logout: () => void;
}>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  token: null,
  currentUser: null,
  login: () => {},
  logout: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: Props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (localStorage.getItem("auth_token")) return true;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has("token");
  });
  const [token, setToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) return storedToken;
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    if (tokenFromUrl) {
      localStorage.setItem("auth_token", tokenFromUrl);
      return tokenFromUrl;
    }
    return null;
  });
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => {
    const storedToken = localStorage.getItem("auth_token");
    return storedToken ? parseJwtPayload(storedToken) : null;
  });
  const navigate = useNavigate();

  const login = () => {
    window.location.href = `${AUTH_SERVICE_URL}/login`;
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
    navigate("/");
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("auth_token", tokenFromUrl);
      setToken(tokenFromUrl);
      setCurrentUser(parseJwtPayload(tokenFromUrl));
      setIsAuthenticated(true);
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, token, currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
