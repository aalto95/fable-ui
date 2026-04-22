import type { ITitleComponent } from "@/models/interfaces/component";

export type TTitleProps = Exclude<ITitleComponent, "type">;

export const Title: React.FC<TTitleProps> = ({ text, hidden }) => {
  if (hidden) {
    return null;
  }

  return <h2 className="font-semibold text-2xl tracking-tight">{text}</h2>;
};
