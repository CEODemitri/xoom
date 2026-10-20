export interface Workout {
  id: string;
  name: string;
  bodyArea: ('Upper' | 'Lower' | 'Core' | 'Full Body')[];
  equipment: ('None' | 'Dumbbell' | 'Barbell' | 'Kettlebell' | 'Mat')[];
  durationMin: number | null;
}

export interface SessionLog {
  id: string;
  date: string; // ISO string
  durationSec: number;
  mode: 'built' | 'timer';
  workoutIds: string[];
  effort: 1 | 2 | 3 | 4 | 5 | null;
  note: string | null;
}

export interface MindLog {
  id: string;
  date: string; // ISO string
  type: 'breathe' | 'pause' | 'check-in';
  durationSec: number | null;
  mood: 1 | 2 | 3 | 4 | 5 | null;
  note: string | null;
}

export interface EatMealNote {
  id: string;
  date: string; // ISO string
  text: string;
}

export interface Settings {
  timerMode: 'up' | 'down';
  units: 'min' | 'minsec';
  reduceMotion: boolean;
}

export interface ActiveSession {
  mode: 'built' | 'timer';
  workoutIds: string[];
  targetDurationSec: number; // 0 if untimed
  elapsedSec: number;
  currentWorkoutIndex: number;
  isPaused: boolean;
  startedAt: string; // ISO string
  lastTickTimestamp: number;
}
