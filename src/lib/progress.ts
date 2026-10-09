import { create } from "zustand";

const KEY = "axiom-hall-ledger-v1";

export type Ledger = {
  done: string[];
  last: string | null;
  defense: string[];
};

type StudioState = Ledger & {
  hydrated: boolean;
  hydrate: () => void;
  toggleLesson: (key: string, courseId: string) => void;
  toggleDefense: (id: string) => void;
  reset: () => void;
};

const empty: Ledger = { done: [], last: null, defense: [] };

function read(): Ledger {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<Ledger>;
    return {
      done: Array.isArray(parsed.done) ? parsed.done.filter((x) => typeof x === "string") : [],
      last: typeof parsed.last === "string" ? parsed.last : null,
      defense: Array.isArray(parsed.defense) ? parsed.defense.filter((x) => typeof x === "string") : [],
    };
  } catch {
    return empty;
  }
}

function write(ledger: Ledger) {
  localStorage.setItem(KEY, JSON.stringify(ledger));
}

export const useStudio = create<StudioState>((set, get) => ({
  ...empty,
  hydrated: false,
  hydrate: () => {
    if (get().hydrated || typeof window === "undefined") return;
    set({ ...read(), hydrated: true });
  },
  toggleLesson: (key, courseId) => {
    const curr = get();
    const done = curr.done.includes(key) ? curr.done.filter((item) => item !== key) : [...curr.done, key];
    const next = { done, last: courseId, defense: curr.defense };
    write(next);
    set(next);
  },
  toggleDefense: (id) => {
    const curr = get();
    const defense = curr.defense.includes(id)
      ? curr.defense.filter((item) => item !== id)
      : [...curr.defense, id];
    const next = { done: curr.done, last: curr.last, defense };
    write(next);
    set({ defense });
  },
  reset: () => {
    write(empty);
    set(empty);
  },
}));

export function lessonKey(courseId: string, lessonId: string) {
  return `${courseId}:${lessonId}`;
}
