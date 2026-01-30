import type { Express, Request, Response, NextFunction } from 'express';
import passport from './passport';
import bcrypt from 'bcryptjs';
import { storage } from '../storage';

export function registerAuthRoutes(app: Express) {
  app.post('/api/auth/login', (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (err: any, user: Express.User | false, info: any) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur' });
      if (!user) return res.status(401).json({ message: info?.message || 'Authentification échouée' });

      req.login(user, (err) => {
        if (err) return res.status(500).json({ message: 'Erreur de session' });
        const { password, ...userWithoutPassword } = user as any;
        return res.json({ message: 'Connexion réussie', user: userWithoutPassword });
      });
    })(req, res, next);
  });

  app.post('/api/auth/logout', (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: 'Erreur de déconnexion' });
      res.json({ message: 'Déconnexion réussie' });
    });
  });

  app.get('/api/auth/me', (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Non authentifié' });
    }
    const { password, ...userWithoutPassword } = req.user as any;
    res.json({ user: userWithoutPassword });
  });

  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const { email, password, username, fullName, role, phone } = req.body;
      if (!email || !password || !username) {
        return res.status(400).json({ message: 'Email, mot de passe et nom d\'utilisateur requis' });
      }

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: 'Email déjà utilisé' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        email,
        username,
        password: hashedPassword,
        fullName: fullName || null,
        role: role || 'parent',
        phone: phone || null,
        active: true,
      });

      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ message: 'Utilisateur créé', user: userWithoutPassword });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
}
