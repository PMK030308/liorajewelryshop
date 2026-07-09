import React from 'react';

interface Props {
  size?: number;
  className?: string;
  /** Khoảng trắng đệm quanh logo (cho nền sáng). */
  padded?: boolean;
}

/**
 * Logo Ví MoMo chính thức (lấy từ CDN MoMo momocdn.net, lưu local tại /public/icons/momo-logo.svg).
 * Rounded magenta #A50064 + wordmark "MoMo" trắng.
 */
export default function MoMoIcon({ size = 24, className = '', padded = false }: Props) {
  return (
    <img
      src="/icons/momo-logo.svg"
      alt="Ví MoMo"
      width={size}
      height={size}
      className={`inline-block object-contain ${padded ? 'p-0.5' : ''} ${className}`}
      style={{ borderRadius: Math.round(size * 0.18) }}
    />
  );
}