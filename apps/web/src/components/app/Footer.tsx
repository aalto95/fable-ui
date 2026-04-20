export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto w-full shrink-0 border-border border-t px-4 py-3 sm:py-4">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 text-xs sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:text-sm">
        <p className="text-muted-foreground">Footer</p>
        <p className="text-muted-foreground">
          <span className="font-bold">Fable UI</span> by aalto95
        </p>
        <p className="text-muted-foreground">
          <span className="font-bold">Version</span> 1.1.0
        </p>
        <p className="text-muted-foreground">
          <span className="font-bold">License</span> MIT
        </p>
      </div>
    </footer>
  );
};
