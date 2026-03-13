import { NavLink } from 'react-router-dom';
import { useAuthContext } from '../providers';

export const PageLayout = ({ children }: { children: React.ReactNode }) => {
	const { currentUser, logout, isAuthenticated } = useAuthContext();

	return (
		<div className='page-layout'>
			<header>
				<h1>Blog Helper</h1>
				<nav>
					<NavLink
						to='/'
						className={({ isActive }) => (isActive ? 'active' : '')}
					>
						Home
					</NavLink>{' '}
					|{' '}
					<NavLink
						to='/create'
						className={({ isActive }) => (isActive ? 'active' : '')}
					>
						Create post
					</NavLink>
				</nav>
				{isAuthenticated && (
					<div>
						{currentUser?.name && (
							<span className='user-name'>{currentUser.name}</span>
						)}
						<button className='btn' onClick={logout}>
							Log out
						</button>
					</div>
				)}
			</header>
			<main>{children}</main>
			<footer>
				<p className='copy'>&copy; 2026 Blog Helper</p>
			</footer>
		</div>
	);
};
