'use client';

import * as React from 'react';
import {getImageProps, type ImageProps} from 'next/image';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

import {cn} from '@/utils/css';

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({className, ...props}, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
      className,
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

type AvatarImageProps = Omit<
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>,
  'src'
> &
  Pick<ImageProps, 'quality' | 'loader'> & {
    src?: string;
    alt?: string;
    size: number;
  };

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  AvatarImageProps
>(({className, src, alt = '', size, quality, loader, ...props}, ref) => {
  if (!src) return null;
  // Oversample to stay sharp on 2x/3x DPR displays; the actual rendered size is still `size` CSS pixels.
  const oversampled = size * 2;
  const {props: img} = getImageProps({
    src,
    alt,
    width: oversampled,
    height: oversampled,
    quality,
    loader,
  });
  return (
    <AvatarPrimitive.Image
      ref={ref}
      src={img.src}
      srcSet={img.srcSet}
      alt={alt}
      className={cn('aspect-square h-full w-full object-cover', className)}
      {...props}
    />
  );
});
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({className, ...props}, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted',
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export {Avatar, AvatarImage, AvatarFallback};
