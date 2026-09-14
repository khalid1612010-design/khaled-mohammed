import type { Metadata } from "next";
import MeetingWizard from "./MeetingWizard";

export const metadata: Metadata = {
  title: "Book a Project Meeting",
  description:
    "Book a free 30-minute project meeting with Wala Khalid. Tell him about your project — no fixed price, just a conversation.",
};

export default function BookMeetingPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 pb-24 pt-28 md:px-8 md:pt-36">
      <MeetingWizard />
    </div>
  );
}
