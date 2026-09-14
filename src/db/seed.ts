/* Seed script: npx tsx src/db/seed.ts  (safe to re-run — wipes & reseeds) */
import { db } from "../db/index";
import { projects, clients, testimonials, services, courses, settings } from "./schema";

const V = {
  aurora: "https://videos.pexels.com/video-files/34968397/14813056_1920_1080_30fps.mp4",
  volt: "https://videos.pexels.com/video-files/38724299/16451417_1920_1080_30fps.mp4",
  fable: "https://videos.pexels.com/video-files/4938709/4938709-hd_1920_1080_24fps.mp4",
  momentum: "https://videos.pexels.com/video-files/34101721/14463285_1920_1080_30fps.mp4",
  nova: "https://videos.pexels.com/video-files/36459277/15460092_1920_1080_30fps.mp4",
  kite: "https://videos.pexels.com/video-files/36309877/15399070_1920_1080_30fps.mp4",
  nile: "https://videos.pexels.com/video-files/34839241/14768151_1920_1080_30fps.mp4",
  pulse: "https://videos.pexels.com/video-files/33788365/14347759_3840_2160_60fps.mp4",
};

const IMG = {
  pulse:
    "https://images.pexels.com/photos/2294403/pexels-photo-2294403.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
};

const CV_EN = {
  summary:
    "Motion designer with 8+ years of experience crafting brand motion systems, launch films, explainer videos and social-first content for startups and global brands. I lead the full pipeline — from storyboard and style frames to final delivery — and I teach what I do in private and small-group courses.",
  experience: [
    { role: "Lead Motion Designer", company: "Marble Studio", period: "2021 — 2024", desc: "Led the motion team on 30+ campaigns. Built the studio's animation style guide and mentored 4 junior designers." },
    { role: "Motion Designer", company: "Fable", period: "2019 — 2021", desc: "In-house motion for a fashion e-commerce brand: explainers, campaign cutdowns and a 20-piece social kit per season." },
  ],
  freelance: [
    { role: "Freelance Motion Designer", company: "Self-employed", period: "2018 — Now", desc: "120+ projects for 40+ clients across 12 countries — fintech, gaming, energy, coffee, fitness. Repeat clients make up 60% of the work." },
  ],
  skills: ["Kinetic Typography", "2D & 3D Animation", "Compositing", "Storyboarding", "Art Direction", "Sound Design", "Brand Motion Systems", "Storyboard-to-Screen Pipeline"],
  software: ["Adobe After Effects", "Adobe Premiere Pro", "Adobe Illustrator", "Adobe Photoshop", "Cinema 4D", "Blender", "DaVinci Resolve", "Rive", "Duik", "ZBrush"],
  education: [{ title: "BFA — Visual Communication Design", place: "Helwan University", period: "2014 — 2018" }],
  certifications: [
    { title: "After Effects — Masterclass", place: "School of Motion", period: "2020" },
    { title: "Cinema 4D — From Cinema to Product", place: "School of Motion", period: "2022" },
    { title: "Adobe Certified Professional — Design & Visual Communications", place: "Adobe", period: "2019" },
  ],
  languages: [
    { name: "Arabic", level: "Native" },
    { name: "English", level: "Fluent" },
    { name: "German", level: "Basic" },
  ],
  pdfUrl: "",
};

const CV_AR = {
  summary:
    "مصمم موشن بخبرة تزيد عن 8 سنين في بناء أنظمة هوية متحركة، أفلام إطلاق، فيديوهات توضيحية، ومحتوى سوشيال لشركات ناشئة وعلامات عالمية. بدير العملية كاملة — من الـ storyboard والـ style frames للتسليم النهائي — وبعلم اللي بعمله في كورسات فردية ومجموعات صغيرة.",
  experience: [
    { role: "رئيس فريق الموشن", company: "Marble Studio", period: "2021 — 2024", desc: "قُدت فريق الموشن في أكتر من 30 حملة. بنيت دليل أنيميشن الاستوديو ودرّبت 4 مصممين جدد." },
    { role: "مصمم موشن", company: "Fable", period: "2019 — 2021", desc: "موشن داخلي لماركة موضة e-commerce: فيديوهات توضيحية، قصّات الحملات، و20 قطعة سوشيال في كل موسم." },
  ],
  freelance: [
    { role: "مصمم موشن فريلانسر", company: "حسابي الخاص", period: "2018 — الآن", desc: "120+ مشروع لـ40+ عميل في 12 دولة — fintech، جيمز، طاقة، قهوة، فتنس. العملاء المتكررين بيمثلوا 60% من الشغل." },
  ],
  skills: ["حروف متحركة", "أنيميشن 2D و3D", "كومبوزينج", "Storyboard", "إدارة فنية", "صوت", "أنظمة هوية متحركة", "من السكتش للشاشة"],
  software: ["After Effects", "Premiere Pro", "Illustrator", "Photoshop", "Cinema 4D", "Blender", "DaVinci Resolve", "Rive", "Duik", "ZBrush"],
  education: [{ title: "بكالوريوس — تصميم اتصالات بصرية", place: "جامعة حلوان", period: "2014 — 2018" }],
  certifications: [
    { title: "After Effects — Masterclass", place: "School of Motion", period: "2020" },
    { title: "Cinema 4D — From Cinema to Product", place: "School of Motion", period: "2022" },
    { title: "Adobe Certified Professional — Design & Visual Communications", place: "Adobe", period: "2019" },
  ],
  languages: [
    { name: "العربية", level: "اللغة الأم" },
    { name: "الإنجليزية", level: "طلاقة" },
    { name: "الألمانية", level: "مبسط" },
  ],
  pdfUrl: "",
};

async function main() {
  await db.delete(projects);
  await db.delete(clients);
  await db.delete(testimonials);
  await db.delete(services);
  await db.delete(courses);
  await db.delete(settings);

  await db.insert(projects).values([
    {
      title: "Aurora Identity in Motion",
      titleAr: "هوية Aurora في حركة",
      slug: "aurora-identity-in-motion",
      cover: "/images/work-aurora.jpg",
      video: V.aurora,
      client: "Aurora Labs",
      category: "Branding Motion",
      year: 2025,
      tools: "After Effects, Cinema 4D, Illustrator",
      featured: true,
      sortOrder: 1,
      description:
        "A full kinetic identity system for Aurora Labs — a fintech startup building payment tools for creators. The 24-year logo mark, wordmark and monogram were broken down into a motion language: custom easing, 3D chrome builds and a set of 12 logo animations for every touchpoint from app splash to conference backdrop.\n\nThe system now powers product launches, investor decks and event screens, and cut brand recall in our follow-up research by half.",
      descriptionAr:
        "نظام هوية حركي كامل لـ Aurora Labs — شركة fintech بتبني أدوات دفع للمبدعين. الـ logo والـ wordmark والـ monogram اتحولت لـ\"لغة حركة\": easing مخصص، بناء 3D كروم، ومجموعة 12 أنيميشن لوجو لكل نقطة تفاعل من شاشة الـ app لستائر المؤتمرات.\n\nالنظام دلوقتي بيخدم إطلاق المنتجات وعروض المستثمرين وشاشات الفعاليات، ونصّ نسبة تذكّر الماركة في الأبحاث التتبعية.",
      media: [
        { type: "image", url: "https://images.pexels.com/videos/34968397/pexels-photo-34968397.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200", caption: "Keyframe — logo morph" },
        { type: "video", url: V.aurora, caption: "System in action (10s loop)" },
      ],
    },
    {
      title: "Volt EV — Launch Film",
      titleAr: "Volt EV — فيلم الإطلاق",
      slug: "volt-ev-launch-film",
      cover: "/images/work-volt.jpg",
      video: V.volt,
      client: "Terra Energy",
      category: "Advertisements",
      year: 2024,
      tools: "Cinema 4D, Redshift, After Effects, Houdini (FX sim)",
      featured: true,
      sortOrder: 2,
      description:
        "The 45-second launch film for the Volt EV line — a mix of photoreal 3D car builds, procedural light-trail FX and a kinetic-type outro that carried the tagline to screen. Produced with the brand team for paid social, press kits and the launch event.\n\nThe film ran across YouTube, Meta and out-of-home screens for 6 weeks and became the top-performing asset of the entire launch campaign.",
      descriptionAr:
        "فيلم إطلاق 45 ثانية لسلسلة Volt EV — مزيج من بناءات 3D واقعية للكرسي، مؤثرات light-trail إجرائية، وخاتمة حروف متحركة حملت الشعار على الشاشة. اتعمل مع فريق الماركة للسوشيال المدفوع وملفات الصحافة وفعلية الإطلاق.\n\nالفيلم اشتغل على يوتيوب وMeta والشاشات الخارجية 6 أسابيع، وقعد أكتر asset أداءً في الحملة كلها.",
      media: [
        { type: "video", url: V.volt, caption: "Launch film (loop)" },
        { type: "image", url: "https://images.pexels.com/videos/38724299/pexels-photo-38724299.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200", caption: "Light-trail FX test" },
      ],
    },
    {
      title: "Fable — How It Works",
      titleAr: "Fable — إيه اللي بيعمله",
      slug: "fable-how-it-works",
      cover: "/images/work-fable.jpg",
      video: V.fable,
      client: "Fable",
      category: "Explainer Videos",
      year: 2024,
      tools: "After Effects, Illustrator, Premiere Pro",
      featured: true,
      sortOrder: 3,
      description:
        "A 90-second 2D explainer for Fable, a fashion e-commerce brand. Script, storyboard and art direction were done with their team over two workshops, then animated in a flat isometric style that matched their packaging design.\n\nThe video lifted landing-page conversion by 18% and is now embedded on the homepage, in onboarding emails and support flows.",
      descriptionAr:
        "فيديو توضيحي 2D بـ90 ثانية لـ Fable، ماركة موضة e-commerce. النص والـ storyboard والإدارة الفنية اتعملوا مع فريقهم في ورشتين، وبعدين اتأنيمت بأسلوب isometric مسطح مطابق لتصميم التغليف.\n\nالفيديو رفع التحويل على صفحة الهبوط 18%، ودلوقتي موجود على الهومبيج وفي إيميلات التسجيل ودعوات الدعم.",
      media: [{ type: "video", url: V.fable, caption: "Explainer (loop)" }],
    },
    {
      title: "Momentum — 3D Type",
      titleAr: "Momentum — حروف 3D",
      slug: "momentum-3d-type",
      cover: "/images/work-momentum.jpg",
      video: V.momentum,
      client: "Self-initiated",
      category: "3D",
      year: 2025,
      tools: "Cinema 4D, Redshift, After Effects, DaVinci Resolve",
      featured: true,
      sortOrder: 4,
      description:
        "A personal piece exploring liquid-chrome typography and speed. Built to test a rendering pipeline I now use for client work: C4D modeling, Redshift materials, 20% AE finishing.\n\nSelected for a showcase reel used in client pitches — it is the first thing most clients watch when I send my intro.",
      descriptionAr:
        "قطعة شخصية بتجرب حروف liquid-chrome والسرعة. اتعملت عشان أختبر خط رندر بستخدمه دلوقتي مع العملاء: نمذجة C4D، مواد Redshift، و20% تنفيةض في AE.\n\nاختيرت لتدخل في الـ showreel اللي ببعته في عروض العملاء — هي أول حاجة أي عميل يشوفها.",
      media: [{ type: "video", url: V.momentum, caption: "Final loop" }],
    },
    {
      title: "Nova Bank — Social Cutdowns",
      titleAr: "Nova Bank — قصّات السوشيال",
      slug: "nova-bank-social-cutdowns",
      cover: "/images/work-nova.jpg",
      video: V.nova,
      client: "Nova Bank",
      category: "Social Media",
      year: 2023,
      tools: "After Effects, Photoshop, Premiere Pro",
      featured: false,
      sortOrder: 5,
      description:
        "A 14-piece cutdown kit for Nova Bank's rebrand: one master film cut into 9:16, 1:1 and 4:5 versions with captions, safe-zones and hook variants for TikTok, Reels and LinkedIn.\n\nEngagement on rebrand posts tripled within the first month of the rollout.",
      descriptionAr:
        "طقم 14 قطعة من إعادة براندنج Nova Bank: فيلم رئيسي اتقص لنسب 9:16 و1:1 و4:5 مع كابشنز وsafe-zones ونسخ hook مختلفة لـ TikTok وReels وLinkedIn.\n\nالتفاعل على بوستات البراندنج تالت ضيف في أول شهر.",
      media: [],
    },
    {
      title: "Kite Games — Trailers & Ads",
      titleAr: "Kite Games — تريلرات وإعلانات",
      slug: "kite-games-trailers-ads",
      cover: "/images/work-kite.jpg",
      video: V.kite,
      client: "Kite Games",
      category: "Advertisements",
      year: 2023,
      tools: "Unreal Engine exports, After Effects, Cinema 4D",
      featured: false,
      sortOrder: 6,
      description:
        "Store trailer plus a set of paid UA creative variants for Kite, an indie platformer. I animated the gameplay captures, built the UI fly-throughs and cut three hook-first 6-second ads for TikTok.",
      descriptionAr:
        "تريلر مخزن + مجموعة إعلانات UA مدفوعة لـ Kite، لعبة platformer مستقلة. أنيمتت لقطات الجيمبلاي، بنيت الـ UI fly-throughs، وقصيت 3 إعلانات 6 ثواني hook-first لتيك توك.",
      media: [],
    },
    {
      title: "Roast Ritual — Brand Motion",
      titleAr: "Roast Ritual — حركة الماركة",
      slug: "roast-ritual-brand-motion",
      cover: "/images/work-nile.jpg",
      video: V.nile,
      client: "Nile Coffee Co.",
      category: "Motion Graphics",
      year: 2024,
      tools: "Cinema 4D, After Effects, Illustrator",
      featured: false,
      sortOrder: 7,
      description:
        "Liquid 3D motion for a specialty roastery: beans dissolving into steam, steam forming the roasting-curve chart, and an animated menu system used on in-cafe screens and packaging inserts.",
      descriptionAr:
        "حركة 3D سائلة لرواستري قهوة مختصة: حبوب بتذوب في البخار، بخار بيعمل منحنى التحميص، ونظام منيو متحرك بيتستخدم على شاشات الكافيه وداخل التغليف.",
      media: [],
    },
    {
      title: "Pulse — Workout Reels",
      titleAr: "Pulse — ريلز التمرين",
      slug: "pulse-workout-reels",
      cover: IMG.pulse,
      video: V.pulse,
      client: "Pulse Fitness",
      category: "Social Media",
      year: 2025,
      tools: "Premiere Pro, After Effects, Photoshop",
      featured: false,
      sortOrder: 8,
      description:
        "A monthly recurring pack of high-energy gym reels: beat-synced cuts, kinetic captions and a consistent title system that made the brand instantly recognizable in the feed.",
      descriptionAr:
        "باقة شهرية متجددة من ريلز جم عالية الطاقة: قص على البات، كابشنز متحركة، ونظام عناوين ثابت خلّى الماركة متعرّف عليها فورًا في الفيد.",
      media: [],
    },
  ]);

  await db.insert(clients).values([
    { name: "Aurora Labs", description: "Fintech startup building payment tools for creators. Full motion identity system and launch videos.", descriptionAr: "شركة fintech ناشئة بتبني أدوات دفع للمبدعين. نظام هوية حركة كامل وفيديوهات إطلاق.", website: "https://example.com/aurora", sortOrder: 1 },
    { name: "Terra Energy", description: "Clean-energy company. Product launch films and ad campaigns across paid channels.", descriptionAr: "شركة طاقة نظيفة. أفلام إطلاق منتجات وحملات إعلانية عبر القنوات المدفوعة.", website: "https://example.com/terra", sortOrder: 2 },
    { name: "Fable", description: "Fashion e-commerce brand. Explainer videos, campaign cutdowns and brand motion.", descriptionAr: "ماركة موضة e-commerce. فيديوهات توضيحية، قصّات حملات، وهوية متحركة.", website: "https://example.com/fable", sortOrder: 3 },
    { name: "Nova Bank", description: "Digital bank rebrand — social kit, app animations and corporate loop.", descriptionAr: "إعادة براندنج بنك رقمي — طقم سوشيال، أنيميشن تطبيق، ولوجو موشن مؤسسي.", website: "https://example.com/nova", sortOrder: 4 },
    { name: "Kite Games", description: "Indie game studio. Store trailers and paid user-acquisition creative.", descriptionAr: "استوديو جيمز مستقل. تريلرات مخازن وإعلانات استهداف مدفوعة.", website: "https://example.com/kite", sortOrder: 5 },
    { name: "Nile Coffee Co.", description: "Specialty roastery. Brand motion for in-cafe screens and packaging.", descriptionAr: "رواستري قهوة مختصة. حركة ماركة لشاشات الكافيه والتغليف.", website: "https://example.com/nile", sortOrder: 6 },
    { name: "Pulse Fitness", description: "Gym chain. Monthly social reels and class promo animations.", descriptionAr: "سلسلة جيمز. ريلز سوشيال شهرية وأنيميشن ترويج للمدربين.", website: "https://example.com/pulse", sortOrder: 7 },
    { name: "Marble Studio", description: "Architecture & design studio. 3D walkthroughs and identity animation.", descriptionAr: "استوديو عمارة وتصميم. جولات 3D وأنيميشن هوية.", website: "https://example.com/marble", sortOrder: 8 },
  ]);

  await db.insert(testimonials).values([
    {
      name: "Sara Nassar", position: "Brand Director", company: "Aurora Labs", rating: 5, sortOrder: 1,
      review: "Wala turned our rebrand into a living identity. Every logo animation, every transition — it all feels like the brand is breathing. Investors literally complimented the motion design during our demo day.",
      reviewAr: "ولاء حوّل إعادة البراندنج بتاعنا لهوية حية. كل أنيميشن لوجو، كل ترانزيشن — تحس إن الماركة نفسها بتتنفس. المستثمرين فعلًا مدحوا الموشن ديزاين في يوم الديمو بتاعنا.",
    },
    {
      name: "Marko Ilić", position: "CMO", company: "Terra Energy", rating: 5, sortOrder: 2,
      review: "The launch film outperformed every other asset in our campaign. Wala nailed the brief on the first review, and the final cut was delivered three days early. A rare combination of taste and discipline.",
      reviewAr: "فيلم الإطلاق فوّت كل الـ assets التانية في حملتنا. ولاء قفل البريف من أول مراجعة، والتسليم النهائي جال قبل الموعد بتلات أيام. مزيج نادر من الذوق والانضباط.",
    },
    {
      name: "Dana El-Sayed", position: "Founder", company: "Fable", rating: 5, sortOrder: 3,
      review: "We are a small team and Wala made the whole explainer process painless — workshops, storyboard, revisions, delivery. Conversion on the landing page went up 18% the week we published it.",
      reviewAr: "إحنا فريق صغير وولاء خلّى عملية الفيديو التوضيحي كلها من غير وجع — ورش، storyboard، تعديلات، تسليم. التحويل على صفحة الهبوط زاد 18% في أسبوع النشر.",
    },
    {
      name: "Karim Aziz", position: "Lead Designer", company: "Pulse Fitness", rating: 5, sortOrder: 4,
      review: "I took the group course with three other colleagues. The sessions were 100% live and personal — Wala reviewed our files, broke our mistakes down frame by frame, and never repeated an answer. Worth every penny.",
      reviewAr: "خدت الكورس الجماعي مع ثلاثة زملاء. الجلسات كانت لايف وشخصية 100% — ولاء راجع ملفاتنا، وشكّل أخطائنا فريم بفريم، ومكررش إجابة مرتين. يستاهل كل جنيه.",
    },
    {
      name: "Lena Vogt", position: "Growth Lead", company: "Nova Bank", rating: 5, sortOrder: 5,
      review: "Working with a freelancer for a bank rebrand felt risky. It wasn't. Wala delivered a 14-piece cutdown kit with obsessive attention to safe zones and caption timing. Engagement tripled.",
      reviewAr: "الاشتغل مع فريلانسر على براندنج بنك حسيت إنه مخاطرة. مش كان. ولاء سلّم طقم 14 قطعة بتفصيل مرضي في الـ safe zones وتوقيت الكابشنز. التفاعل تالت ضيف.",
    },
  ]);

  await db.insert(services).values([
    { title: "Motion Graphics", titleAr: "موشن جرافيك", description: "Kinetic typography, infographics, animated branding and everything in between — crafted to a story beat, not just a trend.", descriptionAr: "حروف متحركة، إنفوجرافيك، هوية متحركة وكل اللي بينهم — مصمم على إيقاع القصة مش على الترند بس.", tags: "Kinetic type, Infographics, Branding", sortOrder: 1 },
    { title: "Social Media Motion", titleAr: "موشن سوشيال ميديا", description: "Scroll-stopping Reels and Shorts: hook-first edits, kinetic captions and cutdown kits built for TikTok, Instagram and LinkedIn.", descriptionAr: "ريلز وشورتز توقف السكرول: مونتاج hook-first، كابشنز متحركة، وطقم قصّات جاهز لتيك توك وإنستجرام ولينكدإن.", tags: "Reels, Shorts, Cutdowns", sortOrder: 2 },
    { title: "2D Explainer Videos", titleAr: "فيديوهات توضيحية 2D", description: "From script and storyboard to final cut — explainers that make complex products feel simple, in your brand's own visual language.", descriptionAr: "من النص والـ storyboard للقصة النهائية — فيديوهات بتخلّي المنتجات المعقدة تبان بسيطة، بلغة الماركة البصرية نفسها.", tags: "Scripting, Storyboard, 2D animation", sortOrder: 3 },
    { title: "Advertisements & Launch Films", titleAr: "إعلانات وأفلام إطلاق", description: "Paid-social ads and product launch films, 3D or composite, optimized for the feed and the big screen alike.", descriptionAr: "إعلانات سوشيال مدفوعة وأفلام إطلاق منتجات، 3D أو كومبوزيت، مضبوطة للفيد والشاشة الكبيرة مع بعض.", tags: "Product ads, Launch films, 3D", sortOrder: 4 },
    { title: "Branding & Identity Motion", titleAr: "هوية وشركات في حركة", description: "Logos, monograms and full identity systems given a motion language — easing, choreography and animation guidelines your team can reuse.", descriptionAr: "لوجوهات وmonograms وأنظمة هوية كاملة بتاخد \"لغة حركة\" — easing وkoreography ودليل أنيميشن فريقك يقدر يعيد استخدامه.", tags: "Logo animation, Identity systems", sortOrder: 5 },
  ]);

  await db.insert(courses).values([
    {
      title: "Motion Graphics Fundamentals",
      titleAr: "أساسيات الموشن جرافيك",
      slug: "motion-graphics-fundamentals",
      description: "The complete foundation: animation principles, timing, easing and composition — applied to real briefs every single session. You will leave with a finished reel, not just notes.",
      descriptionAr: "الأساس الكامل: مبادئ الأنيميشن، التوقيت، الـ easing والتكوين — بتطبقها على بريفات حقيقية في كل جلسة. هتخرج بريل منتهي مش بس ملاحظات.",
      duration: "6 weeks",
      sessions: 8,
      price: 350,
      maxStudents: 5,
      groupPricing: { "1": 1, "2": 0.9, "3": 0.8, "4": 0.72, "5": 0.65 },
      learnings: ["Animation principles, timing & easing curves", "Kinetic typography that reads at a glance", "Logo & brand animation", "Shape-layer animation & clean workflows", "Color, composition & style frames", "Rendering, exporting & delivery specs"],
      learningsAr: ["مبادئ الأنيميشن والتوقيت ومنحنيات الـ easing", "حروف متحركة بتفهمها من أول نظرة", "أنيميشن لوجوهات وهويات", "أنيميشن shape-layer وخطوك شغل نظيف", "ألوان وتكوين وstyle frames", "رندر وإكسبورت ومواصفات التسليم"],
      sortOrder: 1,
    },
    {
      title: "After Effects — Zero to Pro",
      titleAr: "After Effects — من الصفر للاحتراف",
      slug: "after-effects-zero-to-pro",
      description: "A deep, hands-on tour of After Effects as a professional's main tool: from the interface to expression tricks, parent chains, and a fully animated showreel by the final session.",
      descriptionAr: "جولة عملية عميقة في After Effects كأداة المحترف الأساسية: من الواجهة لتخاريط الـ expressions وسلاسل الـ parent، وحتّى showreel متحرك بالكامل في آخر جلسة.",
      duration: "8 weeks",
      sessions: 10,
      price: 420,
      maxStudents: 5,
      groupPricing: { "1": 1, "2": 0.9, "3": 0.8, "4": 0.72, "5": 0.65 },
      learnings: ["Project structure & professional workflows", "Keyframing, easing & the Graph Editor", "Masking, tracking & clean cutouts", "Expressions without the math pain", "Duik, scripts & speed-up plugins", "Building a showreel that gets hired"],
      learningsAr: ["بنية المشروع وخطوك شغل محترف", "كيه فرومينج وeasing وGraph Editor", "ماسكنج وtracking وقصّات نظيفة", "Expressions من غير وجع الحسابات", "Duik وسكربتات وبلجنز بتسرع شغلك", "تصميم showreel بيحصلك شغل"],
      sortOrder: 2,
    },
    {
      title: "Social Media Motion — Reels & Shorts",
      titleAr: "موشن سوشيال ميديا — ريلز وشورتز",
      slug: "social-media-motion",
      description: "Learn the mechanics of the feed: hooks, pacing, captions, sound design and the exact formats that hold attention. Built for creators and brand teams.",
      descriptionAr: "اعرف ميكانيكا الفيد: hooks والـ pacing والكابشنز والساوند ديزاين والتشكيلات اللي بتمسك الانتظار فعلًا. مصمم للمبدعين وفرق الماركات.",
      duration: "4 weeks",
      sessions: 6,
      price: 260,
      maxStudents: 5,
      groupPricing: { "1": 1, "2": 0.88, "3": 0.78, "4": 0.7, "5": 0.62 },
      learnings: ["Hook design & the first 1.5 seconds", "Beat-synced editing & pacing", "Kinetic captions & safe zones", "Sound design basics for retention", "Turning one asset into a full cutdown kit"],
      learningsAr: ["تصميم الـ hook وأول 1.5 ثانية", "مونتاج على البات والـ pacing", "كابشنز متحركة وsafe zones", "أساسيات الساوند ديزاين للاحتفاظ بالمشاهد", "تحويل asset واحد لطقم قصّات كامل"],
      sortOrder: 3,
    },
    {
      title: "2D Explainer & Storyboarding",
      titleAr: "فيديوهات توضيحية 2D وStoryboard",
      slug: "explainer-storyboarding",
      description: "How to turn a complicated product into a 60–90 second story: scripting, storyboarding, art direction and 2D animation in a style that matches your brand.",
      descriptionAr: "إزاي تحوّل منتج معقد لقصة 60–90 ثانية: كتابة وسبوريستوريينج وإدارة فنية وأنيميشن 2D بأسلوب مطابق للماركة.",
      duration: "6 weeks",
      sessions: 8,
      price: 380,
      maxStudents: 5,
      groupPricing: { "1": 1, "2": 0.9, "3": 0.8, "4": 0.72, "5": 0.65 },
      learnings: ["Scripting & the 3-act explainer structure", "Storyboarding for animation", "Art direction & style frames", "2D animation in After Effects", "Voice-over, SFX & final mix"],
      learningsAr: ["كتابة ونص وتعليق هيكل القصة-3", "Storyboarding مخصص للأنيميشن", "إدارة فنية وstyle frames", "أنيميشن 2D في After Effects", "تعليق صوتي ومؤثرات وميكس نهائي"],
      sortOrder: 4,
    },
  ]);

  await db.insert(settings).values([
    {
      key: "hero",
      value: {
        name: "Wala Khalid",
        nameAr: "ولاء خالد",
        role: "Motion Designer",
        roleAr: "مصمم موشن",
        intro:
          "I design in motion. For the last 8 years I've helped startups, studios and global brands turn static ideas into things that move — identity systems, launch films, explainers and feeds that stop the scroll.",
        introAr:
          "أصمم بالحركة. من 8 سنين وأنا بموّل الشركات الناشئة والاستوديوهات والعلامات العالمية تحول أفكار ثابتة لأشياء بتتحرك — أنظمة هوية، أفلام إطلاق، فيديوهات توضيحية، وفيد يقف السكرول.",
        location: "Cairo, Egypt — working worldwide",
        locationAr: "القاهرة، مصر — شغل عالمي",
        stats: [
          { k: "8+", l: "Years of motion" },
          { k: "120+", l: "Projects delivered" },
          { k: "40+", l: "Happy clients" },
          { k: "12", l: "Countries served" },
        ],
        statsAr: [
          { k: "8+", l: "سنة موشن" },
          { k: "120+", l: "مشروع اتسلّم" },
          { k: "40+", l: "عميل سعيد" },
          { k: "12", l: "بلد اشتغلت فيهم" },
        ],
      },
    },
    {
      key: "socials",
      value: {
        email: "hello@walakhalid.design",
        whatsapp: "+20 100 123 4567",
        whatsappNumber: "201001234567",
        linkedin: "https://linkedin.com/in/walakhalid",
        behance: "https://behance.net/walakhalid",
        instagram: "https://instagram.com/walakhalid.motion",
        tiktok: "https://tiktok.com/@walakhalid.motion",
        youtube: "https://youtube.com/@walakhalid",
      },
    },
    {
      key: "site",
      value: {
        availabilityNote: "Currently booking projects for the next 2 months",
        availabilityNoteAr: "متاح دلوقتي لحجز مشاريع للشهرين الجايين",
        location: "Cairo, Egypt",
        locationAr: "القاهرة، مصر",
      },
    },
    { key: "availability", value: { days: [0, 1, 2, 3, 4], start: 10, end: 18, slot: 60 } },
    { key: "contact", value: { email: "hello@walakhalid.design", whatsapp: "+20 100 123 4567", whatsappNumber: "201001234567", linkedin: "https://linkedin.com/in/walakhalid", behance: "https://behance.net/walakhalid", instagram: "https://instagram.com/walakhalid.motion", tiktok: "https://tiktok.com/@walakhalid.motion", youtube: "https://youtube.com/@walakhalid" } },
    { key: "cv", value: CV_EN },
    { key: "cv_ar", value: CV_AR },
  ]);

  console.log("Seeded (bilingual, Wala Khalid): 8 projects, 8 clients, 5 testimonials, 5 services, 4 courses, settings.");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
