import type { Express } from 'express';
import { db } from '../db';
import { users, passwordResetTokens } from '@shared/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export function registerUserRoutes(app: Express) {
  // Get all users (admin only)
  app.get('/api/users', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    // Check if user is admin
    const currentUser = await db.select().from(users).where(eq(users.id, (req.user as any).id)).limit(1);
    if (!currentUser[0] || currentUser[0].role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const allUsers = await db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      fullName: users.fullName,
      role: users.role,
      active: users.active,
      createdAt: users.createdAt,
    }).from(users).orderBy(users.createdAt);

    res.json(allUsers);
  });

  // Create user (admin only)
  app.post('/api/users', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    // Check if user is admin
    const currentUser = await db.select().from(users).where(eq(users.id, (req.user as any).id)).limit(1);
    if (!currentUser[0] || currentUser[0].role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const { username, email, password, fullName, role } = req.body;

    // Check if username or email already exists
    const existing = await db.select().from(users).where(eq(users.username, username)).limit(1);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Ce nom d\'utilisateur existe déjà' });
    }

    const existingEmail = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingEmail.length > 0) {
      return res.status(400).json({ message: 'Cet email existe déjà' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db.insert(users).values({
      username,
      email,
      password: hashedPassword,
      fullName,
      role: role || 'parent',
      active: true,
    }).returning();

    res.json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      fullName: newUser.fullName,
      role: newUser.role,
    });
  });

  // Update user (admin or self)
  app.patch('/api/users/:id', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    const userId = parseInt(req.params.id);
    const currentUserId = (req.user as any).id;
    const currentUser = await db.select().from(users).where(eq(users.id, currentUserId)).limit(1);

    // Check if user can edit (admin or self)
    if (currentUser[0].role !== 'admin' && currentUserId !== userId) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const { fullName, email, phone, active, role } = req.body;

    const updates: any = {};
    if (fullName !== undefined) updates.fullName = fullName;
    if (email !== undefined) updates.email = email;
    if (phone !== undefined) updates.phone = phone;

    // Only admin can change active status and role
    if (currentUser[0].role === 'admin') {
      if (active !== undefined) updates.active = active;
      if (role !== undefined) updates.role = role;
    }

    updates.updatedAt = new Date();

    await db.update(users).set(updates).where(eq(users.id, userId));

    res.json({ message: 'Utilisateur mis à jour' });
  });

  // Delete user (admin only)
  app.delete('/api/users/:id', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    const currentUser = await db.select().from(users).where(eq(users.id, (req.user as any).id)).limit(1);
    if (!currentUser[0] || currentUser[0].role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const userId = parseInt(req.params.id);
    await db.delete(users).where(eq(users.id, userId));

    res.json({ message: 'Utilisateur supprimé' });
  });

  // Update profile (authenticated user)
  app.patch('/api/users/profile', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    const userId = (req.user as any).id;
    const { fullName, email, phone } = req.body;

    // Check if email already exists for another user
    if (email) {
      const existingEmail = await db.select().from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingEmail.length > 0 && existingEmail[0].id !== userId) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }
    }

    await db.update(users).set({
      fullName,
      email,
      phone,
      updatedAt: new Date(),
    }).where(eq(users.id, userId));

    res.json({ message: 'Profil mis à jour' });
  });

  // Change password (authenticated user)
  app.post('/api/users/change-password', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    const userId = (req.user as any).id;
    const { currentPassword, newPassword } = req.body;

    // Get user
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.update(users).set({
      password: hashedPassword,
      updatedAt: new Date(),
    }).where(eq(users.id, userId));

    res.json({ message: 'Mot de passe modifié' });
  });

  // Request password reset
  app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.' });
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save token to database
    await db.insert(passwordResetTokens).values({
      userId: user.id,
      token,
      expiresAt,
      used: false,
    });

    // TODO: Send email with reset link
    const resetLink = `${req.protocol}://${req.get('host')}/reset-password?token=${token}`;

    // For dev: log to console
    console.log('\n===== PASSWORD RESET =====');
    console.log(`User: ${user.email}`);
    console.log(`Link: ${resetLink}`);
    console.log(`Token expires: ${expiresAt.toLocaleString()}`);
    console.log('==========================\n');

    res.json({ message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.' });
  });

  // Reset password with token
  app.post('/api/auth/reset-password', async (req, res) => {
    const { token, password } = req.body;

    // Find valid token
    const [resetToken] = await db.select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token))
      .limit(1);

    if (!resetToken) {
      return res.status(400).json({ message: 'Token invalide' });
    }

    if (resetToken.used) {
      return res.status(400).json({ message: 'Ce token a déjà été utilisé' });
    }

    if (new Date() > resetToken.expiresAt) {
      return res.status(400).json({ message: 'Ce token a expiré' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password
    await db.update(users).set({
      password: hashedPassword,
      updatedAt: new Date(),
    }).where(eq(users.id, resetToken.userId));

    // Mark token as used
    await db.update(passwordResetTokens).set({
      used: true,
    }).where(eq(passwordResetTokens.id, resetToken.id));

    res.json({ message: 'Mot de passe réinitialisé avec succès' });
  });
}
