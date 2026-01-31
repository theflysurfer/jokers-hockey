import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMatchSchema, insertPhotoSchema, insertVideoSchema, insertNewsletterSchema, insertStaffSchema, insertAnnouncementSchema } from "@shared/schema";
import { requireRole, requireAdmin } from './auth/rbac';
import { db } from "./db";
import { sql } from "drizzle-orm";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const uploadDir = path.join(__dirname, "../dist/public/uploads");

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage_multer = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage_multer,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // File upload endpoint
  app.post("/api/upload", upload.single('image'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      // Return the public URL for the uploaded file
      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({ url: fileUrl, filename: req.file.filename });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  // Matches routes
  app.get("/api/matches", async (_req, res) => {
    try {
      const matches = await storage.getAllMatches();
      res.json(matches);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/matches/upcoming", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const matches = await storage.getUpcomingMatches(limit);
      res.json(matches);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/matches/results", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const matches = await storage.getRecentResults(limit);
      res.json(matches);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/matches/:id", async (req, res) => {
    try {
      const match = await storage.getMatchById(req.params.id);
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }
      res.json(match);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/matches", requireRole('coach', 'admin'), async (req, res) => {
    try {
      const matchData = insertMatchSchema.parse(req.body);
      const match = await storage.createMatch(matchData);
      res.status(201).json(match);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/matches/:id", requireRole('coach', 'admin'), async (req, res) => {
    try {
      const match = await storage.updateMatch(req.params.id, req.body);
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }
      res.json(match);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/matches/:id", requireRole('coach', 'admin'), async (req, res) => {
    try {
      await storage.deleteMatch(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Photos routes
  app.get("/api/photos", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const photos = await storage.getAllPhotos(category);
      res.json(photos);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/photos/:id", async (req, res) => {
    try {
      const photo = await storage.getPhotoById(req.params.id);
      if (!photo) {
        return res.status(404).json({ message: "Photo not found" });
      }
      res.json(photo);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/photos/match/:matchId", async (req, res) => {
    try {
      const photos = await storage.getPhotosByMatch(req.params.matchId);
      res.json(photos);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/photos", requireRole('photographer', 'admin'), async (req, res) => {
    try {
      const photoData = insertPhotoSchema.parse(req.body);
      const photo = await storage.createPhoto(photoData);
      res.status(201).json(photo);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/photos/:id", requireRole('photographer', 'admin'), async (req, res) => {
    try {
      await storage.deletePhoto(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Videos routes
  app.get("/api/videos", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const videos = await storage.getAllVideos(category);
      res.json(videos);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/videos/:id", async (req, res) => {
    try {
      const video = await storage.getVideoById(req.params.id);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      res.json(video);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/videos/match/:matchId", async (req, res) => {
    try {
      const videos = await storage.getVideosByMatch(req.params.matchId);
      res.json(videos);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/videos", async (req, res) => {
    try {
      const videoData = insertVideoSchema.parse(req.body);
      const video = await storage.createVideo(videoData);
      res.status(201).json(video);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/videos/:id", async (req, res) => {
    try {
      await storage.deleteVideo(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Newsletter routes
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const { email } = insertNewsletterSchema.parse(req.body);
      const subscriber = await storage.subscribeNewsletter(email);
      res.status(201).json(subscriber);
    } catch (error: any) {
      if (error.message.includes('unique')) {
        return res.status(409).json({ message: "Email already subscribed" });
      }
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/newsletter/unsubscribe", async (req, res) => {
    try {
      const { email } = req.body;
      await storage.unsubscribeNewsletter(email);
      res.status(200).json({ message: "Unsubscribed successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/newsletter/subscribers", async (_req, res) => {
    try {
      const subscribers = await storage.getAllSubscribers();
      res.json(subscribers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Staff routes
  app.get("/api/staff", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const staff = await storage.getAllStaff(category);
      res.json(staff);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/staff/:id", async (req, res) => {
    try {
      const staffMember = await storage.getStaffById(req.params.id);
      if (!staffMember) {
        return res.status(404).json({ message: "Staff member not found" });
      }
      res.json(staffMember);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/staff", requireAdmin, async (req, res) => {
    try {
      const staffData = insertStaffSchema.parse(req.body);
      const staffMember = await storage.createStaff(staffData);
      res.status(201).json(staffMember);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/staff/:id", requireAdmin, async (req, res) => {
    try {
      const staffMember = await storage.updateStaff(req.params.id, req.body);
      if (!staffMember) {
        return res.status(404).json({ message: "Staff member not found" });
      }
      res.json(staffMember);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/staff/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteStaff(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Announcements routes with photos
  app.get("/api/announcements", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const publishedOnly = req.query.publishedOnly !== 'false'; // Default to true

      // Build SQL query with photos joined
      let query = sql`
        SELECT
          a.id,
          a.title,
          a.content,
          a.category,
          a.author_id,
          a.is_published,
          a.created_at,
          a.published_at,
          COALESCE(
            json_agg(
              json_build_object(
                'id', p.id,
                'title', p.title,
                'imageUrl', p.image_url,
                'description', p.description
              ) ORDER BY ap.display_order
            ) FILTER (WHERE p.id IS NOT NULL),
            '[]'::json
          ) as photos
        FROM announcements a
        LEFT JOIN announcement_photos ap ON ap.announcement_id = a.id
        LEFT JOIN photos p ON p.id = ap.photo_id
      `;

      // Add WHERE conditions
      if (publishedOnly && category) {
        query = sql`${query} WHERE a.is_published = ${publishedOnly} AND a.category = ${category}`;
      } else if (publishedOnly) {
        query = sql`${query} WHERE a.is_published = ${publishedOnly}`;
      } else if (category) {
        query = sql`${query} WHERE a.category = ${category}`;
      }

      query = sql`${query} GROUP BY a.id ORDER BY a.published_at DESC`;

      const result = await db.execute(query);
      res.json(result.rows);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/announcements/:id", async (req, res) => {
    try {
      const announcement = await storage.getAnnouncementById(req.params.id);
      if (!announcement) {
        return res.status(404).json({ message: "Announcement not found" });
      }
      res.json(announcement);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/announcements", requireRole('secretary', 'admin'), async (req, res) => {
    try {
      const announcementData = insertAnnouncementSchema.parse(req.body);
      const announcement = await storage.createAnnouncement(announcementData);
      res.status(201).json(announcement);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/announcements/:id", requireRole('secretary', 'admin'), async (req, res) => {
    try {
      const announcement = await storage.updateAnnouncement(req.params.id, req.body);
      if (!announcement) {
        return res.status(404).json({ message: "Announcement not found" });
      }
      res.json(announcement);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/announcements/:id", requireRole('secretary', 'admin'), async (req, res) => {
    try {
      await storage.deleteAnnouncement(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/announcements/:id/publish", requireRole('secretary', 'admin'), async (req, res) => {
    try {
      const announcement = await storage.publishAnnouncement(req.params.id);
      if (!announcement) {
        return res.status(404).json({ message: "Announcement not found" });
      }
      res.json(announcement);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
