import type { ISubtitleComponent } from "@/models/interfaces/component";

export type TSubtitleProps = Exclude<ISubtitleComponent, "type">;

export const Subtitle: React.FC<TSubtitleProps> = ({ text, hidden }) => {
  if (hidden) {
    return null;
  }

  return <p className="text-sm text-muted-foreground">{text}</p>;
};
