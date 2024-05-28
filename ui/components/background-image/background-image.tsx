"use client";

export type BackgroundImageProps = {
  src?: string;
  defaultSrc?: string;
  height?: string | number;
  width?: string | number;
  style?: React.CSSProperties;
  className?:string;
}

export function BackgroundImage({
  src,
  style,
  height,
  width,
  defaultSrc = "/images/no-image.png",
  className,
  ...rest
}: BackgroundImageProps) {
  const url = src || defaultSrc;
  return (
    <div
      className={`${className}  bg-no-repeat bg-center`}
      style={{
        height,
        width,
        backgroundImage: `url(${url})`,
        ...style,
        
      }}
      {...rest}
    ></div>
  );
}

export default BackgroundImage;
