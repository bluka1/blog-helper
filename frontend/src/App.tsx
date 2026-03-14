import { Route, Routes } from 'react-router';

import { CreateNewPostPage, DashboardPage, EditPostPage } from './pages';
import { PageLayout, Post, ProtectedRoute } from './components';
import { useAuthContext } from './providers';

export default function App() {
	const { login, isAuthenticated } = useAuthContext();

	return (
		<PageLayout>
			{!isAuthenticated && (
				<button className='login-btn' onClick={login}>
					Login
				</button>
			)}
			<Routes>
				<Route
					path='/'
					element={
						<ProtectedRoute>
							<DashboardPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/create'
					element={
						<ProtectedRoute>
							<CreateNewPostPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/:id'
					element={
						<ProtectedRoute>
							<Post />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/:id/edit'
					element={
						<ProtectedRoute>
							<EditPostPage />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</PageLayout>
	);
}
