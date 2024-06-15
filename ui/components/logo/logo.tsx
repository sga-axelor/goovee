import Image from 'next/image';

export function Logo({height = 50, width = 100, ...rest}: any) {
  return (
    <Image
      alt="Company Logo"
      src="/images/logo.png"
      height={height}
      width={width}
      style={{width: 'auto', height: 'auto'}}
      {...rest}
    />
  );
}

export default Logo;
