"use client";

export type BackgroundImageProps = {
  src?: string;
  defaultSrc?: string;
  height?: string | number;
  width?: string | number;
  style?: React.CSSProperties;
}

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
    <div
      className="rounded-lg"
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
    ></div>
  );
}

export default BackgroundImage;
