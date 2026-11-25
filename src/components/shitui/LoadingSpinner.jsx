import React from 'react';
import { cn } from '../../lib/utils';

export default function LoadingSpinner({
  className,
  text = 'Loading...',
  size = 'md',
  showText = true,
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-7 w-7',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={cn('inline-flex items-center gap-2.5 select-none', className)}>
      <div className={cn('relative flex items-center justify-center shrink-0', sizeClasses[size])}>
        {/* Static Background Track Circle */}
        <svg
          viewBox="0 0 18 18"
          className="absolute inset-0 h-full w-full text-neutral-200 dark:text-neutral-800"
          aria-hidden="true"
        >
          <circle
            cx="9"
            cy="9"
            r="7.25"
            fill="none"
            strokeWidth="2"
            stroke="currentColor"
            className="opacity-75 dark:opacity-60"
          />
        </svg>

        {/* Dynamic Rotating Arc Container */}
        <div className="loading-spinner-rotator absolute inset-0 h-full w-full">
          {/* Subtle Ambient Glow Behind Head */}
          <svg
            viewBox="0 0 18 18"
            className="absolute inset-0 h-full w-full text-black opacity-35 blur-[2px] dark:text-white"
            aria-hidden="true"
          >
            <circle
              cx="9"
              cy="9"
              r="7.25"
              fill="none"
              strokeWidth="2.5"
              stroke="currentColor"
              strokeLinecap="round"
              className="loading-spinner-arc"
            />
          </svg>

          {/* Crisp Main Stroke Segment */}
          <svg
            viewBox="0 0 18 18"
            className="absolute inset-0 h-full w-full text-neutral-900 dark:text-neutral-100"
            aria-hidden="true"
          >
            <circle
              cx="9"
              cy="9"
              r="7.25"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              strokeLinecap="round"
              className="loading-spinner-arc"
            />
          </svg>
        </div>

        {/* 100% Self-Contained Styles: No globals.css modifications needed */}
        <style>{`
          .loading-spinner-rotator {
            animation: loading-spinner-spin 1.8s linear infinite;
            transform-origin: center;
          }

          .loading-spinner-arc {
            animation: loading-spinner-dash 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            transform-origin: center;
          }

          @keyframes loading-spinner-spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          @keyframes loading-spinner-dash {
            0% {
              stroke-dasharray: 2 45.5;
              stroke-dashoffset: 0;
            }
            28% {
              stroke-dasharray: 28 45.5;
              stroke-dashoffset: -4;
            }
            50% {
              stroke-dasharray: 10 45.5;
              stroke-dashoffset: -18;
            }
            72% {
              stroke-dasharray: 34 45.5;
              stroke-dashoffset: -25;
            }
            100% {
              stroke-dasharray: 2 45.5;
              stroke-dashoffset: -45.5;
            }
          }

          .loading-spinner-text {
            --shimmer-base: #a1a1aa;
            --shimmer-wave: #09090b;
            background-image: linear-gradient(
              90deg,
              var(--shimmer-base) 0%,
              var(--shimmer-base) 20%,
              var(--shimmer-wave) 50%,
              var(--shimmer-base) 80%,
              var(--shimmer-base) 100%
            );
            background-size: 200% 100%;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            color: transparent;
            display: inline-block;
            animation: loading-text-shimmer 2.2s linear infinite;
          }

          :is(.dark, [data-theme='dark']) .loading-spinner-text {
            --shimmer-base: #71717a;
            --shimmer-wave: #ffffff;
          }

          @keyframes loading-text-shimmer {
            0% {
              background-position: 100% 0;
            }
            100% {
              background-position: -100% 0;
            }
          }
        `}</style>
      </div>

      {/* Shimmering Text Wave: Only text glyphs, zero background */}
      {showText && text && (
        <span
          className={cn(
            'loading-spinner-text font-sans font-medium tracking-normal select-none',
            textSizeClasses[size]
          )}
        >
          {text}
        </span>
      )}
    </div>
  );
}
