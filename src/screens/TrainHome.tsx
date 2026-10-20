import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { COPY, GREETINGS } from '../constants/content';
import { useStore } from '../store/useStore';
import { TimeLimitSheet } from '../components/sheets/TimeLimitSheet';
import { ChevronRight } from '../components/icons';
import { format } from 'date-fns';

export const TrainHome: React.FC = () => {
  const navigate = useNavigate();
  const { sessionLogs, workouts, startActiveSession, settings } = useStore();
  const [isTimeSheetOpen, setIsTimeSheetOpen] = useState(false);

  // Dynamic greeting based on current local hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return GREETINGS.morning;
    if (hour < 17) return GREETINGS.afternoon;
    return GREETINGS.evening;
  };

  const handleStartJustTimer = (durationSec: number) => {
    setIsTimeSheetOpen(false);
    startActiveSession('timer', [], durationSec);
    navigate('/train/active');
  };

  const recentLogs = sessionLogs.slice(0, 3);

  const getWorkoutNames = (workoutIds: string[]) => {
    if (!workoutIds || workoutIds.length === 0) return COPY.you.timerDefaultName;
    const names = workoutIds
      .map((id) => workouts.find((w) => w.id === id)?.name)
      .filter(Boolean);
    return names.slice(0, 2).join(', ');
  };

  const formatDuration = (sec: number) => {
    const mins = Math.round(sec / 60);
    return `${mins}m`;
  };

  return (
    <div className="flex flex-col space-y-8">
      {/* Greeting */}
      <div>
        <p className="font-serif font-medium text-base text-[#71717A]">
          {getGreeting()}
        </p>
        <h1 className="font-serif font-semibold text-3xl md:text-4xl text-[#09090B] mt-1 tracking-[-0.02em] leading-tight">
          {COPY.train.title}
        </h1>
      </div>

      {/* Primary & Secondary Choices */}
      <div className="flex flex-col space-y-4">
        {/* Build a session */}
        <motion.button
          type="button"
          onClick={() => navigate('/train/build')}
          whileTap={!settings.reduceMotion ? { scale: 0.985 } : undefined}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="w-full text-left bg-[#FFFFFF] border border-[#E4E4E7] p-6 rounded-xl focus-visible:outline-2 focus-visible:outline-[#09090B] transition-colors hover:border-[#71717A]/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-semibold text-xl text-[#09090B]">
              {COPY.train.buildSession}
            </h2>
            {/* Subtle red indicator for builder / in-progress workout action */}
            <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" aria-hidden="true" />
          </div>
          <p className="font-sans text-sm text-[#71717A] mt-1.5 leading-relaxed">
            {COPY.train.buildDesc}
          </p>
        </motion.button>

        {/* Just a timer */}
        <motion.button
          type="button"
          onClick={() => setIsTimeSheetOpen(true)}
          whileTap={!settings.reduceMotion ? { scale: 0.985 } : undefined}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="w-full text-left bg-transparent border border-[#09090B] p-6 rounded-xl focus-visible:outline-2 focus-visible:outline-[#09090B] transition-colors hover:bg-[#F4F4F5]"
        >
          <h2 className="font-serif font-semibold text-xl text-[#09090B]">
            {COPY.train.justTimer}
          </h2>
          <p className="font-sans text-sm text-[#71717A] mt-1.5 leading-relaxed">
            {COPY.train.justTimerDesc}
          </p>
        </motion.button>
      </div>

      {/* Recent sessions */}
      {recentLogs.length > 0 && (
        <section className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif font-semibold text-lg text-[#09090B]">
              {COPY.train.recentTitle}
            </h2>
            <span className="font-sans text-[11px] uppercase tracking-wider text-[#2563EB] font-medium">
              Completed
            </span>
          </div>
          <div className="border-t border-[#E4E4E7]">
            {recentLogs.map((log) => {
              const dateObj = new Date(log.date);
              const formattedDate = format(dateObj, 'MMM d');
              return (
                <button
                  key={log.id}
                  type="button"
                  onClick={() => navigate(`/you/log/${log.id}`)}
                  className="w-full flex items-center justify-between py-4 border-b border-[#E4E4E7] text-left hover:bg-[#F4F4F5]/60 transition-colors px-1 select-none focus-visible:outline-2 focus-visible:outline-[#09090B]"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0" aria-hidden="true" />
                    <span className="font-sans text-xs uppercase tracking-wider text-[#71717A]">
                      {formattedDate}
                    </span>
                    <span className="font-sans text-sm text-[#18181B] font-medium">
                      {getWorkoutNames(log.workoutIds)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-[#09090B] tabular-nums">
                      {formatDuration(log.durationSec)}
                    </span>
                    <ChevronRight size={16} className="text-[#71717A]" aria-hidden="true" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Time Limit Bottom Sheet */}
      <TimeLimitSheet
        isOpen={isTimeSheetOpen}
        onClose={() => setIsTimeSheetOpen(false)}
        onStart={handleStartJustTimer}
      />
    </div>
  );
};
