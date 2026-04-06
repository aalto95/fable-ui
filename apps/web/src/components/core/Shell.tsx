import type { PropsWithChildren } from "react";
import { Footer } from "../app/Footer.tsx";
import { Header } from "../app/Header.tsx";

export const Shell: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex min-h-dvh w-full flex-col">
      <Header />
      <main className="w-full flex-1 p-4">
        <div className="mx-auto h-full w-full max-w-7xl">{children}</div>
      </main>
      <Footer />
    </div>
  );
};
