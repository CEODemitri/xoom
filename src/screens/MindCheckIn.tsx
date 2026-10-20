import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COPY } from '../constants/content';
import { useStore } from '../store/useStore';
import { Button } from '../components/primitives/Buttons';
import { ChevronLeft } from '../components/icons';

type MoodOption = (typeof COPY.mind.moods)[number];

export const MindCheckIn: React.FC = () => {
  const navigate = useNavigate();
  const { addMindLog } = useStore();

  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [note, setNote] = useState('');

  const handleSave = () => {
    if (!selectedMood && !note.trim()) return;

    const moodIndex = selectedMood
      ? ((COPY.mind.moods.indexOf(selectedMood) + 1) as 1 | 2 | 3 | 4 | 5)
      : null;

    addMindLog({
      date: new Date().toISOString(),
      type: 'check-in',
      durationSec: null,
      mood: moodIndex,
      note: note.trim() || null,
    });

    navigate('/mind', { replace: true });
  };

  return (
    <div className="flex flex-col space-y-8 max-w-[560px]">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => navigate('/mind')}
          className="inline-flex items-center gap-1 font-sans text-xs uppercase tracking-wider text-[#78716A] hover:text-[#1B1916] p-1 -ml-1 focus-visible:outline-2 focus-visible:outline-[#B85A3C]"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          <span>{COPY.mind.title}</span>
        </button>
      </div>

      <div>
        <h1 className="font-serif font-semibold text-3xl md:text-4xl text-[#1B1916] tracking-[-0.02em]">
          {COPY.mind.checkIn}
        </h1>
        <p className="font-sans text-sm text-[#78716A] mt-1">
          {COPY.mind.checkInDesc}
        </p>
      </div>

      {/* Mood Scale: 5 text labels */}
      <div className="space-y-3 pt-2">
        <label
          id="mood-scale-label"
          className="block font-sans font-semibold text-[0.6875rem] uppercase tracking-[0.12em] text-[#78716A]"
        >
          Mood
        </label>
        <div
          role="radiogroup"
          aria-labelledby="mood-scale-label"
          className="flex flex-wrap gap-2.5"
        >
          {COPY.mind.moods.map((mood) => {
            const isSelected = selectedMood === mood;
            return (
              <button
                key={mood}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelectedMood(mood)}
                className={`font-sans font-medium text-xs px-4 py-2.5 rounded-full border transition-colors select-none min-h-[44px] focus-visible:outline-2 focus-visible:outline-[#B85A3C] ${
                  isSelected
                    ? 'border-[#B85A3C] text-[#B85A3C] bg-transparent'
                    : 'border-[#DFD7C8] text-[#3B3732] bg-transparent hover:border-[#78716A]'
                }`}
              >
                {mood}
              </button>
            );
          })}
        </div>
      </div>

      {/* Note input: One line */}
      <div className="space-y-2 pt-2">
        <label
          htmlFor="checkin-note"
          className="block font-sans font-semibold text-[0.6875rem] uppercase tracking-[0.12em] text-[#78716A]"
        >
          {COPY.mind.oneLineLabel}
        </label>
        <input
          id="checkin-note"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={140}
          className="w-full bg-[#ECE6DA] border border-[#DFD7C8] rounded-lg px-4 py-3 font-sans text-sm text-[#1B1916] focus:outline-none focus:border-[#B85A3C]"
        />
      </div>

      {/* Save Button */}
      <div className="pt-4">
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={!selectedMood && !note.trim()}
          className="w-full"
        >
          {COPY.mind.save}
        </Button>
      </div>
    </div>
  );
};
