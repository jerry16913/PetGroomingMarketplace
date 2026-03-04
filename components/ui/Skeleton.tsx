import React from 'react';

type SkeletonVariant = 'text' | 'circle' | 'rect';

interface SkeletonProps {
  className?: string;
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({
  className = '',
  variant = 'rect',
  width,
  height,
}: SkeletonProps) {
  const variantClasses: Record<SkeletonVariant, string> = {
    text: 'rounded h-4',
    circle: 'rounded-full',
    rect: 'rounded-lg',
  };

  const style: React.CSSProperties = {
    width: width ?? (variant === 'circle' ? 40 : '100%'),
    height:
      height ??
      (variant === 'circle' ? 40 : variant === 'text' ? 16 : 100),
  };

  return (
    <div
      className={`animate-pulse bg-gray-200 ${variantClasses[variant]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}
