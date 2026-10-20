import React from 'react';
import { motion } from 'framer-motion';
import { BRAND_NAME } from '../../constants/content';

interface IconProps {
  className?: string;
  size?: number;
  'aria-label'?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
  role?: string;
}

/**
 * Xoom Brand Logo Mark + Wordmark
 * Baseline stroke with offset dash that springs on hover/tap
 */
export const LogoLockup: React.FC<{
  className?: string;
  isReducedMotion?: boolean;
}> = ({ className = '', isReducedMotion = false }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className={`inline-flex items-center gap-2 select-none cursor-pointer ${className}`}
      onMouseEnter={() => !isReducedMotion && setIsHovered(true)}
      onMouseLeave={() => !isReducedMotion && setIsHovered(false)}
      role="img"
      aria-label={`${BRAND_NAME} logo`}
    >
      <svg
        width="28"
        height="22"
        viewBox="0 0 28 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        {/* Animated offset dash: caught mid-motion, held still */}
        <motion.line
          x1="14"
          y1="6"
          x2="22"
          y2="6"
          stroke="#1B1916"
          strokeWidth="2.2"
          strokeLinecap="round"
          animate={
            isHovered && !isReducedMotion
              ? { x: 3, y: -1 }
              : { x: 0, y: 0 }
          }
          transition={{ type: 'spring', stiffness: 260, damping: 16 }}
        />
        {/* Horizontal baseline stroke */}
        <line
          x1="4"
          y1="16"
          x2="24"
          y2="16"
          stroke="#1B1916"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
      <span className="font-serif font-semibold text-xl tracking-[-0.02em] text-[#1B1916] leading-none pt-0.5">
        {BRAND_NAME}
      </span>
    </div>
  );
};

/**
 * Train tab mark: horizontal line with a short vertical tick
 */
export const SessionMark: React.FC<IconProps> = ({
  className = '',
  size = 20,
  ...rest
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...rest}
  >
    <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    <line x1="12" y1="6" x2="12" y2="10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

/**
 * You tab mark: minimalist person mark
 */
export const PersonMark: React.FC<IconProps> = ({
  className = '',
  size = 20,
  ...rest
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...rest}
  >
    <circle cx="10" cy="6.5" r="3" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M4.5 16.5C4.5 13.5 7 12 10 12C13 12 15.5 13.5 15.5 16.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Mind tab mark: small circle with one inner arc (breath mark)
 */
export const BreathMark: React.FC<IconProps> = ({
  className = '',
  size = 20,
  ...rest
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...rest}
  >
    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M7 11.5C8 13 12 13 13 11.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Eat tab mark: clean bowl mark
 */
export const BowlMark: React.FC<IconProps> = ({
  className = '',
  size = 20,
  ...rest
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...rest}
  >
    <path
      d="M3.5 8H16.5C16.5 13 13.5 15.5 10 15.5C6.5 15.5 3.5 13 3.5 8Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <line x1="8" y1="15.5" x2="12" y2="15.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

/**
 * Chevrons for navigation and rows
 */
export const ChevronLeft: React.FC<IconProps> = ({
  className = '',
  size = 18,
  ...rest
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...rest}
  >
    <path
      d="M12.5 15L7.5 10L12.5 5"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChevronRight: React.FC<IconProps> = ({
  className = '',
  size = 18,
  ...rest
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...rest}
  >
    <path
      d="M7.5 5L12.5 10L7.5 15"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Close mark for sheet dismissal
 */
export const CloseMark: React.FC<IconProps> = ({
  className = '',
  size = 20,
  ...rest
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...rest}
  >
    <line x1="5" y1="5" x2="15" y2="15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    <line x1="15" y1="5" x2="5" y2="15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

/**
 * Check mark
 */
export const CheckMark: React.FC<IconProps> = ({
  className = '',
  size = 16,
  ...rest
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...rest}
  >
    <path
      d="M4.5 10.5L8.5 14.5L15.5 6.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
