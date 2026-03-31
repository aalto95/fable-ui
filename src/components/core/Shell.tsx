import type { PropsWithChildren } from "react";
import { Footer } from "@/components/app/Footer";
import { Header } from "@/components/app/Header";

export const Shell: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex min-h-dvh w-full flex-col">
      <Header />
      <main className="w-full flex-1 p-4">
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </main>
      <Footer />
    </div>
  );
};
