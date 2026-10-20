import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { COPY } from '../constants/content';
import { useStore } from '../store/useStore';

export const ActiveSession: React.FC = () => {
  const navigate = useNavigate();
  const {
    activeSession,
    tickActiveSession,
    togglePauseActiveSession,
    nextWorkoutInActiveSession,
    endActiveSession,
    workouts,
    settings,
  } = useStore();

  const [colonVisible, setColonVisible] = useState(true);
  const [a11yAnnouncement, setA11yAnnouncement] = useState('Session started');
  const intervalRef = useRef<number | null>(null);

  // If no active session exists, redirect to /train
  useEffect(() => {
    if (!activeSession) {
      navigate('/train', { replace: true });
    }
  }, [activeSession, navigate]);

  // Interval timer for ticks and colon blink
  useEffect(() => {
    if (!activeSession || activeSession.isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      tickActiveSession();
      if (!settings.reduceMotion) {
        setColonVisible((prev) => !prev);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [activeSession?.isPaused, tickActiveSession, settings.reduceMotion]);

  if (!activeSession) return null;

  const currentWorkout =
    activeSession.workoutIds.length > 0
      ? workouts.find((w) => w.id === activeSession.workoutIds[activeSession.currentWorkoutIndex])
      : null;

  // Compute display time
  const isCountDown = settings.timerMode === 'down' && activeSession.targetDurationSec > 0;
  let displayTotalSec = activeSession.elapsedSec;
  if (isCountDown) {
    displayTotalSec = Math.max(0, activeSession.targetDurationSec - activeSession.elapsedSec);
  }

  const minutes = Math.floor(displayTotalSec / 60);
  const seconds = displayTotalSec % 60;
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  const handleTogglePause = () => {
    const nextState = !activeSession.isPaused;
    togglePauseActiveSession();
    setA11yAnnouncement(nextState ? 'Session paused' : 'Session resumed');
  };

  const handleEnd = () => {
    setA11yAnnouncement('Session ended');
    const finalSession = endActiveSession();
    if (finalSession) {
      sessionStorage.setItem('lastCompletedSession', JSON.stringify(finalSession));
      navigate('/train/complete');
    } else {
      navigate('/train');
    }
  };

  const handleNextWorkout = () => {
    nextWorkoutInActiveSession();
  };

  const hasMultipleWorkouts = activeSession.workoutIds.length > 1;
  const isLastWorkout =
    activeSession.currentWorkoutIndex >= activeSession.workoutIds.length - 1;

  return (
    <div className="min-h-screen -mt-2 -mx-4 sm:-mx-5 px-4 sm:px-5 py-6 flex flex-col justify-between bg-[#FAFAFA] select-none">
      {/* Hidden live region */}
      <div className="sr-only" aria-live="polite">
        {a11yAnnouncement}
      </div>

      {/* Top bar: In-progress status badge and End button */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          {/* Subtle sporadic Red dot indicating IN PROGRESS */}
          <span
            className={`w-2 h-2 rounded-full ${
              activeSession.isPaused ? 'bg-[#71717A]' : 'bg-[#DC2626] animate-pulse'
            }`}
            aria-hidden="true"
          />
          <span className="font-sans text-[11px] uppercase tracking-wider text-[#71717A] font-medium">
            {activeSession.isPaused ? 'Paused' : 'In Progress'}
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

      {/* Main Center Area: Timer & Current Item */}
      <div className="flex flex-col items-center justify-center text-center my-auto">
        {/* Large Display Timer */}
        <div
          aria-live="off"
          className={`font-mono font-medium text-[clamp(4.25rem,18vw,7.5rem)] tracking-[-0.02em] leading-none tabular-nums transition-colors duration-200 ${
            activeSession.isPaused ? 'text-[#71717A]' : 'text-[#09090B]'
          }`}
        >
          <span>{mm}</span>
          <span
            className={`${
              activeSession.isPaused
                ? 'text-[#71717A]'
                : 'text-[#DC2626]'
            } ${
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

        {/* Paused state text */}
        {activeSession.isPaused ? (
          <p className="font-sans text-sm text-[#71717A] mt-4 tracking-wide uppercase">
            {COPY.active.pausedLabel}
          </p>
        ) : currentWorkout ? (
          <div className="mt-6 flex flex-col items-center">
            <h2 className="font-serif font-medium text-lg md:text-xl text-[#71717A]">
              {currentWorkout.name}
            </h2>
            {currentWorkout.durationMin && (
              <span className="font-mono text-xs text-[#71717A] mt-1">
                ~{currentWorkout.durationMin}m
              </span>
            )}
          </div>
        ) : (
          <div className="h-6 mt-4" />
        )}
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-col items-center pb-8 space-y-4">
        {hasMultipleWorkouts && !isLastWorkout && (
          <button
            type="button"
            onClick={handleNextWorkout}
            className="font-sans font-medium text-xs uppercase tracking-wider text-[#71717A] hover:text-[#09090B] p-2 min-h-[44px] focus-visible:outline-2 focus-visible:outline-[#09090B]"
          >
            {COPY.active.next}
          </button>
        )}

        {/* Pause / Resume */}
        <button
          type="button"
          onClick={handleTogglePause}
          className="font-sans font-semibold text-xs uppercase tracking-wider text-[#27272A] hover:text-[#09090B] p-3 min-h-[44px] min-w-[120px] focus-visible:outline-2 focus-visible:outline-[#09090B]"
        >
          {activeSession.isPaused ? COPY.active.resume : COPY.active.pause}
        </button>
      </div>
    </div>
  );
};
