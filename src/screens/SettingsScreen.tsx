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
          className="inline-flex items-center gap-1 font-sans text-xs uppercase tracking-wider text-[#78716A] hover:text-[#1B1916] p-1 -ml-1 focus-visible:outline-2 focus-visible:outline-[#B85A3C]"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          <span>{COPY.you.title}</span>
        </button>
      </div>

      <div>
        <h1 className="font-serif font-semibold text-3xl md:text-4xl text-[#1B1916] tracking-[-0.02em]">
          {COPY.settings.title}
        </h1>
      </div>

      <div className="border-t border-[#DFD7C8]">
        {/* Timer Mode: Count up / Count down */}
        <div className="py-4 border-b border-[#DFD7C8] flex items-center justify-between gap-4">
          <span className="font-sans font-medium text-[0.9375rem] text-[#3B3732]">
            {COPY.settings.timerMode}
          </span>
          <div className="inline-flex border border-[#DFD7C8] p-0.5 bg-[#ECE6DA]">
            <button
              type="button"
              onClick={() => updateSettings({ timerMode: 'up' })}
              className={`px-3 py-1.5 font-sans text-xs font-medium transition-colors select-none ${
                settings.timerMode === 'up'
                  ? 'bg-[#1B1916] text-[#FFFFFF]'
                  : 'text-[#3B3732] hover:text-[#1B1916]'
              }`}
            >
              {COPY.settings.timerCountUp}
            </button>
            <button
              type="button"
              onClick={() => updateSettings({ timerMode: 'down' })}
              className={`px-3 py-1.5 font-sans text-xs font-medium transition-colors select-none ${
                settings.timerMode === 'down'
                  ? 'bg-[#1B1916] text-[#FFFFFF]'
                  : 'text-[#3B3732] hover:text-[#1B1916]'
              }`}
            >
              {COPY.settings.timerCountDown}
            </button>
          </div>
        </div>

        {/* Units: Minutes / Minutes and seconds */}
        <div className="py-4 border-b border-[#DFD7C8] flex items-center justify-between gap-4">
          <span className="font-sans font-medium text-[0.9375rem] text-[#3B3732]">
            {COPY.settings.units}
          </span>
          <div className="inline-flex border border-[#DFD7C8] p-0.5 bg-[#ECE6DA]">
            <button
              type="button"
              onClick={() => updateSettings({ units: 'min' })}
              className={`px-3 py-1.5 font-sans text-xs font-medium transition-colors select-none ${
                settings.units === 'min'
                  ? 'bg-[#1B1916] text-[#FFFFFF]'
                  : 'text-[#3B3732] hover:text-[#1B1916]'
              }`}
            >
              {COPY.settings.unitsMin}
            </button>
            <button
              type="button"
              onClick={() => updateSettings({ units: 'minsec' })}
              className={`px-3 py-1.5 font-sans text-xs font-medium transition-colors select-none ${
                settings.units === 'minsec'
                  ? 'bg-[#1B1916] text-[#FFFFFF]'
                  : 'text-[#3B3732] hover:text-[#1B1916]'
              }`}
            >
              {COPY.settings.unitsMinSec}
            </button>
          </div>
        </div>

        {/* Reduce motion */}
        <div className="py-4 border-b border-[#DFD7C8] flex items-center justify-between gap-4">
          <span className="font-sans font-medium text-[0.9375rem] text-[#3B3732]">
            {COPY.settings.reduceMotion}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={settings.reduceMotion}
            onClick={() => updateSettings({ reduceMotion: !settings.reduceMotion })}
            className={`w-12 h-6 border transition-colors relative flex items-center px-0.5 focus-visible:outline-2 focus-visible:outline-[#B85A3C] ${
              settings.reduceMotion
                ? 'bg-[#B85A3C] border-[#B85A3C]'
                : 'bg-[#ECE6DA] border-[#DFD7C8]'
            }`}
          >
            <span
              className={`w-4 h-4 bg-white transition-transform ${
                settings.reduceMotion ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* About Xoom */}
        <div className="py-4 border-b border-[#DFD7C8] flex flex-col space-y-1">
          <span className="font-sans font-medium text-[0.9375rem] text-[#3B3732]">
            {COPY.settings.about}
          </span>
          <p className="font-sans text-xs text-[#78716A] leading-relaxed">
            {COPY.settings.aboutText}
          </p>
        </div>

        {/* Clear all data */}
        <div className="py-5">
          {showClearConfirm ? (
            <div className="flex items-center gap-4 bg-[#ECE6DA] p-3 rounded-lg border border-[#DFD7C8]">
              <span className="font-sans text-xs text-[#1B1916]">
                Reset and erase all logs?
              </span>
              <button
                type="button"
                onClick={handleClear}
                className="font-sans font-semibold text-xs uppercase tracking-wider text-[#B85A3C] hover:text-[#98442A] p-2"
              >
                {COPY.settings.confirmClear}
              </button>
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="font-sans text-xs uppercase tracking-wider text-[#78716A] hover:text-[#1B1916] p-2"
              >
                {COPY.settings.cancelClear}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="font-sans font-semibold text-xs uppercase tracking-wider text-[#B85A3C] hover:text-[#98442A] p-2 -ml-2 min-h-[44px] flex items-center focus-visible:outline-2 focus-visible:outline-[#B85A3C]"
            >
              {COPY.settings.clearData}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
