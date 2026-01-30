import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { createServer } from 'http';
import session from 'express-session';
import passport from './auth/passport';
import { sessionConfig } from './auth/session';
import { registerAuthRoutes } from './auth/routes';
import { setupVite, serveStatic, log } from "./vite";
import { registerRoutes } from "./routes";

const app = express();

// Trust proxy (required for secure cookies behind nginx)
app.set('trust proxy', 1);

// JSON middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session and Passport
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

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
    // Register authentication routes
    registerAuthRoutes(app);

    // Register custom API routes
    await registerRoutes(app);

    // Payload 3.x automatically creates its routes on the Express app
    // No need to manually mount middleware
    // Routes available:
    // - /admin/* - Admin panel
    // - /api/* - REST API
    // - /graphql - GraphQL API (if enabled)

    // Debug: Log all registered routes
    app._router.stack.forEach((middleware: any) => {
      if (middleware.route) {
        log(`Route registered: ${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
      } else if (middleware.name === 'router') {
        middleware.handle.stack.forEach((handler: any) => {
          if (handler.route) {
            log(`Nested route: ${Object.keys(handler.route.methods)} ${handler.route.path}`);
          }
        });
      }
    });

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
