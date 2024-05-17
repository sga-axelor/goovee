"use client";

import { Box } from "@axelor/ui";

export type BackgroundImageProps = {
  src?: string;
  defaultSrc?: string;
  height?: string | number;
  width?: string | number;
  style?: React.CSSProperties;
} & React.ComponentProps<typeof Box>;

export function BackgroundImage({
  src,
  style,
  height,
  width,
  defaultSrc = "/images/no-image.png",
  ...rest
}: BackgroundImageProps) {
  const url = src || defaultSrc;
  return (
    <Box
      rounded={2}
      style={{
        height,
        width,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: `url(${url})`,
        ...style,
      }}
      {...rest}
    />
  );
}

export default BackgroundImage;
