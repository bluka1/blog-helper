import { createContext, useContext, useState } from 'react';
import type { ChildrenProp } from '../interfaces';

const LoadingContext = createContext<{
	isLoading: boolean;
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}>({
	isLoading: false,
	setIsLoading: () => {},
});

const useLoadingContext = () => useContext(LoadingContext);

const LoadingContextProvider = ({ children }: ChildrenProp) => {
	const [isLoading, setIsLoading] = useState(false);

	return (
		<LoadingContext.Provider value={{ isLoading, setIsLoading }}>
			{children}
		</LoadingContext.Provider>
	);
};

export { LoadingContext, useLoadingContext, LoadingContextProvider };
