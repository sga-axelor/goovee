
export function Logo({ height = 50, ...rest }: any) {
  return (
    <img
      alt="Company Logo"
      src="/images/logo.png"
      height={height}
      {...rest}
    />
  );
}

export default Logo;
