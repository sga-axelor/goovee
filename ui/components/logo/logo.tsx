import Image from 'next/image';

export function Logo({height = 50, ...rest}: any) {
  return (
    <Image
      alt="Company Logo"
      src="/images/logo.png"
      height={height}
      {...rest}
    />
  );
}

export default Logo;
