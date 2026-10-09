import { createFileRoute, Link } from "@tanstack/react-router";
import { Studio } from "@/components/studio";
import { getCourse } from "@/lib/curriculum";

export const Route = createFileRoute("/course/$courseId")({
  component: CoursePage,
  head: ({ params }) => {
    const course = getCourse(params.courseId);
    return {
      meta: [{ title: course ? `${course.code} · Axiom Hall` : "Axiom Hall" }],
    };
  },
});

function CoursePage() {
  const { courseId } = Route.useParams();
  const course = getCourse(courseId);
  if (!course) {
    return (
      <div className="py-8">
        <h1 className="font-serif text-3xl leading-tight">That course is not on the ledger.</h1>
        <Link to="/" className="mt-4 inline-flex min-h-11 items-center font-mono text-sm text-brass">
          Back to the studio
        </Link>
      </div>
    );
  }
  return <Studio course={course} />;
}
