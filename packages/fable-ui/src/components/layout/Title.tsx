import type { ITitleComponent } from "@/models/interfaces/component";

export type TTitleProps = Exclude<ITitleComponent, "type">;

export const Title: React.FC<TTitleProps> = ({ text, hidden }) => {
  if (hidden) {
    return null;
  }

  return <h2 className="text-2xl font-semibold tracking-tight">{text}</h2>;
};
