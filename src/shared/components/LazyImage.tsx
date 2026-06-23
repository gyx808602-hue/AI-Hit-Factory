import type { ImgHTMLAttributes } from "react";

type LazyImageProps = ImgHTMLAttributes<HTMLImageElement>;

export function LazyImage({ alt, className, ...props }: LazyImageProps) {
  return (
    <img
      {...props}
      alt={alt}
      className={className}
      decoding="async"
      loading="lazy"
    />
  );
}
