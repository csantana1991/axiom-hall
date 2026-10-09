import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MASTER_MD, SYSTEM_MD } from "@/lib/brief";
import { studioArchive } from "@/lib/archive";
import {
  COURSES,
  DISCLAIMER,
  PREREQS,
  SEMESTERS,
  STUDENT,
  courseCreditsDone,
  creditsEarned,
  nextUp,
} from "@/lib/curriculum";
import { useStudio } from "@/lib/progress";
import { downloadBlob } from "@/lib/zip";
import { Button } from "@/components/ui";

function MiniRing() {
  const [step, setStep] = useState(0);
  const [quiet, setQuiet] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setQuiet(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);
  useEffect(() => {
    if (quiet) return;
    const id = window.setInterval(() => setStep((value) => (value + 1) % 8), 900);
    return () => window.clearInterval(id);
  }, [quiet]);
  return (
    <div className="grid grid-cols-8 gap-1" aria-hidden="true">
      {Array.from({ length: 8 }, (_, index) => {
        const head = step % 8;
        const filled = (index - ((step + 5) % 8) + 8) % 8 < 3;
        return (
          <div
            key={index}
            className={`h-10 border ${index === head ? "border-brass bg-brass" : filled ? "border-line bg-raise" : "border-line"}`}
          />
        );
      })}
    </div>
  );
}

export function Dashboard() {
  const done = useStudio((state) => state.done);
  const reset = useStudio((state) => state.reset);
  const [armReset, setArmReset] = useState(false);
  const earned = creditsEarned(done);
  const next = nextUp(done);
  const finished = earned >= 35.9;
  const standingNext =
    PREREQS.find((course) => course.lessons.some((lesson) => !done.includes(`${course.id}:${lesson.id}`))) ??
    PREREQS[0];
  const standingReady = PREREQS.every((course) =>
    course.lessons.every((lesson) => done.includes(`${course.id}:${lesson.id}`)),
  );

  return (
    <div className="space-y-10">
      <section className="grid items-end gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <p className="font-mono text-xs tracking-widest text-brass">SELF-DIRECTED STUDIO · 36 CREDITS</p>
          <h1 className="mt-3 max-w-xl font-serif text-4xl leading-tight md:text-5xl">
            Computational finance, built at the metal.
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-mist">
            Ten degree courses and one lock-free handoff. Six standing courses are open beside them and do not count toward the 36. Ledger name {STUDENT}. Open materials only.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/course/$courseId"
              params={{ courseId: next.course.id }}
              className="inline-flex min-h-11 items-center border border-brass bg-brass px-4 font-mono text-sm text-ink"
            >
              {finished ? "Review the capstone" : `Open ${next.course.code}`}
            </Link>
            <Link
              to="/course/$courseId"
              params={{ courseId: standingNext.id }}
              className="inline-flex min-h-11 items-center border border-line bg-panel px-4 font-mono text-sm text-cream hover:border-brass"
            >
              {standingReady ? "Review standing" : `Standing · ${standingNext.code}`}
            </Link>
            <Button
              type="button"
              tone="ghost"
              onClick={() => downloadBlob(studioArchive(), "AxiomHall_studio_archive.zip")}
            >
              Download archive
            </Button>
          </div>
        </div>
        <div className="min-w-0 border border-line bg-panel p-4">
          <p className="font-mono text-xs text-mist">SPSC RING · PROTOCOL, NOT A CLOCK</p>
          <div className="mt-4">
            <MiniRing />
          </div>
          <dl className="mt-4 grid grid-cols-3 gap-3 font-mono text-sm">
            <div>
              <dt className="text-xs text-mist">Metal target</dt>
              <dd>{">1M / sec"}</dd>
            </div>
            <div>
              <dt className="text-xs text-mist">Handoff</dt>
              <dd>{"<250 ns"}</dd>
            </div>
            <div>
              <dt className="text-xs text-mist">Earned</dt>
              <dd>{earned.toFixed(1)}</dd>
            </div>
          </dl>
          <p className="mt-3 text-sm text-mist">Those targets are for a compiled binary. This page will not pretend to have measured them.</p>
        </div>
      </section>

      {SEMESTERS.map((semester) => {
        const courses = COURSES.filter((course) => course.semester === semester.n);
        const possible = courses.reduce((sum, course) => sum + course.credits, 0);
        const got = courses.reduce((sum, course) => sum + courseCreditsDone(course, done), 0);
        return (
          <section key={semester.n}>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-serif text-2xl leading-tight">
                <span className="mr-2 font-mono text-sm text-brass">0{semester.n}</span>
                {semester.title}
              </h2>
              <p className="font-mono text-xs text-mist">
                {got.toFixed(1)} / {possible}
              </p>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {courses.map((course) => {
                const pct = course.credits === 0 ? 0 : (courseCreditsDone(course, done) / course.credits) * 100;
                return (
                  <Link
                    key={course.id}
                    to="/course/$courseId"
                    params={{ courseId: course.id }}
                    className={`block min-w-0 border border-line bg-panel p-4 hover:border-brass ${
                      course.credits > 3 ? "md:col-span-3" : ""
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-3 font-mono text-xs text-brass">
                      <span>{course.code}</span>
                      <span>{course.credits} CR</span>
                    </div>
                    <h3 className="mt-2 font-serif text-xl leading-tight">{course.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-mist">{course.blurb}</p>
                    <div className="mt-4 h-0.5 bg-line">
                      <div className="h-full bg-brass" style={{ width: `${pct}%` }} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      <section>
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-serif text-2xl leading-tight">
            <span className="mr-2 font-mono text-sm text-brass">00</span>
            Standing, also open
          </h2>
          <p className="font-mono text-xs text-mist">
            {PREREQS.filter((course) => course.lessons.every((lesson) => done.includes(`${course.id}:${lesson.id}`))).length} / {PREREQS.length} ready
          </p>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-mist">
          Not counted in the 36 credits. Open them whenever you want. The degree does not wait.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {PREREQS.map((course) => {
            const finished = course.lessons.filter((lesson) => done.includes(`${course.id}:${lesson.id}`)).length;
            const pct = (finished / course.lessons.length) * 100;
            return (
              <Link
                key={course.id}
                to="/course/$courseId"
                params={{ courseId: course.id }}
                className="block min-w-0 border border-line bg-panel p-4 hover:border-brass"
              >
                <div className="flex items-baseline justify-between gap-3 font-mono text-xs text-brass">
                  <span>{course.code}</span>
                  <span>standing</span>
                </div>
                <h3 className="mt-2 font-serif text-xl leading-tight">{course.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">{course.blurb}</p>
                <div className="mt-4 h-0.5 bg-line">
                  <div className="h-full bg-brass" style={{ width: `${pct}%` }} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-2xl">Faculty brief</h2>
        <details className="border border-line">
          <summary className="min-h-11 px-4 py-3 font-mono text-sm">System instructions</summary>
          <pre className="max-h-80 overflow-auto border-t border-line p-4 font-mono text-sm leading-relaxed text-mist whitespace-pre-wrap">
            {SYSTEM_MD}
          </pre>
        </details>
        <details className="border border-line">
          <summary className="min-h-11 px-4 py-3 font-mono text-sm">Master prompt</summary>
          <pre className="max-h-80 overflow-auto border-t border-line p-4 font-mono text-sm leading-relaxed text-mist whitespace-pre-wrap">
            {MASTER_MD}
          </pre>
        </details>
        <div className="flex flex-wrap gap-2">
          {armReset ? (
            <Button
              type="button"
              tone="ghost"
              onClick={() => {
                reset();
                setArmReset(false);
              }}
            >
              Confirm reset
            </Button>
          ) : (
            <Button type="button" tone="ghost" onClick={() => setArmReset(true)}>
              Reset ledger
            </Button>
          )}
        </div>
        <p className="max-w-3xl text-sm leading-relaxed text-mist">{DISCLAIMER}</p>
      </section>
    </div>
  );
}
