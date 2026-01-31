import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("parent"), // "admin", "director", "secretary", "treasurer", "coach", "photographer", "parent"
  fullName: text("full_name"),
  phone: text("phone"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Matches table for scheduling and results
export const matches = pgTable("matches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").notNull(),
  opponent: text("opponent").notNull(),
  location: text("location").notNull(), // "home" or "away"
  venue: text("venue"),
  scoreJokers: integer("score_jokers"),
  scoreOpponent: integer("score_opponent"),
  status: text("status").notNull().default("upcoming"), // "upcoming", "completed", "cancelled"
  category: text("category"), // "Jeunes", "Adultes", etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMatchSchema = createInsertSchema(matches).omit({ id: true, createdAt: true });
export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;

// Gallery photos (existing Payload CMS table structure)
export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: varchar("description"),
  imageUrlId: integer("image_url_id").notNull(), // Payload stores media IDs
  category: text("category"), // "match", "training", "event", etc.
  matchId: integer("match_id"),
  uploadedById: integer("uploaded_by_id").notNull(),
  approvalStatus: text("approval_status").notNull(),
  rejectionReason: varchar("rejection_reason"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertPhotoSchema = createInsertSchema(photos).omit({ id: true, createdAt: true });
export type Photo = typeof photos.$inferSelect;
export type InsertPhoto = z.infer<typeof insertPhotoSchema>;

// Videos
export const videos = pgTable("videos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  youtubeId: text("youtube_id").notNull(),
  category: text("category"), // "highlights", "interviews", "training", etc.
  matchId: varchar("match_id").references(() => matches.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertVideoSchema = createInsertSchema(videos).omit({ id: true, createdAt: true });
export type Video = typeof videos.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;

// Newsletter subscriptions
export const newsletters = pgTable("newsletters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
  active: boolean("active").default(true),
});

export const insertNewsletterSchema = createInsertSchema(newsletters).omit({ id: true, subscribedAt: true, active: true });
export type Newsletter = typeof newsletters.$inferSelect;
export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;

// Staff members
export const staff = pgTable("staff", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  role: text("role").notNull(), // "Entraîneur", "Assistant", "Manager", etc.
  category: text("category"), // "Jeunes", "Adultes", "Bureau"
  photoUrl: text("photo_url"),
  bio: text("bio"),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertStaffSchema = createInsertSchema(staff).omit({ id: true, createdAt: true });
export type Staff = typeof staff.$inferSelect;
export type InsertStaff = z.infer<typeof insertStaffSchema>;

// Announcements - Archive annonces WhatsApp
export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(), // Markdown format
  category: text("category"), // "U7", "U9", "U11", "U13", "U15", "U17", "U20", "Adultes", "General"
  authorId: integer("author_id").references(() => users.id),
  isPublished: boolean("is_published").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
});

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({ id: true, createdAt: true, publishedAt: true });
export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;

// Junction table pour lier photos aux announcements
export const announcementPhotos = pgTable("announcement_photos", {
  id: serial("id").primaryKey(),
  announcementId: integer("announcement_id")
    .references(() => announcements.id, { onDelete: 'cascade' })
    .notNull(),
  photoId: integer("photo_id")
    .references(() => photos.id, { onDelete: 'cascade' })
    .notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const insertAnnouncementPhotoSchema = createInsertSchema(announcementPhotos).omit({
  id: true,
  createdAt: true,
});
export type AnnouncementPhoto = typeof announcementPhotos.$inferSelect;
export type InsertAnnouncementPhoto = z.infer<typeof insertAnnouncementPhotoSchema>;

// Teams - Phase 2
export const teams = pgTable("teams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(), // "youth", "adult"
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTeamSchema = createInsertSchema(teams).omit({ id: true, createdAt: true });
export type Team = typeof teams.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;

// Players - Phase 2
export const players = pgTable("players", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  teamId: varchar("team_id").references(() => teams.id),
  fullName: text("full_name").notNull(),
  jerseyNumber: integer("jersey_number"),
  birthDate: timestamp("birth_date"),
  parentName: text("parent_name"),
  parentEmail: text("parent_email"),
  parentPhone: text("parent_phone"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPlayerSchema = createInsertSchema(players).omit({ id: true, createdAt: true });
export type Player = typeof players.$inferSelect;
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;

// Match Inscriptions - Phase 2
export const matchInscriptions = pgTable("match_inscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  matchId: varchar("match_id").references(() => matches.id).notNull(),
  playerId: varchar("player_id").references(() => players.id).notNull(),
  userId: varchar("user_id").references(() => users.id),
  status: text("status").notNull().default("confirmed"), // "confirmed", "maybe", "absent"
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertMatchInscriptionSchema = createInsertSchema(matchInscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
export type MatchInscription = typeof matchInscriptions.$inferSelect;
export type InsertMatchInscription = z.infer<typeof insertMatchInscriptionSchema>;
