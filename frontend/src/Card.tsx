import { NavLink } from "react-router";

export const Card = ({ title, id } : { title: string, id: string }) => {
  return (
    <NavLink className="card" to={`${id}`}>
      <h2>{title}</h2>
    </NavLink>
  );
}
