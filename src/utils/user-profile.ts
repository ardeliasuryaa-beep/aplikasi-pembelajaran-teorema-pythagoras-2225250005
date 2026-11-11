import { useSyncExternalStore } from 'react';

export type UserProfile = {
  name: string;
  started: boolean;
};

const STORAGE_KEY = 'pythagoras-user-profile';
const EMPTY_PROFILE: UserProfile = { name: '', started: false };

let profile = EMPTY_PROFILE;
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
    const saved = parsed as Record<string, unknown>;

    profile = {
      name: typeof saved.name === 'string' ? saved.name : '',
      started: saved.started === true,
    };
  } catch {
    console.warn('Profil belajar tidak dapat dibaca dari penyimpanan perangkat.');
  }
}

function getSnapshot() {
  initialize();
  return profile;
}

function getServerSnapshot() {
  return EMPTY_PROFILE;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function persist() {
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    console.warn('Profil belajar tidak dapat disimpan di perangkat ini.');
  }
}

function updateProfile(nextProfile: UserProfile) {
  initialize();
  if (profile.name === nextProfile.name && profile.started === nextProfile.started) return;
  profile = nextProfile;
  persist();
  listeners.forEach((listener) => listener());
}

export function useUserProfile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function saveUserName(name: string) {
  initialize();
  updateProfile({ ...profile, name });
}

export function markLearningStarted() {
  initialize();
  updateProfile({ ...profile, started: true });
}
