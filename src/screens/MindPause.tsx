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
    <div className="min-h-screen -mt-6 -mx-5 px-5 py-6 flex flex-col justify-between bg-[#F4F0E8] select-none">
      {/* Top action: END button */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleEnd}
          className="font-sans font-semibold text-xs uppercase tracking-wider text-[#B85A3C] hover:text-[#98442A] p-2 min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-[#B85A3C]"
        >
          {COPY.active.end}
        </button>
      </div>

      {/* Main Center Area */}
      <div className="flex flex-col items-center justify-center my-auto text-center">
        <div className="font-mono font-medium text-[clamp(4.25rem,18vw,7.5rem)] tracking-[-0.02em] leading-none tabular-nums text-[#1B1916]">
          <span>{mm}</span>
          <span
            className={
              settings.reduceMotion
                ? 'opacity-100'
                : colonVisible
                ? 'opacity-100'
                : 'opacity-20'
            }
          >
            :
          </span>
          <span>{ss}</span>
        </div>

        <p className="font-serif font-medium text-base text-[#78716A] mt-8">
          {COPY.mind.pauseHint}
        </p>
      </div>

      <div className="pb-8" />

      {/* Optional Log Prompt */}
      <AnimatePresence>
        {isPromptOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-[#F4F0E8]/80">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              style={{ boxShadow: '0 8px 24px rgba(27,25,22,0.08)' }}
              className="w-full max-w-sm bg-[#ECE6DA] border border-[#DFD7C8] rounded-xl p-6 text-center space-y-6"
            >
              <h2 className="font-serif font-semibold text-xl text-[#1B1916]">
                {COPY.mind.logPrompt}
              </h2>
              <div className="flex flex-col space-y-3">
                <Button variant="primary" onClick={handleLog} className="w-full">
                  {COPY.mind.logAction}
                </Button>
                <button
                  type="button"
                  onClick={handleNotNow}
                  className="font-sans text-xs uppercase tracking-wider text-[#78716A] hover:text-[#1B1916] p-2"
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
