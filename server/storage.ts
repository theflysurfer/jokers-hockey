import {
  type User, type InsertUser,
  type Match, type InsertMatch,
  type Photo, type InsertPhoto,
  type Video, type InsertVideo,
  type Newsletter, type InsertNewsletter,
  type Staff, type InsertStaff,
  type Announcement, type InsertAnnouncement,
  matches, photos, videos, newsletters, staff, users, announcements
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, and, gte } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Matches
  getAllMatches(): Promise<Match[]>;
  getUpcomingMatches(limit?: number): Promise<Match[]>;
  getRecentResults(limit?: number): Promise<Match[]>;
  getMatchById(id: string): Promise<Match | undefined>;
  createMatch(match: InsertMatch): Promise<Match>;
  updateMatch(id: string, match: Partial<InsertMatch>): Promise<Match | undefined>;
  deleteMatch(id: string): Promise<void>;

  // Photos
  getAllPhotos(category?: string): Promise<Photo[]>;
  getPhotoById(id: string): Promise<Photo | undefined>;
  getPhotosByMatch(matchId: string): Promise<Photo[]>;
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  deletePhoto(id: string): Promise<void>;

  // Videos
  getAllVideos(category?: string): Promise<Video[]>;
  getVideoById(id: string): Promise<Video | undefined>;
  getVideosByMatch(matchId: string): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;
  deleteVideo(id: string): Promise<void>;

  // Newsletter
  subscribeNewsletter(email: string): Promise<Newsletter>;
  unsubscribeNewsletter(email: string): Promise<void>;
  getAllSubscribers(): Promise<Newsletter[]>;

  // Staff
  getAllStaff(category?: string): Promise<Staff[]>;
  getStaffById(id: string): Promise<Staff | undefined>;
  createStaff(staffMember: InsertStaff): Promise<Staff>;
  updateStaff(id: string, staffMember: Partial<InsertStaff>): Promise<Staff | undefined>;
  deleteStaff(id: string): Promise<void>;

  // Announcements
  getAllAnnouncements(category?: string, publishedOnly?: boolean): Promise<Announcement[]>;
  getAnnouncementById(id: string): Promise<Announcement | undefined>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: string, announcement: Partial<InsertAnnouncement>): Promise<Announcement | undefined>;
  deleteAnnouncement(id: string): Promise<void>;
  publishAnnouncement(id: string): Promise<Announcement | undefined>;
}

export class DbStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Matches
  async getAllMatches(): Promise<Match[]> {
    return db.select().from(matches).orderBy(desc(matches.date));
  }

  async getUpcomingMatches(limit = 5): Promise<Match[]> {
    return db.select().from(matches)
      .where(and(
        eq(matches.status, 'upcoming'),
        gte(matches.date, new Date())
      ))
      .orderBy(asc(matches.date))
      .limit(limit);
  }

  async getRecentResults(limit = 3): Promise<Match[]> {
    return db.select().from(matches)
      .where(eq(matches.status, 'completed'))
      .orderBy(desc(matches.date))
      .limit(limit);
  }

  async getMatchById(id: string): Promise<Match | undefined> {
    const result = await db.select().from(matches).where(eq(matches.id, id)).limit(1);
    return result[0];
  }

  async createMatch(match: InsertMatch): Promise<Match> {
    const result = await db.insert(matches).values(match).returning();
    return result[0];
  }

  async updateMatch(id: string, match: Partial<InsertMatch>): Promise<Match | undefined> {
    const result = await db.update(matches).set(match).where(eq(matches.id, id)).returning();
    return result[0];
  }

  async deleteMatch(id: string): Promise<void> {
    await db.delete(matches).where(eq(matches.id, id));
  }

  // Photos
  async getAllPhotos(category?: string): Promise<Photo[]> {
    if (category) {
      return db.select().from(photos).where(eq(photos.category, category)).orderBy(desc(photos.createdAt));
    }
    return db.select().from(photos).orderBy(desc(photos.createdAt));
  }

  async getPhotoById(id: string): Promise<Photo | undefined> {
    const result = await db.select().from(photos).where(eq(photos.id, id)).limit(1);
    return result[0];
  }

  async getPhotosByMatch(matchId: string): Promise<Photo[]> {
    return db.select().from(photos).where(eq(photos.matchId, matchId));
  }

  async createPhoto(photo: InsertPhoto): Promise<Photo> {
    const result = await db.insert(photos).values(photo).returning();
    return result[0];
  }

  async deletePhoto(id: string): Promise<void> {
    await db.delete(photos).where(eq(photos.id, id));
  }

  // Videos
  async getAllVideos(category?: string): Promise<Video[]> {
    if (category) {
      return db.select().from(videos).where(eq(videos.category, category)).orderBy(desc(videos.createdAt));
    }
    return db.select().from(videos).orderBy(desc(videos.createdAt));
  }

  async getVideoById(id: string): Promise<Video | undefined> {
    const result = await db.select().from(videos).where(eq(videos.id, id)).limit(1);
    return result[0];
  }

  async getVideosByMatch(matchId: string): Promise<Video[]> {
    return db.select().from(videos).where(eq(videos.matchId, matchId));
  }

  async createVideo(video: InsertVideo): Promise<Video> {
    const result = await db.insert(videos).values(video).returning();
    return result[0];
  }

  async deleteVideo(id: string): Promise<void> {
    await db.delete(videos).where(eq(videos.id, id));
  }

  // Newsletter
  async subscribeNewsletter(email: string): Promise<Newsletter> {
    const result = await db.insert(newsletters).values({ email }).returning();
    return result[0];
  }

  async unsubscribeNewsletter(email: string): Promise<void> {
    await db.update(newsletters).set({ active: false }).where(eq(newsletters.email, email));
  }

  async getAllSubscribers(): Promise<Newsletter[]> {
    return db.select().from(newsletters).where(eq(newsletters.active, true));
  }

  // Staff
  async getAllStaff(category?: string): Promise<Staff[]> {
    if (category) {
      return db.select().from(staff).where(eq(staff.category, category)).orderBy(asc(staff.order));
    }
    return db.select().from(staff).orderBy(asc(staff.order));
  }

  async getStaffById(id: string): Promise<Staff | undefined> {
    const result = await db.select().from(staff).where(eq(staff.id, id)).limit(1);
    return result[0];
  }

  async createStaff(staffMember: InsertStaff): Promise<Staff> {
    const result = await db.insert(staff).values(staffMember).returning();
    return result[0];
  }

  async updateStaff(id: string, staffMember: Partial<InsertStaff>): Promise<Staff | undefined> {
    const result = await db.update(staff).set(staffMember).where(eq(staff.id, id)).returning();
    return result[0];
  }

  async deleteStaff(id: string): Promise<void> {
    await db.delete(staff).where(eq(staff.id, id));
  }

  // Announcements
  async getAllAnnouncements(category?: string, publishedOnly = true): Promise<Announcement[]> {
    let query = db.select().from(announcements);

    const conditions = [];
    if (publishedOnly) {
      conditions.push(eq(announcements.isPublished, true));
    }
    if (category) {
      conditions.push(eq(announcements.category, category));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    return query.orderBy(desc(announcements.publishedAt));
  }

  async getAnnouncementById(id: string): Promise<Announcement | undefined> {
    const result = await db.select().from(announcements).where(eq(announcements.id, id)).limit(1);
    return result[0];
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const result = await db.insert(announcements).values(announcement).returning();
    return result[0];
  }

  async updateAnnouncement(id: string, announcement: Partial<InsertAnnouncement>): Promise<Announcement | undefined> {
    const result = await db.update(announcements).set(announcement).where(eq(announcements.id, id)).returning();
    return result[0];
  }

  async deleteAnnouncement(id: string): Promise<void> {
    await db.delete(announcements).where(eq(announcements.id, id));
  }

  async publishAnnouncement(id: string): Promise<Announcement | undefined> {
    const result = await db.update(announcements)
      .set({
        isPublished: true,
        publishedAt: new Date()
      })
      .where(eq(announcements.id, id))
      .returning();
    return result[0];
  }
}

export const storage = new DbStorage();
