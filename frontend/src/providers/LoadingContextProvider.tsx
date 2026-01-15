import { createContext, useContext, useState } from "react";
import type { Props } from "../interfaces/Props";

const LoadingContext = createContext<{
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  isLoading: false,
  setIsLoading: () => {}
});

const useLoadingContext = () => useContext(LoadingContext);

const LoadingContextProvider = ({ children }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  return <LoadingContext.Provider value={{ isLoading, setIsLoading }}>{children}</LoadingContext.Provider>; 
};

export { LoadingContext, useLoadingContext, LoadingContextProvider };
