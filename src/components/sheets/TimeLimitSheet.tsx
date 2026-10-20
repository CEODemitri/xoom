import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COPY } from '../../constants/content';
import { Button } from '../primitives/Buttons';
import { useStore } from '../../store/useStore';

interface TimeLimitSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (durationSec: number) => void;
}

export const TimeLimitSheet: React.FC<TimeLimitSheetProps> = ({
  isOpen,
  onClose,
  onStart,
}) => {
  const { settings } = useStore();
  const [selectedSec, setSelectedSec] = useState<number>(15 * 60);
  const [customMinutes, setCustomMinutes] = useState<string>('');

  const handlePresetSelect = (sec: number) => {
    setSelectedSec(sec);
    setCustomMinutes('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomMinutes(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0) {
      setSelectedSec(num * 60);
    } else {
      setSelectedSec(0);
    }
  };

  const handleStart = () => {
    onStart(selectedSec);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            onClick={onClose}
            className="fixed inset-0 bg-[#09090B]"
            aria-hidden="true"
          />

          {/* Sheet Container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="sheet-title"
            initial={settings.reduceMotion ? { opacity: 0 } : { y: '100%' }}
            animate={settings.reduceMotion ? { opacity: 1 } : { y: 0 }}
            exit={settings.reduceMotion ? { opacity: 0 } : { y: '100%' }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            style={{
              boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
            }}
            className="relative w-full max-w-[720px] bg-[#FFFFFF] border-t border-x border-[#E4E4E7] rounded-t-xl p-6 md:p-8 z-10"
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                id="sheet-title"
                className="font-serif font-semibold text-xl md:text-2xl text-[#09090B]"
              >
                {COPY.timeSheet.title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="font-sans text-xs uppercase tracking-wider text-[#71717A] hover:text-[#09090B] p-2 min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-[#09090B]"
              >
                {COPY.timeSheet.cancel}
              </button>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-2.5 mb-6">
              {COPY.timeSheet.presets.map((preset) => {
                const isSelected = selectedSec === preset.sec && !customMinutes;
                return (
                  <button
                    key={preset.sec}
                    type="button"
                    onClick={() => handlePresetSelect(preset.sec)}
                    className={`font-mono text-sm px-4 py-2.5 rounded-full border transition-colors select-none min-h-[44px] focus-visible:outline-2 focus-visible:outline-[#09090B] ${
                      isSelected
                        ? 'border-[#DC2626] text-[#DC2626] bg-[#FFFFFF] font-medium'
                        : 'border-[#E4E4E7] text-[#27272A] bg-[#FFFFFF] hover:border-[#71717A]'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Custom duration */}
            <div className="flex items-center gap-3 mb-8">
              <span className="font-sans text-xs uppercase tracking-wider text-[#71717A]">
                {COPY.timeSheet.customLabel}
              </span>
              <div className="inline-flex items-center bg-[#F4F4F5] border border-[#E4E4E7] px-3 py-2">
                <input
                  type="text"
                  inputMode="numeric"
                  value={customMinutes}
                  onChange={handleCustomChange}
                  placeholder="25"
                  aria-label="Custom duration in minutes"
                  className="w-12 bg-transparent font-mono text-base text-[#09090B] text-right focus:outline-none"
                />
                <span className="font-mono text-sm text-[#71717A] ml-1.5">
                  {COPY.timeSheet.minSuffix}
                </span>
              </div>
            </div>

            {/* Primary Action Button */}
            <Button
              variant="primary"
              onClick={handleStart}
              className="w-full"
            >
              {COPY.timeSheet.start}
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
