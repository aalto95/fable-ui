import { cn } from "@fable-ui/shared";

import type { IImageComponent } from "@/models/interfaces/component";

export type TImageProps = Exclude<IImageComponent, "type">;

export const Image: React.FC<TImageProps> = ({
  src,
  alt = "",
  hidden,
  className,
  imgClassName,
  loading = "lazy",
  width,
  height,
}) => {
  if (hidden) {
    return null;
  }

  const url = typeof src === "string" ? src.trim() : "";
  if (!url) {
    return null;
  }

  return (
    <div className={cn("w-full overflow-hidden rounded-lg border border-border", className)}>
      <img
        src={url}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        className={cn("h-auto max-w-full object-contain", imgClassName)}
      />
    </div>
  );
};
