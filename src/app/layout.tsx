import type { Metadata } from "next";
import { Syne, Space_Grotesk, Cairo } from "next/font/google";
import "./globals.css";
import { Nav, Footer } from "@/components/chrome";
import { ScrollProgress, PageFade } from "@/components/motionx";
import { getSetting } from "@/lib/server";
import { getLang } from "@/i18n/lang";

const syne = Syne({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-syne", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo", display: "swap" });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL("https://walakhalid.design"),
  title: {
    default: "Wala Khalid — Motion Designer | ولاء خالد — مصمم موشن",
    template: "%s — Wala Khalid",
  },
  description:
    "Wala Khalid is a motion designer crafting brand motion systems, launch films, explainer videos and social-first content. Book a project meeting or a private motion design course.",
  keywords: [
    "motion designer", "مصمم موشن", "motion graphics", "موشن جرافيك", "After Effects",
    "3D animation", "explainer video", "freelance", "motion design course", "كورس موشن ديزاين",
  ],
  openGraph: {
    title: "Wala Khalid — Motion Designer | ولاء خالد — مصمم موشن",
    description: "I design in motion. Brand motion systems, launch films, explainers and feeds that stop the scroll.",
    url: "https://walakhalid.design",
    siteName: "Wala Khalid",
    images: [{ url: "/images/hero.jpg", width: 1200, height: 630, alt: "Wala Khalid — Motion Designer" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wala Khalid — Motion Designer",
    description: "Brand motion systems, launch films, explainers and social-first content.",
    images: ["/images/hero.jpg"],
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { ar, s } = await getLang();
  const socials = await getSetting<any>("socials", { email: "hello@walakhalid.design" });

  return (
    <html
      lang={ar ? "ar" : "en"}
      dir={ar ? "rtl" : "ltr"}
      className={`${syne.variable} ${grotesk.variable} ${cairo.variable} ${ar ? "ar" : ""}`}
    >
      <body className="noise antialiased">
        <ScrollProgress />
        <Nav ar={ar} nav={s.nav} brandName={ar ? s.name : "WALA KHALID"} />
        <main className="min-h-screen">
          <PageFade>{children}</PageFade>
        </main>
        <Footer ar={ar} f={s.footer} brandName={ar ? s.name : "Wala Khalid"} socials={socials} />
      </body>
    </html>
  );
}
