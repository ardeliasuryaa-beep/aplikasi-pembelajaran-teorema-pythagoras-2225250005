import { useSyncExternalStore } from 'react';

export type ActivityId = 'prerequisite' | 'recognize' | 'learn' | 'practice';
export type ActivityProgress = Record<ActivityId, boolean>;

const STORAGE_KEY = 'pythagoras-activity-progress';
const EMPTY_PROGRESS: ActivityProgress = {
  prerequisite: false,
  recognize: false,
  learn: false,
  practice: false,
};

let progress = EMPTY_PROGRESS;
let initialized = false;
const listeners = new Set<() => void>();

function initialize() {
  if (initialized) return;
  initialized = true;

  try {
    const stored = globalThis.localStorage?.getItem(STORAGE_KEY);
    if (!stored) return;
    const parsed: unknown = JSON.parse(stored);
    if (typeof parsed !== 'object' || parsed === null) return;
    const storedProgress = parsed as Record<string, unknown>;

    progress = {
      prerequisite: storedProgress.prerequisite === true,
      recognize: storedProgress.recognize === true,
      learn: storedProgress.learn === true,
      practice: storedProgress.practice === true,
    };
  } catch {
    console.warn('Kemajuan tidak dapat dibaca dari penyimpanan perangkat.');
  }
}

function getSnapshot() {
  initialize();
  return progress;
}

function getServerSnapshot() {
  return EMPTY_PROGRESS;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useActivityProgress() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function completeActivity(activity: ActivityId) {
  initialize();
  if (progress[activity]) return;

  progress = { ...progress, [activity]: true };
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    console.warn('Kemajuan tidak dapat disimpan di perangkat ini.');
  }

  listeners.forEach((listener) => listener());
}
