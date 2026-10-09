import { Pause, Play } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { type Lesson } from "@/lib/curriculum";

const WORDS_PER_SECOND = 2.5;

type Cue = { beat: number; text: string; start: number; end: number };

function clock(seconds: number) {
  const whole = Math.max(0, Math.round(seconds));
  const mins = Math.floor(whole / 60);
  const secs = whole % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function sentences(text: string) {
  const bits = text
    .replace(/\s+/g, " ")
    .split(/(?<=[.?!])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
  const cues: string[] = [];
  let current = "";
  for (const bit of bits) {
    const next = current ? `${current} ${bit}` : bit;
    if (next.length > 160 && current) {
      cues.push(current);
      current = bit;
    } else {
      current = next;
    }
  }
  if (current) cues.push(current);
  return cues.length ? cues : [text.trim()];
}

function toCues(blocks: string[]) {
  const cues: Cue[] = [];
  let cursor = 0;
  blocks.forEach((block, beat) => {
    for (const text of sentences(block)) {
      const words = text.split(/\s+/).filter(Boolean).length;
      const span = Math.max(words / WORDS_PER_SECOND, 1.2);
      cues.push({ beat, text, start: cursor, end: cursor + span });
      cursor += span;
    }
  });
  return cues;
}

function parseBlocks(raw: string) {
  const parts = raw.split(/\[\[BEAT\s+\d+\]\]/).map((part) => part.trim()).filter(Boolean);
  return parts;
}

export function Seminar({ courseId, lesson }: { courseId: string; lesson: Lesson }) {
  const [blocks, setBlocks] = useState<string[] | null>(null);
  const [cueIndex, setCueIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const playingRef = useRef(false);
  const elapsedRef = useRef(0);
  const cueRef = useRef(0);
  const originRef = useRef(0);

  const cues = useMemo(() => (blocks ? toCues(blocks) : []), [blocks]);
  const duration = cues.length ? cues[cues.length - 1].end : lesson.minutes * 60;
  const cue = cues[cueIndex];
  const beat = lesson.beats[Math.min(cue?.beat ?? 0, lesson.beats.length - 1)];

  useEffect(() => {
    let cancelled = false;
    setBlocks(null);
    setCueIndex(0);
    setPlaying(false);
    setElapsed(0);
    playingRef.current = false;
    window.speechSynthesis?.cancel();
    fetch(`/lectures/${courseId}-${lesson.id}.txt`)
      .then((response) => (response.ok ? response.text() : ""))
      .then((raw) => {
        if (cancelled) return;
        const parsed = parseBlocks(raw);
        setBlocks(parsed.length ? parsed : lesson.beats.map((item) => item.body));
      })
      .catch(() => {
        if (!cancelled) setBlocks(lesson.beats.map((item) => item.body));
      });
    return () => {
      cancelled = true;
      playingRef.current = false;
      window.speechSynthesis?.cancel();
    };
  }, [courseId, lesson]);

  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const tick = () => {
      if (!playingRef.current) return;
      const now = (performance.now() - originRef.current) / 1000;
      elapsedRef.current = now;
      setElapsed((previous) => (Math.floor(previous) === Math.floor(now) ? previous : now));
      const next = cues.findIndex((item) => now < item.end);
      const index = next === -1 ? cues.length - 1 : next;
      if (index !== cueRef.current) {
        cueRef.current = index;
        setCueIndex(index);
        speak(cues[index]?.text ?? "");
      }
      if (now >= duration) {
        playingRef.current = false;
        setPlaying(false);
        window.speechSynthesis?.cancel();
        return;
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [playing, cues, duration]);

  function speak(text: string) {
    const synth = window.speechSynthesis;
    if (!synth || !text) return;
    try {
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      const voice = synth.getVoices().find((item) => item.lang.toLowerCase().startsWith("en"));
      if (voice) utterance.voice = voice;
      synth.speak(utterance);
    } catch {
      /* The timed board still runs if this browser will not speak. */
    }
  }

  function playFrom(seconds: number) {
    const start = Math.max(0, Math.min(seconds, Math.max(duration - 0.1, 0)));
    const index = Math.max(0, cues.findIndex((item) => start < item.end));
    cueRef.current = index === -1 ? 0 : index;
    setCueIndex(cueRef.current);
    elapsedRef.current = start;
    setElapsed(start);
    originRef.current = performance.now() - start * 1000;
    playingRef.current = true;
    setPlaying(true);
    speak(cues[cueRef.current]?.text ?? "");
  }

  function toggle() {
    if (playingRef.current) {
      playingRef.current = false;
      setPlaying(false);
      window.speechSynthesis?.cancel();
      return;
    }
    playFrom(elapsedRef.current >= duration - 0.4 ? 0 : elapsedRef.current);
  }

  function seekBeat(index: number) {
    const start = cues.find((item) => item.beat === index)?.start ?? 0;
    if (playingRef.current) playFrom(start);
    else {
      elapsedRef.current = start;
      setElapsed(start);
      const cueAt = Math.max(0, cues.findIndex((item) => start < item.end));
      cueRef.current = cueAt === -1 ? 0 : cueAt;
      setCueIndex(cueRef.current);
    }
  }

  return (
    <div className="border border-line bg-panel">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-3 py-2">
        <button
          type="button"
          className="inline-flex min-h-11 items-center gap-2 px-1 font-mono text-sm text-brass"
          onClick={toggle}
        >
          {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          {playing ? "Pause" : "Play seminar"}
        </button>
        <p className="font-mono text-xs text-mist">
          Seminar · {clock(Math.min(elapsed, duration))} / {clock(duration)}
        </p>
      </div>
      <div className="relative bg-ink px-5 pt-6 pb-12 md:px-10 md:pt-10 md:pb-14">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-brass" />
        <p className="font-mono text-xs text-brass">{beat?.t ?? "00:00"}</p>
        <h3 className="mt-3 max-w-3xl font-serif text-2xl leading-tight text-cream md:text-4xl">{beat?.title}</h3>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-cream md:text-xl">{cue?.text ?? "Loading the seminar."}</p>
        <div className="absolute inset-x-5 bottom-4 md:inset-x-10">
          <div className="h-1 bg-line">
            <div className="h-full bg-brass" style={{ width: `${duration ? Math.min(100, (elapsed / duration) * 100) : 0}%` }} />
          </div>
        </div>
      </div>
      <div className="px-4 py-6 md:px-8">
        <p className="max-w-2xl text-lg leading-relaxed">{beat?.body}</p>
      </div>
      <div className="flex gap-2 overflow-x-auto border-t border-line p-3">
        {lesson.beats.map((item, index) => (
          <button
            key={item.t + item.title}
            type="button"
            onClick={() => seekBeat(index)}
            className={`min-h-11 shrink-0 border px-3 font-mono text-xs ${
              (cue?.beat ?? 0) === index ? "border-brass text-brass" : "border-line text-mist"
            }`}
          >
            {item.t}
          </button>
        ))}
      </div>
    </div>
  );
}
