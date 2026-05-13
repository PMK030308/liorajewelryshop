import React from 'react';
import { ShapeKey } from '../types';

const Shapes: Record<ShapeKey, React.ReactElement> = {
  bow: (
    <svg viewBox="0 0 100 100">
      <path d="M50 50 L20 30 Q15 32 15 50 Q15 68 20 70 Z M50 50 L80 30 Q85 32 85 50 Q85 68 80 70 Z M44 50 Q44 42 50 42 Q56 42 56 50 Q56 58 50 58 Q44 58 44 50 Z" fill="currentColor"/>
      <circle cx="50" cy="50" r="2.5" fill="white"/>
    </svg>
  ),
  flower: (
    <svg viewBox="0 0 100 100">
      <g fill="currentColor">
        <ellipse cx="50" cy="30" rx="10" ry="14"/>
        <ellipse cx="50" cy="70" rx="10" ry="14"/>
        <ellipse cx="30" cy="50" rx="14" ry="10"/>
        <ellipse cx="70" cy="50" rx="14" ry="10"/>
        <circle cx="50" cy="50" r="6" fill="white"/>
        <circle cx="50" cy="50" r="3" fill="currentColor"/>
      </g>
    </svg>
  ),
  snow: (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <path d="M50 10v80M14 30l72 40M14 70l72-40"/>
      <path d="M50 10l-6 8M50 10l6 8M50 90l-6-8M50 90l6-8M14 30l3 9M14 30l9 3M86 70l-3-9M86 70l-9-3M14 70l3-9M14 70l9-3M86 30l-3 9M86 30l-9 3"/>
    </svg>
  ),
  gem: (
    <svg viewBox="0 0 100 100">
      <path d="M30 35 L50 20 L70 35 L60 75 L40 75 Z" fill="currentColor" opacity="0.85"/>
      <path d="M30 35 L50 50 L70 35" stroke="white" strokeWidth="1.5" fill="none"/>
      <path d="M50 50 L40 75 M50 50 L60 75" stroke="white" strokeWidth="1.5"/>
    </svg>
  ),
  star: (
    <svg viewBox="0 0 100 100">
      <path d="M50 15 L58 40 L84 40 L63 55 L71 80 L50 65 L29 80 L37 55 L16 40 L42 40 Z" fill="currentColor"/>
    </svg>
  ),
  bracelet: (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
      <ellipse cx="50" cy="50" rx="36" ry="28"/>
      <circle cx="50" cy="22" r="6" fill="currentColor"/>
      <circle cx="78" cy="50" r="3" fill="currentColor"/>
      <circle cx="22" cy="50" r="3" fill="currentColor"/>
    </svg>
  ),
  ring: (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4">
      <circle cx="50" cy="60" r="26"/>
      <path d="M40 36 L50 22 L60 36 Z" fill="currentColor"/>
    </svg>
  ),
  butterfly: (
    <svg viewBox="0 0 100 100">
      <g fill="currentColor">
        <path d="M50 50 Q30 25 18 35 Q12 45 22 58 Q35 65 50 50Z"/>
        <path d="M50 50 Q70 25 82 35 Q88 45 78 58 Q65 65 50 50Z"/>
        <path d="M50 50 Q35 55 30 75 Q40 82 50 75Z"/>
        <path d="M50 50 Q65 55 70 75 Q60 82 50 75Z"/>
        <rect x="48" y="35" width="4" height="40" rx="2"/>
      </g>
    </svg>
  ),
  clover: (
    <svg viewBox="0 0 100 100" fill="currentColor">
      <circle cx="50" cy="30" r="13"/>
      <circle cx="70" cy="50" r="13"/>
      <circle cx="50" cy="70" r="13"/>
      <circle cx="30" cy="50" r="13"/>
      <circle cx="50" cy="50" r="6" fill="white"/>
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 100 100">
      <path d="M50 80 C 20 60, 15 35, 35 25 C 45 25, 50 35, 50 40 C 50 35, 55 25, 65 25 C 85 35, 80 60, 50 80 Z" fill="currentColor"/>
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 100 100">
      <path d="M50 15 L55 45 L85 50 L55 55 L50 85 L45 55 L15 50 L45 45 Z" fill="currentColor"/>
    </svg>
  ),
};

export default Shapes;
