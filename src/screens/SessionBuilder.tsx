import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { COPY } from '../constants/content';
import { useStore } from '../store/useStore';
import { TimeLimitSheet } from '../components/sheets/TimeLimitSheet';
import { Chip } from '../components/primitives/Chip';
import { Button } from '../components/primitives/Buttons';

type FilterBodyArea = 'Upper' | 'Lower' | 'Core' | 'Full Body';
type FilterEquipment = 'None' | 'Dumbbell' | 'Barbell' | 'Kettlebell' | 'Mat';
type FilterDuration = '< 5m' | '5-15m' | '> 15m';

export const SessionBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { workouts, selectedWorkoutIds, toggleWorkoutSelection, startActiveSession, settings } = useStore();
  const [selectedBodyAreas, setSelectedBodyAreas] = useState<FilterBodyArea[]>([]);
  const [selectedEquipments, setSelectedEquipments] = useState<FilterEquipment[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<FilterDuration[]>([]);
  const [isTimeSheetOpen, setIsTimeSheetOpen] = useState(false);

  const toggleBodyArea = (area: FilterBodyArea) => {
    setSelectedBodyAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const toggleEquipment = (eq: FilterEquipment) => {
    setSelectedEquipments((prev) =>
      prev.includes(eq) ? prev.filter((e) => e !== eq) : [...prev, eq]
    );
  };

  const toggleDuration = (dur: FilterDuration) => {
    setSelectedDurations((prev) =>
      prev.includes(dur) ? prev.filter((d) => d !== dur) : [...prev, dur]
    );
  };

  const filteredWorkouts = useMemo(() => {
    return workouts.filter((workout) => {
      // Body area filter
      if (selectedBodyAreas.length > 0) {
        const matchesArea = workout.bodyArea.some((a) => selectedBodyAreas.includes(a as FilterBodyArea));
        if (!matchesArea) return false;
      }
      // Equipment filter
      if (selectedEquipments.length > 0) {
        const matchesEquip = workout.equipment.some((e) => selectedEquipments.includes(e as FilterEquipment));
        if (!matchesEquip) return false;
      }
      // Duration filter
      if (selectedDurations.length > 0) {
        const dur = workout.durationMin || 0;
        const matchesDur = selectedDurations.some((d) => {
          if (d === '< 5m') return dur < 5;
          if (d === '5-15m') return dur >= 5 && dur <= 15;
          if (d === '> 15m') return dur > 15;
          return true;
        });
        if (!matchesDur) return false;
      }
      return true;
    });
  }, [workouts, selectedBodyAreas, selectedEquipments, selectedDurations]);

  const selectedWorkouts = useMemo(() => {
    return selectedWorkoutIds
      .map((id) => workouts.find((w) => w.id === id))
      .filter((w): w is NonNullable<typeof w> => Boolean(w));
  }, [selectedWorkoutIds, workouts]);

  const totalEstTimeMin = useMemo(() => {
    return selectedWorkouts.reduce((sum, w) => sum + (w.durationMin || 3), 0);
  }, [selectedWorkouts]);

  const handleStartSession = (durationSec: number) => {
    setIsTimeSheetOpen(false);
    startActiveSession('built', selectedWorkoutIds, durationSec);
    navigate('/train/active');
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100dvh-56px)] overflow-hidden">
      {/* Header - Compact */}
      <div className="mb-2 shrink-0">
        <h1 className="font-serif font-semibold text-2xl sm:text-3xl text-[#09090B] tracking-[-0.02em]">
          {COPY.train.buildTitle}
        </h1>
      </div>

      {/* Sticky Filter Chips */}
      <div className="shrink-0 bg-[#FAFAFA] py-1.5 -mx-4 sm:-mx-5 px-4 sm:px-5 border-b border-[#E4E4E7] overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max pb-0.5">
          {/* Body Area */}
          {(['Upper', 'Lower', 'Core', 'Full Body'] as FilterBodyArea[]).map((area) => (
            <Chip
              key={area}
              label={area}
              selected={selectedBodyAreas.includes(area)}
              onClick={() => toggleBodyArea(area)}
              variant="neutral"
              isReducedMotion={settings.reduceMotion}
              className="py-1 px-2.5 text-[11px]"
            />
          ))}

          <span className="w-px h-4 bg-[#E4E4E7] mx-1 shrink-0" aria-hidden="true" />

          {/* Equipment */}
          {(['None', 'Dumbbell', 'Barbell', 'Kettlebell', 'Mat'] as FilterEquipment[]).map((eq) => (
            <Chip
              key={eq}
              label={eq}
              selected={selectedEquipments.includes(eq)}
              onClick={() => toggleEquipment(eq)}
              variant="neutral"
              isReducedMotion={settings.reduceMotion}
              className="py-1 px-2.5 text-[11px]"
            />
          ))}

          <span className="w-px h-4 bg-[#E4E4E7] mx-1 shrink-0" aria-hidden="true" />

          {/* Duration */}
          {(['< 5m', '5-15m', '> 15m'] as FilterDuration[]).map((dur) => (
            <Chip
              key={dur}
              label={dur}
              selected={selectedDurations.includes(dur)}
              onClick={() => toggleDuration(dur)}
              variant="neutral"
              isReducedMotion={settings.reduceMotion}
              font="mono"
              className="py-1 px-2.5 text-[11px]"
            />
          ))}
        </div>
      </div>

      {/* Masonry Pool Cards - Internal Scrollable within 100vh */}
      <div className="flex-1 overflow-y-auto min-h-0 py-2.5 pr-0.5">
        {filteredWorkouts.length === 0 ? (
          <p className="font-sans text-xs text-[#71717A] py-6 text-center">
            {COPY.train.noFilteredWorkouts}
          </p>
        ) : (
          <div className="columns-2 sm:columns-3 gap-2 sm:gap-2.5">
            {filteredWorkouts.map((workout, idx) => {
              const isSelected = selectedWorkoutIds.includes(workout.id);
              const hasMultipleEquipment = workout.equipment.length > 1;

              return (
                <motion.button
                  key={workout.id}
                  type="button"
                  onClick={() => toggleWorkoutSelection(workout.id)}
                  whileTap={!settings.reduceMotion ? { scale: 0.97 } : undefined}
                  className={`break-inside-avoid mb-2 sm:mb-2.5 w-full inline-block text-left bg-[#FFFFFF] p-2.5 sm:p-3 rounded-xl border transition-colors select-none focus-visible:outline-2 focus-visible:outline-[#09090B] shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${
                    isSelected
                      ? 'border-[#DC2626] ring-1 ring-[#DC2626]'
                      : 'border-[#E4E4E7] hover:border-[#71717A]/70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <h3 className="font-serif font-medium text-xs sm:text-[0.875rem] text-[#09090B] leading-snug line-clamp-2">
                      {workout.name}
                    </h3>
                    {isSelected && (
                      <span
                        className="w-2 h-2 rounded-full bg-[#DC2626] shrink-0 mt-0.5"
                        aria-label="In progress selection"
                      />
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1 mt-1.5 text-[10px] sm:text-[11px] text-[#71717A] leading-tight">
                    <span>{workout.bodyArea.join(', ')}</span>
                    {(hasMultipleEquipment || workout.equipment[0] !== 'None') && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{workout.equipment.join(', ')}</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#E4E4E7]">
                    <span className="font-mono text-[10px] sm:text-[11px] text-[#71717A] tabular-nums">
                      {workout.durationMin ? `${workout.durationMin}m` : '—'}
                    </span>
                    {idx % 3 === 0 && (
                      <span className="font-sans text-[9px] uppercase tracking-wider text-[#A1A1AA]">
                        {workout.bodyArea[0]}
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* Sticky Session Tray */}
      <div className="shrink-0 bg-[#FAFAFA] border-t border-[#E4E4E7] py-2.5 px-1 mb-16 z-20">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              {selectedWorkouts.length > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" aria-hidden="true" />
              )}
              <span className="font-sans font-semibold text-xs text-[#09090B]">
                {COPY.train.selectedCount(selectedWorkouts.length)}
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#71717A]">
              {selectedWorkouts.length > 0 ? COPY.train.estTime(totalEstTimeMin) : '—'}
            </span>
          </div>

          <Button
            variant="primary"
            disabled={selectedWorkouts.length === 0}
            onClick={() => setIsTimeSheetOpen(true)}
            className="flex-1 max-w-[200px] py-2.5 px-4 text-xs font-semibold"
          >
            {COPY.train.setLimit}
          </Button>
        </div>
      </div>

      {/* Time Limit Sheet */}
      <TimeLimitSheet
        isOpen={isTimeSheetOpen}
        onClose={() => setIsTimeSheetOpen(false)}
        onStart={handleStartSession}
      />
    </div>
  );
};
