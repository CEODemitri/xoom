import React from 'react';
import { motion } from 'framer-motion';

interface ChipProps {
  label: string;
  selected?: boolean;
  onClick: () => void;
  font?: 'sans' | 'mono';
  variant?: 'progress' | 'complete' | 'neutral';
  className?: string;
  isReducedMotion?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onClick,
  font = 'sans',
  variant = 'progress',
  className = '',
  isReducedMotion = false,
}) => {
  const fontClass = font === 'mono' ? 'font-mono text-sm' : 'font-sans text-xs font-medium';

  let selectedStyle = 'border-[#09090B] text-[#09090B] bg-white font-semibold';
  if (variant === 'progress') {
    selectedStyle = 'border-[#DC2626] text-[#DC2626] bg-white font-semibold';
  } else if (variant === 'complete') {
    selectedStyle = 'border-[#2563EB] text-[#2563EB] bg-white font-semibold';
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={!isReducedMotion ? { scale: 0.96 } : undefined}
      className={`inline-flex items-center justify-center rounded-full px-3.5 py-2 border transition-colors select-none focus-visible:outline-2 focus-visible:outline-[#09090B] focus-visible:outline-offset-2 whitespace-nowrap shrink-0 ${fontClass} ${
        selected
          ? selectedStyle
          : 'border-[#E4E4E7] text-[#27272A] bg-white hover:border-[#71717A]'
      } ${className}`}
    >
      {label}
    </motion.button>
  );
};
