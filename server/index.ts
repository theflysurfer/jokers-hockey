import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { createServer } from 'http';
import { getPayload } from 'payload';
import config from '../payload.config';
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Payload needs access to raw body for webhooks
declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}

// JSON middleware with raw body capture
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Initialize Payload
    log('Initializing Payload CMS...');
    const payload = await getPayload({
      config,
      express: app,
    });

    log('Payload CMS initialized successfully');

    // Payload 3.x automatically creates its routes on the Express app
    // No need to manually mount middleware
    // Routes available:
    // - /admin/* - Admin panel
    // - /api/* - REST API
    // - /graphql - GraphQL API (if enabled)

    // Create HTTP server
    const server = createServer(app);

    // Error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      log(`Error: ${message}`);
      res.status(status).json({ message });
    });

    // Setup Vite for development or serve static files for production
    if (app.get("env") === "development") {
      log('Setting up Vite development server...');
      await setupVite(app, server);
    } else {
      log('Serving static files...');
      serveStatic(app);
    }

    // Start server
    const port = parseInt(process.env.PORT || '5000', 10);
    server.listen(port, "0.0.0.0", () => {
      log(`🚀 Server ready!`);
      log(`   - API: http://localhost:${port}/api`);
      log(`   - Admin: http://localhost:${port}/admin`);
      log(`   - Frontend: http://localhost:${port}`);
    });
  } catch (error) {
    log('Failed to initialize Payload CMS');
    console.error(error);
    process.exit(1);
  }
})();
