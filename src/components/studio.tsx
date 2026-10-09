import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { type Course, type Lesson, REQUIRES } from "@/lib/curriculum";
import { courseMarkdown } from "@/lib/archive";
import { lessonKey, useStudio } from "@/lib/progress";
import { downloadBlob } from "@/lib/zip";
import { LabStage } from "@/components/labs";
import { Seminar } from "@/components/seminar";
import { Button } from "@/components/ui";

const TABS = [
  { id: "lecture", label: "Lecture" },
  { id: "slides", label: "Slides" },
  { id: "notes", label: "Notes" },
  { id: "lab", label: "Lab" },
  { id: "shelf", label: "Shelf" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function Lecture({ courseId, lesson }: { courseId: string; lesson: Lesson }) {
  return <Seminar courseId={courseId} lesson={lesson} />;
}

function Slides({ lesson }: { lesson: Lesson }) {
  const [index, setIndex] = useState(0);
  const slide = lesson.slides[index];
  return (
    <div className="border border-line bg-panel px-4 py-6 md:px-8 md:py-8">
      <p className="font-mono text-xs text-brass">
        {slide.kicker} / {String(lesson.slides.length).padStart(2, "0")}
      </p>
      <h3 className="mt-3 max-w-3xl font-serif text-3xl leading-tight">{slide.title}</h3>
      <ul className="mt-6 max-w-2xl space-y-3 text-lg leading-relaxed">
        {slide.points.map((point) => (
          <li key={point} className="border-l border-brass pl-4">
            {point}
          </li>
        ))}
      </ul>
      {slide.formula ? (
        <p className="mt-6 overflow-x-auto border border-line bg-ink px-3 py-3 font-mono text-sm text-brass">{slide.formula}</p>
      ) : null}
      <div className="mt-8 flex gap-2">
        <Button type="button" tone="ghost" disabled={index === 0} onClick={() => setIndex((value) => value - 1)}>
          Previous
        </Button>
        <Button
          type="button"
          disabled={index === lesson.slides.length - 1}
          onClick={() => setIndex((value) => value + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function Notes({ course, lesson }: { course: Course; lesson: Lesson }) {
  return (
    <article className="bg-cream px-5 py-6 text-ink md:px-8">
      <p className="font-mono text-xs text-ink-soft">
        Handout · {course.code} · {lesson.title}
      </p>
      {lesson.notes.map((note) => (
        <section key={note.heading} className="mt-6">
          <h3 className="font-serif text-2xl leading-tight">{note.heading}</h3>
          {note.body.map((paragraph) => (
            <p key={paragraph} className="mt-3 max-w-2xl leading-relaxed">
              {paragraph}
            </p>
          ))}
          {note.formula ? (
            <p className="mt-3 overflow-x-auto border border-ink bg-ink px-3 py-3 font-mono text-sm text-brass">{note.formula}</p>
          ) : null}
        </section>
      ))}
    </article>
  );
}

export function Studio({ course }: { course: Course }) {
  const [lessonIndex, setLessonIndex] = useState(0);
  const [tab, setTab] = useState<TabId>("lecture");
  const lesson = course.lessons[lessonIndex] ?? course.lessons[0];
  const done = useStudio((state) => state.done);
  const toggle = useStudio((state) => state.toggleLesson);
  const key = lessonKey(course.id, lesson.id);
  const complete = done.includes(key);
  const finishedCount = course.lessons.filter((item) => done.includes(lessonKey(course.id, item.id))).length;

  return (
    <div className="grid gap-6 md:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="min-w-0">
        <Link to="/" className="inline-flex min-h-11 items-center gap-1 font-mono text-sm text-brass">
          <ChevronLeft className="size-4" />
          Ledger
        </Link>
        <p className="mt-2 font-mono text-xs text-mist">
          {finishedCount}/{course.lessons.length} boards
        </p>
        <ol className="mt-3 flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
          {course.lessons.map((item, index) => {
            const on = done.includes(lessonKey(course.id, item.id));
            return (
              <li key={item.id} className="shrink-0 md:shrink">
                <button
                  type="button"
                  onClick={() => setLessonIndex(index)}
                  className={`min-h-11 w-full border px-3 py-2 text-left ${index === lessonIndex ? "border-brass" : "border-line"}`}
                >
                  <span className="block font-mono text-xs text-brass">
                    {on ? "Done" : `0${index + 1}`} · {item.minutes}m
                  </span>
                  <span className="mt-1 block font-serif text-base leading-tight">{item.title}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </aside>
      <div className="min-w-0">
        <p className="font-mono text-xs text-brass">
          {course.semester === 0
            ? `${course.code} · standing · not counted in the 36`
            : `${course.code} · semester ${course.semester} · ${course.credits} credits`}
        </p>
        {REQUIRES[course.id]?.length ? (
          <p className="mt-2 font-mono text-xs text-mist">Draws on: {REQUIRES[course.id].join(", ")}</p>
        ) : null}
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <h1 className="max-w-3xl font-serif text-3xl leading-tight md:text-4xl">{course.title}</h1>
          <Button type="button" tone={complete ? "ghost" : "primary"} onClick={() => toggle(key, course.id)}>
            {complete ? "Mark incomplete" : "Mark board complete"}
          </Button>
        </div>
        <p className="mt-3 max-w-2xl text-mist">{course.blurb}</p>
        <div role="tablist" aria-label="Course surfaces" className="mt-5 flex gap-2 overflow-x-auto">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
              className={`min-h-11 shrink-0 border px-3 font-mono text-sm ${tab === item.id ? "border-brass text-brass" : "border-line text-mist"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="mt-4" role="tabpanel">
          {tab === "lecture" ? <Lecture courseId={course.id} lesson={lesson} /> : null}
          {tab === "slides" ? <Slides key={lesson.id} lesson={lesson} /> : null}
          {tab === "notes" ? <Notes course={course} lesson={lesson} /> : null}
          {tab === "lab" ? <LabStage key={lesson.id} kind={lesson.lab} brief={lesson.labBrief} /> : null}
          {tab === "shelf" ? (
            <div className="space-y-4 border border-line bg-panel p-4 md:p-6">
              <h2 className="font-serif text-2xl">Outcomes</h2>
              <ul className="space-y-2">
                {course.outcomes.map((outcome) => (
                  <li key={outcome} className="border-l border-brass pl-3">
                    {outcome}
                  </li>
                ))}
              </ul>
              <h2 className="pt-2 font-serif text-2xl">Open shelf</h2>
              <ul className="space-y-3">
                {course.readings.map((reading) => (
                  <li key={reading.title}>
                    {reading.href ? (
                      <a href={reading.href} target="_blank" rel="noreferrer" className="text-brass underline">
                        {reading.title}
                      </a>
                    ) : (
                      <p className="text-cream">{reading.title}</p>
                    )}
                    <p className="text-sm text-mist">{reading.detail}</p>
                  </li>
                ))}
              </ul>
              <Button
                type="button"
                tone="ghost"
                onClick={() => downloadBlob(new Blob([courseMarkdown(course)], { type: "text/markdown" }), `${course.id}-handout.md`)}
              >
                Download handout
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
