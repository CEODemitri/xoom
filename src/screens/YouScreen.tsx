import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
} from 'date-fns';
import { COPY } from '../constants/content';
import { useStore } from '../store/useStore';
import { ChevronLeft, ChevronRight } from '../components/icons';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const YouScreen: React.FC = () => {
  const navigate = useNavigate();
  const { sessionLogs, workouts, getStreak, getTotalTimeSec } = useStore();
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(null);

  const streak = getStreak();
  const totalTimeSec = getTotalTimeSec();
  const totalTimeMins = Math.round(totalTimeSec / 60);
  const totalTimeFormatted =
    totalTimeMins >= 60
      ? `${Math.floor(totalTimeMins / 60)}h ${totalTimeMins % 60}m`
      : `${totalTimeMins}m`;

  const totalSessions = sessionLogs.length;

  // Calendar logic
  const monthStart = startOfMonth(currentMonthDate);
  const monthEnd = endOfMonth(currentMonthDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart);

  const prevMonth = () => setCurrentMonthDate((prev) => subMonths(prev, 1));
  const nextMonth = () => setCurrentMonthDate((prev) => addMonths(prev, 1));

  const getLogsForDate = (date: Date) => {
    return sessionLogs.filter((log) => {
      const d = new Date(log.date);
      return isSameDay(d, date);
    });
  };

  const handleDayClick = (day: Date) => {
    const logs = getLogsForDate(day);
    if (logs.length === 1) {
      navigate(`/you/log/${logs[0].id}`);
    } else if (logs.length > 1) {
      setSelectedCalendarDate(day);
    }
  };

  const getFirstWorkoutName = (workoutIds: string[]) => {
    if (!workoutIds || workoutIds.length === 0) return COPY.you.timerDefaultName;
    const first = workouts.find((w) => w.id === workoutIds[0]);
    return first ? first.name : COPY.you.timerDefaultName;
  };

  const today = new Date();

  return (
    <div className="flex flex-col space-y-10">
      {/* Title */}
      <div>
        <h1 className="font-serif font-semibold text-3xl md:text-4xl text-[#09090B] tracking-[-0.02em]">
          {COPY.you.title}
        </h1>
      </div>

      {/* Stats Row: 3 equal columns */}
      <div className="grid grid-cols-3 py-6 border-y border-[#E4E4E7] text-center bg-[#FFFFFF] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        {/* Total Sessions */}
        <div className="flex flex-col items-center border-r border-[#E4E4E7]">
          <span className="font-mono font-medium text-2xl md:text-3xl text-[#09090B] tabular-nums">
            {totalSessions}
          </span>
          <span className="font-sans font-medium text-[0.6875rem] uppercase tracking-[0.1em] text-[#71717A] mt-1">
            {COPY.you.totalSessions}
          </span>
        </div>

        {/* Total Time */}
        <div className="flex flex-col items-center border-r border-[#E4E4E7]">
          <span className="font-mono font-medium text-2xl md:text-3xl text-[#09090B] tabular-nums">
            {totalTimeFormatted}
          </span>
          <span className="font-sans font-medium text-[0.6875rem] uppercase tracking-[0.1em] text-[#71717A] mt-1">
            {COPY.you.totalTime}
          </span>
        </div>

        {/* Current Streak - in-progress metric highlighted in subtle Red */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-medium text-2xl md:text-3xl text-[#DC2626] tabular-nums">
              {streak}
            </span>
          </div>
          <span className="font-sans font-medium text-[0.6875rem] uppercase tracking-[0.1em] text-[#71717A] mt-1">
            {COPY.you.currentStreak}
          </span>
        </div>
      </div>

      {/* Month Calendar */}
      <section className="pt-2 bg-[#FFFFFF] border border-[#E4E4E7] rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        {/* Calendar Nav */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif font-semibold text-lg text-[#09090B]">
            {format(currentMonthDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={prevMonth}
              aria-label={COPY.a11y.prevMonth}
              className="w-10 h-10 flex items-center justify-center text-[#71717A] hover:text-[#09090B] focus-visible:outline-2 focus-visible:outline-[#09090B]"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              aria-label={COPY.a11y.nextMonth}
              className="w-10 h-10 flex items-center justify-center text-[#71717A] hover:text-[#09090B] focus-visible:outline-2 focus-visible:outline-[#09090B]"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 text-center mb-2">
          {WEEKDAYS.map((day, idx) => (
            <span
              key={idx}
              className="font-sans font-semibold text-[0.6875rem] uppercase tracking-[0.12em] text-[#71717A] py-1"
            >
              {day}
            </span>
          ))}
        </div>

        {/* Calendar Day Grid */}
        <div className="grid grid-cols-7 gap-y-2">
          {Array.from({ length: startDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10" />
          ))}

          {daysInMonth.map((day) => {
            const isToday = isSameDay(day, today);
            const isCurrentMonth = isSameMonth(day, currentMonthDate);
            const logs = getLogsForDate(day);
            const hasLog = logs.length > 0;
            const isSelected = selectedCalendarDate && isSameDay(day, selectedCalendarDate);

            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => handleDayClick(day)}
                disabled={!hasLog}
                aria-label={`${format(day, 'MMMM d')}${hasLog ? `, ${logs.length} session` : ''}`}
                className={`relative h-10 mx-auto w-10 flex flex-col items-center justify-center select-none transition-colors rounded-lg ${
                  isSelected ? 'bg-[#F4F4F5]' : ''
                } ${isToday ? 'border border-[#09090B]' : ''} ${
                  hasLog ? 'cursor-pointer hover:bg-[#F4F4F5]' : 'cursor-default'
                }`}
              >
                <span
                  className={`font-mono text-sm leading-none tabular-nums ${
                    hasLog ? 'text-[#09090B] font-medium' : isCurrentMonth ? 'text-[#27272A]' : 'text-[#A1A1AA]'
                  }`}
                >
                  {format(day, 'd')}
                </span>

                {/* Subtle sporadic Blue dot beneath completed logged day */}
                {hasLog && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#2563EB] absolute bottom-1.5"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Logs List */}
      <section className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif font-semibold text-lg text-[#09090B]">
            {COPY.you.logsTitle}
          </h2>
          <span className="font-sans text-[11px] uppercase tracking-wider text-[#71717A]">
            {sessionLogs.length} logged
          </span>
        </div>

        {sessionLogs.length === 0 ? (
          <p className="font-sans text-xs uppercase tracking-wider text-[#71717A]">
            {COPY.you.noLogs}
          </p>
        ) : (
          <div className="border-t border-[#E4E4E7] bg-[#FFFFFF] border border-[#E4E4E7] rounded-xl divide-y divide-[#E4E4E7] overflow-hidden">
            {sessionLogs.map((log) => {
              const dateObj = new Date(log.date);
              const formattedDate = format(dateObj, 'MMM d, yyyy');
              const minutes = Math.round(log.durationSec / 60);

              return (
                <button
                  key={log.id}
                  type="button"
                  onClick={() => navigate(`/you/log/${log.id}`)}
                  className="w-full flex items-center justify-between py-3.5 px-4 text-left hover:bg-[#F4F4F5] transition-colors select-none focus-visible:outline-2 focus-visible:outline-[#09090B]"
                >
                  <div className="flex items-center gap-3">
                    {/* Blue dot for completed log */}
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0" aria-hidden="true" />
                    <div className="flex flex-col">
                      <span className="font-sans text-xs uppercase tracking-wider text-[#71717A]">
                        {formattedDate}
                      </span>
                      <span className="font-sans text-sm text-[#09090B] font-medium mt-0.5">
                        {getFirstWorkoutName(log.workoutIds)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-[#09090B] tabular-nums">
                      {minutes}m
                    </span>
                    <ChevronRight size={16} className="text-[#71717A]" aria-hidden="true" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Settings link at bottom */}
      <div className="pt-2 pb-8">
        <button
          type="button"
          onClick={() => navigate('/you/settings')}
          className="w-full flex items-center justify-between py-3 px-4 bg-[#FFFFFF] border border-[#E4E4E7] rounded-xl text-left font-sans text-xs uppercase tracking-wider text-[#71717A] hover:text-[#09090B] hover:border-[#71717A] transition-colors focus-visible:outline-2 focus-visible:outline-[#09090B]"
        >
          <span>{COPY.you.settingsLabel}</span>
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
