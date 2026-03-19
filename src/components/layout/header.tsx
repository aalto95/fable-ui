import { Link } from "react-router";
import { useDebug } from "../../contexts/debug";
import { Button } from "../ui/button";

export const Header: React.FC = () => {
  const { enabled, setEnabled } = useDebug();

  return (
    <header className="flex justify-between items-center p-4 border-b border-gray-200">
      <h1 className="text-2xl font-bold">BDUI Renderer</h1>
      <nav className="flex justify-between items-center gap-4">
        <Link to="/">Home</Link>
        <Link to="/user">User</Link>
        <Link to="/showcase">Showcase</Link>
        <Button
          type="button"
          variant={enabled ? "default" : "outline"}
          size="sm"
          onClick={() => setEnabled(!enabled)}
        >
          Debug: {enabled ? "On" : "Off"}
        </Button>
      </nav>
    </header>
  );
};
