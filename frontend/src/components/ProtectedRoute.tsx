import { useAuthContext } from '../providers';
import type { ChildrenProp } from '../interfaces';

export const ProtectedRoute = ({ children }: ChildrenProp) => {
	const { isAuthenticated } = useAuthContext();

	if (!isAuthenticated) {
		return null;
	}
	return children;
};
