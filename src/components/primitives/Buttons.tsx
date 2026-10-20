import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'progress-text' | 'complete-text';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  disabled = false,
  className = '',
  ...props
}) => {
  const base =
    'relative inline-flex items-center justify-center font-sans font-semibold text-[0.8125rem] tracking-[0.08em] uppercase transition-colors select-none focus-visible:outline-2 focus-visible:outline-[#09090B] focus-visible:outline-offset-2 min-h-[44px] px-6 py-3';

  let variantClass = '';

  if (variant === 'primary') {
    variantClass = disabled
      ? 'bg-[#E4E4E7] text-[#71717A] cursor-not-allowed'
      : 'bg-[#09090B] text-[#FFFFFF] hover:bg-[#27272A] active:bg-[#09090B]';
  } else if (variant === 'secondary') {
    variantClass = disabled
      ? 'bg-transparent border border-[#E4E4E7] text-[#71717A] cursor-not-allowed'
      : 'bg-transparent border border-[#09090B] text-[#09090B] hover:bg-[#F4F4F5] active:bg-[#E4E4E7]';
  } else if (variant === 'progress-text') {
    variantClass = disabled
      ? 'bg-transparent text-[#71717A] cursor-not-allowed'
      : 'bg-transparent text-[#DC2626] hover:text-[#B91C1C] p-0 min-h-[36px]';
  } else if (variant === 'complete-text') {
    variantClass = disabled
      ? 'bg-transparent text-[#71717A] cursor-not-allowed'
      : 'bg-transparent text-[#2563EB] hover:text-[#1D4ED8] p-0 min-h-[36px]';
  } else {
    // ghost
    variantClass = disabled
      ? 'bg-transparent text-[#71717A] cursor-not-allowed'
      : 'bg-transparent text-[#27272A] hover:text-[#09090B]';
  }

  return (
    <motion.button
      whileTap={!disabled ? { scale: 0.985 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      disabled={disabled}
      className={`${base} ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
