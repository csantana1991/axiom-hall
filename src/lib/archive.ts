import { MASTER_MD, SYSTEM_MD } from "@/lib/brief";
import { COURSES, DISCLAIMER, PREREQS, PROGRAM, STUDENT, type Course } from "@/lib/curriculum";
import { CPP_SOURCE } from "@/lib/ring-source";
import { zipStore } from "@/lib/zip";

export function courseMarkdown(course: Course): string {
  const lines: string[] = [
    `# ${course.code}: ${course.title}`,
    ``,
    `Student ledger: ${STUDENT}`,
    `Program: ${PROGRAM}`,
    course.semester === 0
      ? "Standing course · not counted in the 36 credits"
      : `Semester ${course.semester} · ${course.credits} credits`,
    ``,
    DISCLAIMER,
    ``,
    course.blurb,
    ``,
    `## Outcomes`,
    ...course.outcomes.map((item) => `- ${item}`),
    ``,
  ];
  for (const lesson of course.lessons) {
    lines.push(`## ${lesson.title}`, ``, lesson.labBrief, ``, `### Board`, ``);
    for (const beat of lesson.beats) {
      lines.push(`- ${beat.t} — ${beat.title}`, ``, beat.body, ``);
    }
    lines.push(`### Slides`, ``);
    for (const slide of lesson.slides) {
      lines.push(`#### ${slide.kicker} ${slide.title}`, ...slide.points.map((point) => `- ${point}`));
      if (slide.formula) lines.push(``, `\`${slide.formula}\``);
      lines.push(``);
    }
    lines.push(`### Notes`, ``);
    for (const note of lesson.notes) {
      lines.push(`#### ${note.heading}`, ...note.body, ``);
      if (note.formula) lines.push(`\`${note.formula}\``, ``);
    }
  }
  lines.push(`## Open shelf`, ``);
  for (const reading of course.readings) {
    lines.push(`- ${reading.title}${reading.href ? ` — ${reading.href}` : ""}`, `  ${reading.detail}`, ``);
  }
  return lines.join("\n");
}

export function studioArchive(): Blob {
  const files = [
    {
      name: "README.md",
      text: [
        `# Axiom Hall archive`,
        ``,
        `${PROGRAM}`,
        `Ledger: ${STUDENT}`,
        ``,
        DISCLAIMER,
        ``,
        `The C++ ring is in code/spsc_ring_buffer.cpp.`,
        ``,
        "```",
        "g++ -O3 -std=c++20 -pthread spsc_ring_buffer.cpp -o spsc_test && ./spsc_test",
        "```",
        ``,
        `A browser timing is not a nanosecond measurement.`,
        ``,
      ].join("\n"),
    },
    { name: "SYSTEM_INSTRUCTIONS.md", text: SYSTEM_MD },
    { name: "MASTER_PROMPT.md", text: MASTER_MD },
    {
      name: "CURRICULUM.md",
      text: [...PREREQS, ...COURSES].map((course) => courseMarkdown(course)).join("\n\n---\n\n"),
    },
    { name: "code/spsc_ring_buffer.cpp", text: CPP_SOURCE },
    ...PREREQS.map((course) => ({
      name: `standing/${course.id}/handout.md`,
      text: courseMarkdown(course),
    })),
    ...COURSES.map((course) => ({
      name: `semester-${course.semester}/${course.id}/handout.md`,
      text: courseMarkdown(course),
    })),
  ];
  return zipStore(files);
}
