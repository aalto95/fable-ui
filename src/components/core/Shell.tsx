import type { PropsWithChildren } from "react";
import { Footer } from "@/components/app/Footer";
import { Header } from "@/components/app/Header";

export const Shell: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col w-full items-center min-h-screen">
      <Header />
      <main className="p-4 flex-1 flex flex-col items-center w-full">
        <div className="w-full max-w-7xl">{children}</div>
      </main>
      <Footer />
    </div>
  );
};
