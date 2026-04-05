import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DBlogLoader } from './DBlogLoader';

interface ProgressiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string;
  placeholderClassName?: string;
}

const mergeClassName = (...values: Array<string | undefined | false>) => values.filter(Boolean).join(' ');

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  wrapperClassName,
  placeholderClassName,
  className,
  onLoad,
  onError,
  decoding = 'async',
  src,
  alt,
  ...props
}) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const syncImageState = useCallback(() => {
    const image = imgRef.current;
    if (!image || !src) {
      return;
    }

    if (image.complete) {
      if (image.naturalWidth > 0) {
        setIsLoaded(true);
        setHasError(false);
      } else {
        setIsLoaded(false);
        setHasError(true);
      }
    }
  }, [src]);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    syncImageState();
  }, [src, syncImageState]);

  return (
    <div className={mergeClassName('relative overflow-hidden', wrapperClassName)}>
      <div
        aria-hidden="true"
        className={mergeClassName(
          'pointer-events-none absolute inset-0 bg-zinc-200/80 transition-opacity duration-500 dark:bg-zinc-800/80',
          isLoaded || hasError ? 'opacity-0' : 'opacity-100',
          placeholderClassName
        )}
      />
      <div
        aria-hidden="true"
        className={mergeClassName(
          'pointer-events-none absolute inset-0 flex items-center justify-center bg-zinc-100/70 transition-opacity duration-500 dark:bg-zinc-900/60',
          isLoaded || hasError ? 'opacity-0' : 'opacity-100'
        )}
      >
        <DBlogLoader
          size="image"
          label={alt ? `${alt} 加载中` : '图片加载中'}
          className="relative z-[1] opacity-80"
        />
      </div>
      {hasError ? (
        <div className="relative flex min-h-[6rem] items-center justify-center rounded-inherit bg-zinc-100/90 px-4 py-6 text-center text-sm text-zinc-500 dark:bg-zinc-900/80 dark:text-zinc-400">
          图片加载失败{alt ? `：${alt}` : ''}
        </div>
      ) : (
        <img
          {...props}
          ref={imgRef}
          src={src}
          alt={alt}
          decoding={decoding}
          className={mergeClassName(
            'relative transition-all duration-700 ease-out will-change-transform',
            isLoaded ? 'scale-100 blur-0 opacity-100' : 'scale-[1.03] blur-xl opacity-0',
            className
          )}
          onLoad={(event) => {
            setIsLoaded(true);
            setHasError(false);
            onLoad?.(event);
          }}
          onError={(event) => {
            setHasError(true);
            onError?.(event);
          }}
        />
      )}
    </div>
  );
};

