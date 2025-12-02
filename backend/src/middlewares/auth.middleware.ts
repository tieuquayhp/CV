import { Request as ExpressRequest, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthRequest extends ExpressRequest {
  user?: {
    id: string;
    role: string;
    departmentIds: string[];
  };
  files?: any;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access token required' });

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    
    // Get user departments for data access control
    const userDepartments = await prisma.userDepartment.findMany({
      where: { userId: decoded.id },
      select: { departmentId: true }
    });

    req.user = {
      id: decoded.id,
      role: decoded.role,
      departmentIds: userDepartments.map(ud => ud.departmentId)
    };
    
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Permission denied' });
    }
    next();
  };
};