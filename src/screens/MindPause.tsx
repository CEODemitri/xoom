import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { COPY } from '../constants/content';
import { useStore } from '../store/useStore';
import { Button } from '../components/primitives/Buttons';

export const MindPause: React.FC = () => {
  const navigate = useNavigate();
  const { addMindLog, settings } = useStore();

  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [colonVisible, setColonVisible] = useState(true);
  const [isPromptOpen, setIsPromptOpen] = useState(false);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setElapsedSec((prev) => prev + 1);
      if (!settings.reduceMotion) {
        setColonVisible((prev) => !prev);
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [settings.reduceMotion]);

  const mm = String(Math.floor(elapsedSec / 60)).padStart(2, '0');
  const ss = String(elapsedSec % 60).padStart(2, '0');

  const handleEnd = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPromptOpen(true);
  };

  const handleLog = () => {
    addMindLog({
      date: new Date().toISOString(),
      type: 'pause',
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
      {/* Top action: in progress indicator + END button */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse" aria-hidden="true" />
          <span className="font-sans text-[11px] uppercase tracking-wider text-[#71717A] font-medium">
            Pause In Progress
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

      {/* Main Center Area */}
      <div className="flex flex-col items-center justify-center my-auto text-center">
        <div className="font-mono font-medium text-[clamp(4.25rem,18vw,7.5rem)] tracking-[-0.02em] leading-none tabular-nums text-[#09090B]">
          <span>{mm}</span>
          <span
            className={`text-[#DC2626] ${
              settings.reduceMotion
                ? 'opacity-100'
                : colonVisible
                ? 'opacity-100'
                : 'opacity-20'
            }`}
          >
            :
          </span>
          <span>{ss}</span>
        </div>

        <p className="font-serif font-medium text-base text-[#71717A] mt-8">
          {COPY.mind.pauseHint}
        </p>
      </div>

      <div className="pb-8" />

      {/* Optional Log Prompt */}
      <AnimatePresence>
        {isPromptOpen && (
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
