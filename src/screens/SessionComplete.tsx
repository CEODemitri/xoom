import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { COPY } from '../constants/content';
import { useStore } from '../store/useStore';
import { Button } from '../components/primitives/Buttons';
import { CheckMark } from '../components/icons';
import { ActiveSession } from '../types';

export const SessionComplete: React.FC = () => {
  const navigate = useNavigate();
  const { addSessionLog, workouts } = useStore();

  const [sessionData, setSessionData] = useState<ActiveSession | null>(null);
  const [effort, setEffort] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    const raw = sessionStorage.getItem('lastCompletedSession');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setSessionData(parsed);
      } catch (err) {
        console.error('Failed to parse completed session', err);
      }
    }
  }, []);

  const durationSec = sessionData?.elapsedSec || 60;
  const minutes = Math.floor(durationSec / 60);
  const seconds = durationSec % 60;
  const timeFormatted =
    minutes > 0 ? `${minutes}m ${seconds > 0 ? `${seconds}s` : ''}`.trim() : `${seconds}s`;

  const workoutNames = (sessionData?.workoutIds || [])
    .map((id) => workouts.find((w) => w.id === id)?.name)
    .filter(Boolean);

  const handleDone = () => {
    addSessionLog({
      date: sessionData?.startedAt || new Date().toISOString(),
      durationSec: durationSec,
      mode: sessionData?.mode || 'timer',
      workoutIds: sessionData?.workoutIds || [],
      effort: effort,
      note: note.trim() || null,
    });

    sessionStorage.removeItem('lastCompletedSession');
    navigate('/train', { replace: true });
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col justify-center items-center max-w-[480px] mx-auto py-12 px-2 text-center select-none space-y-10">
      {/* Title with subtle Blue COMPLETE mark */}
      <div className="flex flex-col items-center">
        <div className="w-9 h-9 rounded-full bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center mb-3">
          <CheckMark size={18} aria-hidden="true" />
        </div>

        <h1 className="font-serif font-semibold text-3xl md:text-4xl text-[#09090B] tracking-[-0.02em]">
          {COPY.complete.title}
        </h1>

        {/* Summary: Centered, no card */}
        <div className="mt-4 flex flex-col items-center">
          <span className="font-mono text-2xl text-[#09090B] tabular-nums">
            {timeFormatted}
          </span>
          {workoutNames.length > 0 && (
            <p className="font-sans text-xs uppercase tracking-wider text-[#71717A] mt-2 max-w-sm">
              {workoutNames.join(' · ')}
            </p>
          )}
        </div>
      </div>

      {/* Effort (5 dots) with Blue for complete */}
      <div className="flex flex-col items-center space-y-3">
        <label
          id="effort-label"
          className="font-sans font-semibold text-[0.6875rem] uppercase tracking-[0.12em] text-[#71717A]"
        >
          {COPY.complete.effortLabel}
        </label>
        <div
          role="radiogroup"
          aria-labelledby="effort-label"
          className="flex items-center gap-3"
        >
          {([1, 2, 3, 4, 5] as const).map((rating) => {
            const isSelected = effort !== null && rating <= effort;
            return (
              <button
                key={rating}
                type="button"
                role="radio"
                aria-checked={effort === rating}
                aria-label={`Effort ${rating} of 5`}
                onClick={() => setEffort(effort === rating ? null : rating)}
                className="w-11 h-11 flex items-center justify-center focus-visible:outline-2 focus-visible:outline-[#09090B]"
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full transition-colors ${
                    isSelected ? 'bg-[#2563EB]' : 'bg-[#E4E4E7]'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional Note */}
      <div className="w-full text-left space-y-2">
        <label
          htmlFor="session-note"
          className="block font-sans font-semibold text-[0.6875rem] uppercase tracking-[0.12em] text-[#71717A]"
        >
          {COPY.complete.noteLabel}
        </label>
        <input
          id="session-note"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full bg-[#FFFFFF] border border-[#E4E4E7] rounded-lg px-4 py-3 font-sans text-sm text-[#09090B] focus:outline-none focus-visible:border-[#09090B]"
        />
      </div>

      {/* Primary Action Button */}
      <Button
        variant="primary"
        onClick={handleDone}
        className="w-full mt-4"
      >
        {COPY.complete.done}
      </Button>
    </div>
  );
};
