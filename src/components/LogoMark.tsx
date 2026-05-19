import React from 'react';

interface Props {
  /** Logo height in px (image scales to fit). */
  size?: number;
  /** Show LIORA wordmark next to the image. */
  withText?: boolean;
  /** Text color (only matters when withText is true). */
  textColor?: string;
  /** Tailwind class on outer link/div. */
  className?: string;
  /** Tailwind class on the text span (for sizing/spacing). */
  textClassName?: string;
  /** When provided, renders as <a> with href + onClick. */
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  alt?: string;
}

export default function LogoMark({
  size = 40,
  withText = false,
  textColor,
  className = '',
  textClassName = '',
  href,
  onClick,
  alt = 'LIORA',
}: Props) {
  const Inner = (
    <>
      <img
        src="/logoliora.png"
        alt={alt}
        width={size}
        height={size}
        decoding="async"
        className="object-contain"
        style={{ height: size, width: 'auto' }}
      />
      {withText && (
        <span
          className={`font-bold tracking-[0.22em] ${textClassName || 'text-2xl md:text-3xl'}`}
          style={textColor ? { color: textColor } : undefined}
        >
          LIORA
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} onClick={onClick} className={`flex items-center gap-2.5 ${className}`}>
        {Inner}
      </a>
    );
  }
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>{Inner}</div>
  );
}
