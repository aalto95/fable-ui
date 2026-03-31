import { Link } from "react-router";
import { BaseButton } from "@/components/ui/button";
import { useDebug } from "@/contexts/debug";

export const Header: React.FC = () => {
  const { enabled, setEnabled } = useDebug();

  return (
    <header className="flex items-center justify-center p-4 border-b border-gray-200 w-full">
      <div className="flex w-full max-w-7xl justify-between">
        <h1 className="text-2xl font-bold">SDUI Renderer</h1>
        <nav className="flex justify-between items-center gap-4">
          <Link to="/">Home</Link>
          <Link to="/showcase">Showcase</Link>
          <BaseButton
            type="button"
            variant={enabled ? "default" : "outline"}
            size="sm"
            onClick={() => setEnabled(!enabled)}
          >
            Debug: {enabled ? "On" : "Off"}
          </BaseButton>
        </nav>
      </div>
    </header>
  );
};
