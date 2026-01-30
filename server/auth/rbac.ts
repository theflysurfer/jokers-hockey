import type { Request, Response, NextFunction } from 'express';

const ROLE_HIERARCHY = {
  admin: 100,
  director: 80,
  secretary: 70,
  treasurer: 70,
  coach: 60,
  photographer: 50,
  parent: 40,
};

export type Role = keyof typeof ROLE_HIERARCHY;

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Authentification requise' });
  }
  next();
}

export function requireRole(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Authentification requise' });
    }

    const user = req.user as any;
    const userRole = user.role as Role;
    const userLevel = ROLE_HIERARCHY[userRole] || 0;

    const hasPermission = allowedRoles.some((role) => {
      return userLevel >= ROLE_HIERARCHY[role];
    });

    if (!hasPermission) {
      return res.status(403).json({
        message: 'Permissions insuffisantes',
        required: allowedRoles,
        current: userRole,
      });
    }

    next();
  };
}

export const requireAdmin = requireRole('admin');
export const requireStaff = requireRole('coach');
