import React, { useState } from 'react';
import { COPY, MEAL_IDEAS_SEED } from '../constants/content';
import { useStore } from '../store/useStore';
import { Button } from '../components/primitives/Buttons';
import { format } from 'date-fns';

export const EatHome: React.FC = () => {
  const {
    mealNotes,
    addMealNote,
    deleteMealNote,
    waterCount,
    toggleWaterCircle,
  } = useStore();

  const [ideaIndex, setIdeaIndex] = useState(() => {
    const now = new Date();
    const dayOfYear = Math.floor(
      (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
    );
    return dayOfYear % MEAL_IDEAS_SEED.length;
  });

  const [newMealText, setNewMealText] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const currentIdea = MEAL_IDEAS_SEED[ideaIndex % MEAL_IDEAS_SEED.length];

  const handleNextIdea = () => {
    setIdeaIndex((prev) => (prev + 1) % MEAL_IDEAS_SEED.length);
  };

  const handleSaveMeal = () => {
    if (!newMealText.trim()) return;
    addMealNote(newMealText.trim());
    setNewMealText('');
  };

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayMeals = mealNotes.filter((m) => {
    const mealDateStr = format(new Date(m.date), 'yyyy-MM-dd');
    return mealDateStr === todayStr;
  });

  return (
    <div className="flex flex-col space-y-10">
      {/* Header */}
      <div>
        <p className="font-serif font-medium text-base text-[#71717A]">
          {COPY.eat.intro}
        </p>
        <h1 className="font-serif font-semibold text-3xl md:text-4xl text-[#09090B] mt-1 tracking-[-0.02em]">
          {COPY.eat.title}
        </h1>
      </div>

      {/* Idea of the Day Card */}
      <section>
        <div className="bg-[#FFFFFF] border border-[#E4E4E7] p-6 rounded-xl space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="font-sans font-semibold text-[0.6875rem] uppercase tracking-[0.12em] text-[#71717A]">
              {COPY.eat.ideaLabel}
            </span>
            <button
              type="button"
              onClick={handleNextIdea}
              className="font-sans text-xs uppercase tracking-wider text-[#71717A] hover:text-[#09090B] p-1 min-h-[44px] flex items-center focus-visible:outline-2 focus-visible:outline-[#09090B]"
            >
              {COPY.eat.anotherIdea}
            </button>
          </div>
          <p className="font-serif font-medium text-lg text-[#09090B] leading-snug">
            {currentIdea}
          </p>
        </div>
      </section>

      {/* Water Tracker: 8 circles with Blue for completed glasses */}
      <section className="space-y-4 bg-[#FFFFFF] border border-[#E4E4E7] p-5 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2563EB]" aria-hidden="true" />
            <span className="font-sans font-semibold text-[0.6875rem] uppercase tracking-[0.12em] text-[#71717A]">
              {COPY.eat.waterLabel}
            </span>
          </div>
          <span className="font-mono text-xs text-[#09090B] font-medium tabular-nums">
            {waterCount} / 8 completed
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          {Array.from({ length: 8 }).map((_, index) => {
            const isFilled = index < waterCount;
            return (
              <button
                key={index}
                type="button"
                onClick={() => toggleWaterCircle(index)}
                aria-label={`Water glass ${index + 1} of 8, ${isFilled ? 'completed' : 'empty'}`}
                className="w-11 h-11 flex items-center justify-center focus-visible:outline-2 focus-visible:outline-[#09090B]"
              >
                <span
                  className={`w-[20px] h-[20px] rounded-full border transition-colors ${
                    isFilled
                      ? 'bg-[#2563EB] border-[#2563EB]'
                      : 'bg-transparent border-[#E4E4E7] hover:border-[#71717A]'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </section>

      {/* Meal Note */}
      <section className="space-y-4 pt-2">
        <label
          htmlFor="eat-meal-input"
          className="block font-sans font-semibold text-[0.6875rem] uppercase tracking-[0.12em] text-[#71717A]"
        >
          {COPY.eat.noteMealLabel}
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id="eat-meal-input"
            type="text"
            value={newMealText}
            onChange={(e) => setNewMealText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSaveMeal();
              }
            }}
            placeholder=""
            className="flex-1 bg-[#FFFFFF] border border-[#E4E4E7] rounded-lg px-4 py-3 font-sans text-sm text-[#09090B] focus:outline-none focus:border-[#09090B]"
          />
          <Button
            variant="primary"
            onClick={handleSaveMeal}
            disabled={!newMealText.trim()}
            className="shrink-0"
          >
            {COPY.eat.saveMeal}
          </Button>
        </div>

        {/* Today's Saved Meals */}
        <div className="pt-4 border-t border-[#E4E4E7] space-y-2">
          {todayMeals.length === 0 ? (
            <p className="font-sans text-xs uppercase tracking-wider text-[#71717A] py-2">
              {COPY.eat.noMealsToday}
            </p>
          ) : (
            todayMeals.map((meal) => {
              const timeStr = format(new Date(meal.date), 'h:mm a');
              const isConfirming = deleteConfirmId === meal.id;

              return (
                <div
                  key={meal.id}
                  className="flex items-center justify-between py-2 border-b border-[#E4E4E7]/70"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0" aria-hidden="true" />
                    <span className="font-sans text-xs text-[#71717A] w-14 shrink-0">
                      {timeStr}
                    </span>
                    <span className="font-sans text-sm text-[#27272A]">
                      {meal.text}
                    </span>
                  </div>

                  {isConfirming ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => deleteMealNote(meal.id)}
                        className="font-sans font-semibold text-xs uppercase tracking-wider text-[#DC2626] p-1"
                      >
                        {COPY.eat.deleteMealConfirm}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(null)}
                        className="font-sans text-xs uppercase tracking-wider text-[#71717A] p-1"
                      >
                        {COPY.eat.deleteMealCancel}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(meal.id)}
                      className="font-sans text-xs text-[#71717A] hover:text-[#DC2626] p-2 min-h-[36px]"
                    >
                      Delete
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};
