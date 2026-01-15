import { NavLink } from "react-router-dom";

export const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="page-layout">
      <header>
        <h1>Blog Helper</h1>
        <nav>
          <NavLink to="/" className={({isActive}) => isActive ? 'active' : ''}>Home</NavLink> |{" "}
          <NavLink to="/create" className={({isActive}) => isActive ? 'active' : ''}>Kreiraj novi blog</NavLink>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <p className="copy">&copy; 2026 Blog Helper</p>
      </footer>
    </div>
  );
}
