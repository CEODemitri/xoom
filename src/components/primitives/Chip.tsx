import React from 'react';
import { motion } from 'framer-motion';

interface ChipProps {
  label: string;
  selected?: boolean;
  onClick: () => void;
  font?: 'sans' | 'mono';
  className?: string;
  isReducedMotion?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onClick,
  font = 'sans',
  className = '',
  isReducedMotion = false,
}) => {
  const fontClass = font === 'mono' ? 'font-mono text-sm' : 'font-sans text-xs font-medium';

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={!isReducedMotion ? { scale: 0.96 } : undefined}
      className={`inline-flex items-center justify-center rounded-full px-3.5 py-2 border transition-colors select-none focus-visible:outline-2 focus-visible:outline-[#B85A3C] focus-visible:outline-offset-2 whitespace-nowrap shrink-0 ${fontClass} ${
        selected
          ? 'border-[#B85A3C] text-[#B85A3C] bg-transparent'
          : 'border-[#DFD7C8] text-[#3B3732] bg-transparent hover:border-[#78716A]'
      } ${className}`}
    >
      {label}
    </motion.button>
  );
};
