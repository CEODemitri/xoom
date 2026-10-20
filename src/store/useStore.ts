import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Workout,
  SessionLog,
  MindLog,
  EatMealNote,
  Settings,
  ActiveSession,
} from '../types';
import { WORKOUT_POOL_SEED } from '../constants/content';

interface AppState {
  // Workouts
  workouts: Workout[];
  selectedWorkoutIds: string[];
  toggleWorkoutSelection: (id: string) => void;
  clearSelectedWorkouts: () => void;

  // Active Session
  activeSession: ActiveSession | null;
  startActiveSession: (mode: 'built' | 'timer', workoutIds: string[], targetDurationSec: number) => void;
  tickActiveSession: () => void;
  togglePauseActiveSession: () => void;
  nextWorkoutInActiveSession: () => void;
  endActiveSession: () => ActiveSession | null;
  discardActiveSession: () => void;

  // Logs
  sessionLogs: SessionLog[];
  addSessionLog: (log: Omit<SessionLog, 'id'>) => string;
  updateSessionNote: (id: string, note: string) => void;
  deleteSessionLog: (id: string) => void;

  // Mind
  mindLogs: MindLog[];
  addMindLog: (log: Omit<MindLog, 'id'>) => string;

  // Eat
  mealNotes: EatMealNote[];
  addMealNote: (text: string) => void;
  deleteMealNote: (id: string) => void;
  waterLogDate: string; // YYYY-MM-DD
  waterCount: number;
  toggleWaterCircle: (index: number) => void;

  // Settings
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  clearAllData: () => void;

  // Derived helpers
  getStreak: () => number;
  getTotalTimeSec: () => number;
  hasLogOnDate: (dateStr: string) => boolean; // YYYY-MM-DD
}

const getTodayDateStr = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

// Seed initial logs for authentic first impression if empty
const createInitialSessionLogs = (): SessionLog[] => {
  const now = new Date();
  const d1 = new Date(now);
  d1.setDate(d1.getDate() - 1);
  d1.setHours(9, 30, 0, 0);

  const d2 = new Date(now);
  d2.setDate(d2.getDate() - 2);
  d2.setHours(17, 15, 0, 0);

  return [
    {
      id: 'seed-log-1',
      date: d1.toISOString(),
      durationSec: 15 * 60,
      mode: 'built',
      workoutIds: ['w-1', 'w-2', 'w-3'],
      effort: 4,
      note: 'Steady pace throughout.',
    },
    {
      id: 'seed-log-2',
      date: d2.toISOString(),
      durationSec: 20 * 60,
      mode: 'timer',
      workoutIds: [],
      effort: 3,
      note: 'Quiet run.',
    },
  ];
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      workouts: WORKOUT_POOL_SEED,
      selectedWorkoutIds: [],

      toggleWorkoutSelection: (id: string) => {
        set((state) => {
          const exists = state.selectedWorkoutIds.includes(id);
          return {
            selectedWorkoutIds: exists
              ? state.selectedWorkoutIds.filter((item) => item !== id)
              : [...state.selectedWorkoutIds, id],
          };
        });
      },

      clearSelectedWorkouts: () => {
        set({ selectedWorkoutIds: [] });
      },

      activeSession: null,

      startActiveSession: (mode, workoutIds, targetDurationSec) => {
        const now = new Date().toISOString();
        set({
          activeSession: {
            mode,
            workoutIds,
            targetDurationSec,
            elapsedSec: 0,
            currentWorkoutIndex: 0,
            isPaused: false,
            startedAt: now,
            lastTickTimestamp: Date.now(),
          },
        });
      },

      tickActiveSession: () => {
        set((state) => {
          if (!state.activeSession || state.activeSession.isPaused) return state;
          const current = state.activeSession;
          const nextElapsed = current.elapsedSec + 1;
          return {
            activeSession: {
              ...current,
              elapsedSec: nextElapsed,
              lastTickTimestamp: Date.now(),
            },
          };
        });
      },

      togglePauseActiveSession: () => {
        set((state) => {
          if (!state.activeSession) return state;
          return {
            activeSession: {
              ...state.activeSession,
              isPaused: !state.activeSession.isPaused,
              lastTickTimestamp: Date.now(),
            },
          };
        });
      },

      nextWorkoutInActiveSession: () => {
        set((state) => {
          if (!state.activeSession) return state;
          const maxIdx = state.activeSession.workoutIds.length - 1;
          const nextIdx = Math.min(maxIdx, state.activeSession.currentWorkoutIndex + 1);
          return {
            activeSession: {
              ...state.activeSession,
              currentWorkoutIndex: nextIdx,
            },
          };
        });
      },

      endActiveSession: () => {
        const current = get().activeSession;
        set({ activeSession: null, selectedWorkoutIds: [] });
        return current;
      },

      discardActiveSession: () => {
        set({ activeSession: null });
      },

      sessionLogs: createInitialSessionLogs(),

      addSessionLog: (log) => {
        const id = `session-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const newLog: SessionLog = { ...log, id };
        set((state) => ({
          sessionLogs: [newLog, ...state.sessionLogs],
        }));
        return id;
      },

      updateSessionNote: (id, note) => {
        set((state) => ({
          sessionLogs: state.sessionLogs.map((log) =>
            log.id === id ? { ...log, note } : log
          ),
        }));
      },

      deleteSessionLog: (id) => {
        set((state) => ({
          sessionLogs: state.sessionLogs.filter((log) => log.id !== id),
        }));
      },

      mindLogs: [
        {
          id: 'seed-mind-1',
          date: new Date(Date.now() - 86400000 * 2).toISOString(),
          type: 'breathe',
          durationSec: 180,
          mood: null,
          note: null,
        },
      ],

      addMindLog: (log) => {
        const id = `mind-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const newLog: MindLog = { ...log, id };
        set((state) => ({
          mindLogs: [newLog, ...state.mindLogs],
        }));
        return id;
      },

      mealNotes: [],

      addMealNote: (text: string) => {
        if (!text.trim()) return;
        const newNote: EatMealNote = {
          id: `meal-${Date.now()}`,
          date: new Date().toISOString(),
          text: text.trim(),
        };
        set((state) => ({
          mealNotes: [newNote, ...state.mealNotes],
        }));
      },

      deleteMealNote: (id: string) => {
        set((state) => ({
          mealNotes: state.mealNotes.filter((item) => item.id !== id),
        }));
      },

      waterLogDate: getTodayDateStr(),
      waterCount: 3,

      toggleWaterCircle: (index: number) => {
        const today = getTodayDateStr();
        set((state) => {
          let currentCount = state.waterLogDate === today ? state.waterCount : 0;
          if (index < currentCount) {
            // Tapping an existing filled circle drops to that index
            currentCount = index;
          } else {
            // Tapping an empty circle fills up through index + 1
            currentCount = index + 1;
          }
          return {
            waterLogDate: today,
            waterCount: Math.min(8, Math.max(0, currentCount)),
          };
        });
      },

      settings: {
        timerMode: 'up',
        units: 'min',
        reduceMotion: false,
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      clearAllData: () => {
        set({
          selectedWorkoutIds: [],
          activeSession: null,
          sessionLogs: [],
          mindLogs: [],
          mealNotes: [],
          waterCount: 0,
          waterLogDate: getTodayDateStr(),
        });
      },

      getStreak: () => {
        const { sessionLogs, mindLogs } = get();
        // Collect all unique activity dates in local time (YYYY-MM-DD)
        const activeDates = new Set<string>();

        const addDate = (isoStr: string) => {
          const d = new Date(isoStr);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          activeDates.add(key);
        };

        sessionLogs.forEach((l) => addDate(l.date));
        mindLogs.forEach((l) => addDate(l.date));

        const now = new Date();
        const todayStr = getTodayDateStr();

        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

        // If neither today nor yesterday has a log, streak is 0
        let checkDate = new Date(now);
        if (!activeDates.has(todayStr)) {
          if (activeDates.has(yesterdayStr)) {
            checkDate = yesterday;
          } else {
            return 0;
          }
        }

        let streak = 0;
        while (true) {
          const key = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
          if (activeDates.has(key)) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }

        return streak;
      },

      getTotalTimeSec: () => {
        return get().sessionLogs.reduce((sum, log) => sum + (log.durationSec || 0), 0);
      },

      hasLogOnDate: (dateStr: string) => {
        const { sessionLogs } = get();
        return sessionLogs.some((l) => {
          const d = new Date(l.date);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          return key === dateStr;
        });
      },
    }),
    {
      name: 'xoom-storage-v1',
    }
  )
);
