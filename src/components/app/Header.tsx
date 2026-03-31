import { Link } from "react-router";
import { BaseButton } from "@/components/ui/button";
import { useDebug } from "@/contexts/debug";

export const Header: React.FC = () => {
  const { enabled, setEnabled } = useDebug();

  return (
    <header className="w-full border-b border-gray-200 px-4 py-3 sm:py-4">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold sm:text-2xl">SDUI Renderer</h1>
        <nav className="flex flex-wrap items-center gap-3 sm:gap-4">
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
