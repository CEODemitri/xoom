import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { COPY } from '../constants/content';
import { useStore } from '../store/useStore';
import { Button } from '../components/primitives/Buttons';

type BreathPhase = 'Inhale' | 'Hold' | 'Exhale' | 'Hold ';

const PHASES: BreathPhase[] = ['Inhale', 'Hold', 'Exhale', 'Hold '];
const DURATION_PRESETS = [
  { label: '1 min', sec: 60 },
  { label: '3 min', sec: 180 },
  { label: '5 min', sec: 300 },
  { label: 'Open', sec: 0 },
];

export const MindBreathe: React.FC = () => {
  const navigate = useNavigate();
  const { addMindLog, settings } = useStore();

  const [selectedDurationSec, setSelectedDurationSec] = useState<number>(180);
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [phaseIndex, setPhaseIndex] = useState<number>(0);
  const [phaseCount, setPhaseCount] = useState<number>(4);
  const [isFinishedPromptOpen, setIsFinishedPromptOpen] = useState(false);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setElapsedSec((prev) => prev + 1);

      setPhaseCount((prevCount) => {
        if (prevCount <= 1) {
          setPhaseIndex((prevIdx) => (prevIdx + 1) % 4);
          return 4;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (selectedDurationSec > 0 && elapsedSec >= selectedDurationSec) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsFinishedPromptOpen(true);
    }
  }, [elapsedSec, selectedDurationSec]);

  const currentPhase = PHASES[phaseIndex];

  let circleScale = 0.6;
  if (phaseIndex === 0) {
    circleScale = 0.6 + ((4 - phaseCount + 1) / 4) * 0.4;
  } else if (phaseIndex === 1) {
    circleScale = 1.0;
  } else if (phaseIndex === 2) {
    circleScale = 1.0 - ((4 - phaseCount + 1) / 4) * 0.4;
  } else {
    circleScale = 0.6;
  }

  const handleEnd = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsFinishedPromptOpen(true);
  };

  const handleLog = () => {
    addMindLog({
      date: new Date().toISOString(),
      type: 'breathe',
      durationSec: elapsedSec,
      mood: null,
      note: null,
    });
    navigate('/mind', { replace: true });
  };

  const handleNotNow = () => {
    navigate('/mind', { replace: true });
  };

  return (
    <div className="min-h-screen -mt-2 -mx-4 sm:-mx-5 px-4 sm:px-5 py-6 flex flex-col justify-between bg-[#FAFAFA] select-none">
      {/* Top action: Status + END button */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse" aria-hidden="true" />
          <span className="font-sans text-[11px] uppercase tracking-wider text-[#71717A] font-medium">
            Reset In Progress
          </span>
        </div>

        <button
          type="button"
          onClick={handleEnd}
          className="font-sans font-semibold text-xs uppercase tracking-wider text-[#DC2626] hover:text-[#B91C1C] p-2 min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-[#09090B]"
        >
          {COPY.active.end}
        </button>
      </div>

      {/* Main Center Area: Expanding Circle & Phase Label */}
      <div className="flex flex-col items-center justify-center my-auto">
        <div className="relative w-64 h-64 flex items-center justify-center">
          <motion.svg
            width="220"
            height="220"
            viewBox="0 0 220 220"
            fill="none"
            animate={
              settings.reduceMotion
                ? { scale: 0.8 }
                : { scale: circleScale }
            }
            transition={{
              duration: settings.reduceMotion ? 0 : 0.9,
              ease: 'linear',
            }}
          >
            <circle
              cx="110"
              cy="110"
              r="100"
              stroke="#09090B"
              strokeWidth="1.5"
              fill="none"
            />
          </motion.svg>

          {/* Phase Count display in center */}
          <div className="absolute flex flex-col items-center">
            <span className="font-mono text-3xl font-medium text-[#09090B] tabular-nums">
              {phaseCount}
            </span>
          </div>
        </div>

        {/* Phase Label */}
        <p className="font-sans font-semibold text-xs uppercase tracking-[0.16em] text-[#71717A] mt-6">
          {currentPhase.trim()}
        </p>
      </div>

      {/* Bottom Duration Chips */}
      <div className="flex items-center justify-center gap-2 pb-8 flex-wrap">
        {DURATION_PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => setSelectedDurationSec(preset.sec)}
            className={`font-mono text-xs px-3.5 py-2 rounded-full border transition-colors select-none min-h-[40px] focus-visible:outline-2 focus-visible:outline-[#09090B] ${
              selectedDurationSec === preset.sec
                ? 'border-[#09090B] text-[#09090B] bg-white font-medium'
                : 'border-[#E4E4E7] text-[#27272A] bg-white hover:border-[#71717A]'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Optional Log Prompt Modal */}
      <AnimatePresence>
        {isFinishedPromptOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-[#09090B]/30">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
              className="w-full max-w-sm bg-[#FFFFFF] border border-[#E4E4E7] rounded-xl p-6 text-center space-y-6"
            >
              <div className="w-8 h-8 rounded-full bg-[#2563EB]/10 text-[#2563EB] mx-auto flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
              </div>
              <h2 className="font-serif font-semibold text-xl text-[#09090B]">
                {COPY.mind.logPrompt}
              </h2>
              <div className="flex flex-col space-y-3">
                <Button variant="primary" onClick={handleLog} className="w-full">
                  {COPY.mind.logAction}
                </Button>
                <button
                  type="button"
                  onClick={handleNotNow}
                  className="font-sans text-xs uppercase tracking-wider text-[#71717A] hover:text-[#09090B] p-2"
                >
                  {COPY.mind.notNow}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
