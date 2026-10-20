import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'clay-text';
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
    'relative inline-flex items-center justify-center font-sans font-semibold text-[0.8125rem] tracking-[0.08em] uppercase transition-colors select-none focus-visible:outline-2 focus-visible:outline-[#B85A3C] focus-visible:outline-offset-2 min-h-[44px] px-6 py-3';

  let variantClass = '';

  if (variant === 'primary') {
    variantClass = disabled
      ? 'bg-[#ECE6DA] text-[#78716A] cursor-not-allowed'
      : 'bg-[#1B1916] text-[#FFFFFF] hover:bg-[#3B3732] active:bg-[#1B1916]';
  } else if (variant === 'secondary') {
    variantClass = disabled
      ? 'bg-transparent border border-[#DFD7C8] text-[#78716A] cursor-not-allowed'
      : 'bg-transparent border border-[#1B1916] text-[#1B1916] hover:bg-[#ECE6DA] active:bg-[#DFD7C8]';
  } else if (variant === 'clay-text') {
    variantClass = disabled
      ? 'bg-transparent text-[#78716A] cursor-not-allowed'
      : 'bg-transparent text-[#B85A3C] hover:text-[#98442A] p-0 min-h-[36px]';
  } else {
    // ghost
    variantClass = disabled
      ? 'bg-transparent text-[#78716A] cursor-not-allowed'
      : 'bg-transparent text-[#3B3732] hover:text-[#1B1916]';
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
