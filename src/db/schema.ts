import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  json,
} from "drizzle-orm/pg-core";

/* ---------------- Portfolio ---------------- */
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  cover: text("cover").notNull(),
  titleAr: text("title_ar"),
  descriptionAr: text("description_ar"),
  video: text("video"),
  description: text("description"),
  client: text("client"),
  category: text("category").notNull(),
  year: integer("year"),
  tools: text("tools"), // comma separated
  media: json("media").$type<{ type: "image" | "video"; url: string; caption?: string }[]>(),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ---------------- Clients / Companies ---------------- */
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url"),
  descriptionAr: text("description_ar"),
  description: text("description"),
  website: text("website"),
  featured: boolean("featured").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ---------------- Testimonials ---------------- */
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  company: text("company"),
  position: text("position"),
  review: text("review").notNull(),
  reviewAr: text("review_ar"),
  avatar: text("avatar"),
  rating: integer("rating").notNull().default(5),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ---------------- Services ---------------- */
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  tags: text("tags"),
  titleAr: text("title_ar"),
  descriptionAr: text("description_ar"), // comma separated
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ---------------- Courses ---------------- */
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  duration: text("duration"), // e.g. "6 weeks"
  sessions: integer("sessions").notNull().default(8),
  learnings: json("learnings").$type<string[]>(),
  titleAr: text("title_ar"),
  descriptionAr: text("description_ar"),
  learningsAr: json("learnings_ar").$type<string[]>(),
  price: integer("price").notNull().default(300), // USD base price, 1 student
  maxStudents: integer("max_students").notNull().default(5),
  // per-student price factors: { "1": 1, "2": 0.9, ... }
  groupPricing: json("group_pricing").$type<Record<string, number>>(),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ---------------- Bookings (course + meetings) ---------------- */
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // "course" | "meeting"
  status: text("status").notNull().default("pending"), // pending | accepted | rejected | cancelled
  // shared
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  date: text("date").notNull(), // YYYY-MM-DD
  time: text("time").notNull(), // HH:MM
  // course fields
  courseId: integer("course_id"),
  courseTitle: text("course_title"),
  students: integer("students"),
  pricePer: integer("price_per"),
  priceTotal: integer("price_total"),
  experience: text("experience"),
  message: text("message"),
  // meeting fields
  company: text("company"),
  projectType: text("project_type"),
  projectDuration: text("project_duration"),
  budget: text("budget"),
  projectDesc: text("project_desc"),
  reference: text("reference"),
  // admin
  note: text("note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ---------------- Contact messages ---------------- */
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  body: text("body").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ---------------- Notifications (admin inbox) ---------------- */
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  kind: text("kind").notNull(), // booking_course | booking_meeting | contact
  title: text("title").notNull(),
  body: text("body").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ---------------- Availability blocks ---------------- */
export const blockedSlots = pgTable("blocked_slots", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(), // YYYY-MM-DD
  time: text("time"), // null = full day (vacation / block)
  note: text("note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ---------------- Admin sessions ---------------- */
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
});

/* ---------------- Key/value settings (site, hero, socials, availability, cv) ---------------- */
export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: json("value").notNull(),
});

export type Project = typeof projects.$inferSelect;
export type Client = typeof clients.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type BlockedSlot = typeof blockedSlots.$inferSelect;
