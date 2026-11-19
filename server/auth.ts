import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db, UserDoc } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'glamtrack_super_secret_jwt_key_2026_beauty_stylist';
const TOKEN_EXPIRY = '7d';

export interface AuthRequest extends Request {
  user?: UserDoc;
}

export function generateToken(user: UserDoc): string {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await db.users.findById(payload.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found or session expired' });
    }
    req.user = user;
    next();
  } catch (err: any) {
    return res.status(403).json({ error: 'Invalid or expired JWT token', details: err.message });
  }
}

export async function optionalJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await db.users.findById(payload.userId);
    if (user) {
      req.user = user;
    }
  } catch {
    // Ignore invalid token in optional context
  }
  next();
}
