import { Router } from 'express';
import { createIncomingDocument, getIncomingDocuments } from '../controllers/incoming.controller';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';
import upload from '../middlewares/upload.middleware';

const router = Router();

router.get('/', authenticateToken, getIncomingDocuments);

router.post(
  '/', 
  authenticateToken, 
  requireRole(['ADMIN', 'CLERK']), 
  upload.array('files', 10), 
  createIncomingDocument
);

export default router;