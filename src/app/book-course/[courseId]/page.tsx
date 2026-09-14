import type { Metadata } from "next";
import BookingWizard from "../BookingWizard";

export const metadata: Metadata = {
  title: "Book a Private Course",
  description:
    "Book a live, private motion design course with Wala Khalid — solo or up to 5 students, with flexible group pricing.",
};

export default async function BookCourseCourseIdPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const n = Number(courseId);
  return (
    <div className="mx-auto max-w-5xl px-5 pb-24 pt-28 md:px-8 md:pt-36">
      <BookingWizard preselect={Number.isFinite(n) ? n : undefined} />
    </div>
  );
}
