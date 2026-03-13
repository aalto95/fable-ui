import { Link } from "react-router";

export const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 border-b border-gray-200">
      <h1 className="text-2xl font-bold">BDUI Renderer</h1>
      <nav className="flex justify-between items-center gap-4">
        <Link to="/">Home</Link>
        <Link to="/user">User</Link>
      </nav>
    </header>
  );
};