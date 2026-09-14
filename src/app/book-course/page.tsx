import type { Metadata } from "next";
import BookingWizard from "./BookingWizard";

export const metadata: Metadata = {
  title: "Book a Private Course",
  description:
    "Book a live, private motion design course with Wala Khalid — solo or up to 5 students, with flexible group pricing and your own schedule.",
};

export default function BookCoursePage() {
  return (
    <div className="mx-auto max-w-5xl px-5 pb-24 pt-28 md:px-8 md:pt-36">
      <BookingWizard />
    </div>
  );
}
