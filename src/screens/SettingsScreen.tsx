import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COPY } from '../constants/content';
import { useStore } from '../store/useStore';
import { ChevronLeft } from '../components/icons';

export const SettingsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { settings, updateSettings, clearAllData } = useStore();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClear = () => {
    clearAllData();
    setShowClearConfirm(false);
    navigate('/train');
  };

  return (
    <div className="flex flex-col space-y-8 max-w-[560px]">
      {/* Back link */}
      <div>
        <button
          type="button"
          onClick={() => navigate('/you')}
          className="inline-flex items-center gap-1 font-sans text-xs uppercase tracking-wider text-[#71717A] hover:text-[#09090B] p-1 -ml-1 focus-visible:outline-2 focus-visible:outline-[#09090B]"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          <span>{COPY.you.title}</span>
        </button>
      </div>

      <div>
        <h1 className="font-serif font-semibold text-3xl md:text-4xl text-[#09090B] tracking-[-0.02em]">
          {COPY.settings.title}
        </h1>
      </div>

      <div className="border-t border-[#E4E4E7] bg-[#FFFFFF] border border-[#E4E4E7] rounded-xl px-5 divide-y divide-[#E4E4E7]">
        {/* Timer Mode: Count up / Count down */}
        <div className="py-4 flex items-center justify-between gap-4">
          <span className="font-sans font-medium text-[0.9375rem] text-[#27272A]">
            {COPY.settings.timerMode}
          </span>
          <div className="inline-flex border border-[#E4E4E7] p-0.5 bg-[#F4F4F5] rounded-lg">
            <button
              type="button"
              onClick={() => updateSettings({ timerMode: 'up' })}
              className={`px-3 py-1.5 font-sans text-xs font-medium rounded-md transition-colors select-none ${
                settings.timerMode === 'up'
                  ? 'bg-[#09090B] text-[#FFFFFF]'
                  : 'text-[#27272A] hover:text-[#09090B]'
              }`}
            >
              {COPY.settings.timerCountUp}
            </button>
            <button
              type="button"
              onClick={() => updateSettings({ timerMode: 'down' })}
              className={`px-3 py-1.5 font-sans text-xs font-medium rounded-md transition-colors select-none ${
                settings.timerMode === 'down'
                  ? 'bg-[#09090B] text-[#FFFFFF]'
                  : 'text-[#27272A] hover:text-[#09090B]'
              }`}
            >
              {COPY.settings.timerCountDown}
            </button>
          </div>
        </div>

        {/* Units: Minutes / Minutes and seconds */}
        <div className="py-4 flex items-center justify-between gap-4">
          <span className="font-sans font-medium text-[0.9375rem] text-[#27272A]">
            {COPY.settings.units}
          </span>
          <div className="inline-flex border border-[#E4E4E7] p-0.5 bg-[#F4F4F5] rounded-lg">
            <button
              type="button"
              onClick={() => updateSettings({ units: 'min' })}
              className={`px-3 py-1.5 font-sans text-xs font-medium rounded-md transition-colors select-none ${
                settings.units === 'min'
                  ? 'bg-[#09090B] text-[#FFFFFF]'
                  : 'text-[#27272A] hover:text-[#09090B]'
              }`}
            >
              {COPY.settings.unitsMin}
            </button>
            <button
              type="button"
              onClick={() => updateSettings({ units: 'minsec' })}
              className={`px-3 py-1.5 font-sans text-xs font-medium rounded-md transition-colors select-none ${
                settings.units === 'minsec'
                  ? 'bg-[#09090B] text-[#FFFFFF]'
                  : 'text-[#27272A] hover:text-[#09090B]'
              }`}
            >
              {COPY.settings.unitsMinSec}
            </button>
          </div>
        </div>

        {/* Reduce motion */}
        <div className="py-4 flex items-center justify-between gap-4">
          <span className="font-sans font-medium text-[0.9375rem] text-[#27272A]">
            {COPY.settings.reduceMotion}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={settings.reduceMotion}
            onClick={() => updateSettings({ reduceMotion: !settings.reduceMotion })}
            className={`w-12 h-6 border transition-colors relative flex items-center px-0.5 rounded-full focus-visible:outline-2 focus-visible:outline-[#09090B] ${
              settings.reduceMotion
                ? 'bg-[#09090B] border-[#09090B]'
                : 'bg-[#E4E4E7] border-[#E4E4E7]'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                settings.reduceMotion ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* About Xoom */}
        <div className="py-4 flex flex-col space-y-1">
          <span className="font-sans font-medium text-[0.9375rem] text-[#27272A]">
            {COPY.settings.about}
          </span>
          <p className="font-sans text-xs text-[#71717A] leading-relaxed">
            {COPY.settings.aboutText}
          </p>
        </div>

        {/* Clear all data */}
        <div className="py-5">
          {showClearConfirm ? (
            <div className="flex items-center gap-4 bg-[#F4F4F5] p-3 rounded-lg border border-[#E4E4E7]">
              <span className="font-sans text-xs text-[#09090B]">
                Reset and erase all logs?
              </span>
              <button
                type="button"
                onClick={handleClear}
                className="font-sans font-semibold text-xs uppercase tracking-wider text-[#DC2626] hover:text-[#B91C1C] p-2"
              >
                {COPY.settings.confirmClear}
              </button>
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="font-sans text-xs uppercase tracking-wider text-[#71717A] hover:text-[#09090B] p-2"
              >
                {COPY.settings.cancelClear}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="font-sans font-semibold text-xs uppercase tracking-wider text-[#DC2626] hover:text-[#B91C1C] p-2 -ml-2 min-h-[44px] flex items-center focus-visible:outline-2 focus-visible:outline-[#09090B]"
            >
              {COPY.settings.clearData}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
