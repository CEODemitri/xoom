import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { COPY } from '../constants/content';
import { useStore } from '../store/useStore';
import { Button } from '../components/primitives/Buttons';
import { ChevronLeft } from '../components/icons';

export const LogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { sessionLogs, workouts, updateSessionNote, deleteSessionLog } = useStore();

  const log = sessionLogs.find((l) => l.id === id);

  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState(log?.note || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!log) {
    return (
      <div className="py-12 text-center space-y-4">
        <p className="font-sans text-sm text-[#78716A]">Session log not found.</p>
        <button
          type="button"
          onClick={() => navigate('/you')}
          className="font-sans text-xs uppercase tracking-wider text-[#1B1916] underline"
        >
          {COPY.logDetail.back}
        </button>
      </div>
    );
  }

  const dateObj = new Date(log.date);
  const formattedDate = format(dateObj, 'EEEE, MMMM d, yyyy');
  const minutes = Math.floor(log.durationSec / 60);
  const seconds = log.durationSec % 60;
  const durationText =
    minutes > 0 ? `${minutes}m ${seconds > 0 ? `${seconds}s` : ''}`.trim() : `${seconds}s`;

  const workoutNames = log.workoutIds
    .map((wId) => workouts.find((w) => w.id === wId)?.name)
    .filter(Boolean);

  const handleSaveNote = () => {
    updateSessionNote(log.id, noteDraft.trim());
    setIsEditingNote(false);
  };

  const handleDelete = () => {
    deleteSessionLog(log.id);
    navigate('/you', { replace: true });
  };

  return (
    <div className="flex flex-col space-y-8 max-w-[560px]">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 font-sans text-xs uppercase tracking-wider text-[#78716A] hover:text-[#1B1916] p-1 -ml-1 focus-visible:outline-2 focus-visible:outline-[#B85A3C]"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          <span>{COPY.logDetail.back}</span>
        </button>
      </div>

      {/* Date */}
      <div>
        <span className="font-sans font-semibold text-[0.6875rem] uppercase tracking-[0.12em] text-[#78716A]">
          {COPY.logDetail.date}
        </span>
        <h1 className="font-serif font-semibold text-2xl md:text-3xl text-[#1B1916] mt-1">
          {formattedDate}
        </h1>
      </div>

      {/* Duration */}
      <div>
        <span className="font-sans font-semibold text-[0.6875rem] uppercase tracking-[0.12em] text-[#78716A]">
          {COPY.logDetail.duration}
        </span>
        <p className="font-mono text-xl text-[#1B1916] mt-1 tabular-nums">
          {durationText}
        </p>
      </div>

      {/* Workouts (Hide if just-timer session) */}
      {workoutNames.length > 0 && (
        <div>
          <span className="font-sans font-semibold text-[0.6875rem] uppercase tracking-[0.12em] text-[#78716A]">
            {COPY.logDetail.workouts}
          </span>
          <ol className="mt-2 space-y-1.5 list-decimal list-inside font-sans text-sm text-[#3B3732]">
            {workoutNames.map((name, i) => (
              <li key={i}>{name}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Effort (Hide if not set) */}
      {log.effort && (
        <div>
          <span className="font-sans font-semibold text-[0.6875rem] uppercase tracking-[0.12em] text-[#78716A]">
            {COPY.logDetail.effort}
          </span>
          <div className="flex items-center gap-2 mt-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <span
                key={level}
                className={`w-3 h-3 rounded-full ${
                  level <= log.effort! ? 'bg-[#B85A3C]' : 'bg-[#DFD7C8]'
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      )}

      {/* Note */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-sans font-semibold text-[0.6875rem] uppercase tracking-[0.12em] text-[#78716A]">
            {COPY.logDetail.note}
          </span>
          {!isEditingNote && (
            <button
              type="button"
              onClick={() => {
                setNoteDraft(log.note || '');
                setIsEditingNote(true);
              }}
              className="font-sans text-xs uppercase tracking-wider text-[#78716A] hover:text-[#1B1916]"
            >
              {COPY.logDetail.editNote}
            </button>
          )}
        </div>

        {isEditingNote ? (
          <div className="space-y-3">
            <input
              type="text"
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              className="w-full bg-[#ECE6DA] border border-[#DFD7C8] rounded-lg px-4 py-2.5 font-sans text-sm text-[#1B1916] focus:outline-none focus:border-[#B85A3C]"
            />
            <div className="flex items-center gap-3">
              <Button variant="primary" onClick={handleSaveNote} className="px-4 py-2">
                {COPY.logDetail.saveNote}
              </Button>
              <button
                type="button"
                onClick={() => setIsEditingNote(false)}
                className="font-sans text-xs uppercase tracking-wider text-[#78716A] hover:text-[#1B1916] px-2 py-2"
              >
                {COPY.logDetail.cancelEdit}
              </button>
            </div>
          </div>
        ) : log.note ? (
          <p className="font-sans text-sm text-[#3B3732] leading-relaxed bg-[#ECE6DA] border border-[#DFD7C8] p-3 rounded-lg">
            {log.note}
          </p>
        ) : (
          <p className="font-sans text-xs text-[#78716A] italic">No note added.</p>
        )}
      </div>

      {/* Delete Action: Inline confirm row — no modal! */}
      <div className="pt-8 border-t border-[#DFD7C8]">
        {showDeleteConfirm ? (
          <div className="flex items-center gap-4 bg-[#ECE6DA] p-3 rounded-lg border border-[#DFD7C8]">
            <span className="font-sans text-xs text-[#1B1916]">Delete this log?</span>
            <button
              type="button"
              onClick={handleDelete}
              className="font-sans font-semibold text-xs uppercase tracking-wider text-[#B85A3C] hover:text-[#98442A] p-2"
            >
              {COPY.logDetail.confirmDelete}
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="font-sans text-xs uppercase tracking-wider text-[#78716A] hover:text-[#1B1916] p-2"
            >
              {COPY.logDetail.cancelDelete}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="font-sans font-semibold text-xs uppercase tracking-wider text-[#B85A3C] hover:text-[#98442A] p-2 min-h-[44px] flex items-center focus-visible:outline-2 focus-visible:outline-[#B85A3C]"
          >
            {COPY.logDetail.delete}
          </button>
        )}
      </div>
    </div>
  );
};
