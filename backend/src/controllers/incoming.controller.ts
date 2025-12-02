import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();

export const createIncomingDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { 
      year, issueDateIncoming, originalIssuer, originalCode, 
      originalIssueDate, summary, projectId, departmentIds 
    } = req.body;

    const files = req.files as any[];

    // Transaction to ensure sequence integrity
    const result = await prisma.$transaction(async (tx) => {
      // 1. Get and increment sequence number
      let sequence = await tx.incomingNumberSequence.findUnique({ where: { year: Number(year) } });
      
      if (!sequence) {
        sequence = await tx.incomingNumberSequence.create({ data: { year: Number(year), currentNumber: 0 } });
      }

      const nextNumber = sequence.currentNumber + 1;
      await tx.incomingNumberSequence.update({
        where: { year: Number(year) },
        data: { currentNumber: nextNumber }
      });

      // 2. Create document
      // Parse departmentIds from string (since it's multipart/form-data)
      let deptIds: string[] = [];
      try {
        deptIds = typeof departmentIds === 'string' ? JSON.parse(departmentIds) : departmentIds;
      } catch (e) {
        console.error("Error parsing departmentIds", e);
      }

      const doc = await tx.incomingDocument.create({
        data: {
          year: Number(year),
          incomingNumber: nextNumber,
          issueDateIncoming: new Date(issueDateIncoming),
          originalIssuer,
          originalCode,
          originalIssueDate: originalIssueDate ? new Date(originalIssueDate) : null,
          summary,
          projectId: projectId || null,
          createdByUserId: req.user!.id,
          departments: {
            create: deptIds.map((deptId: string) => ({
              department: { connect: { id: deptId } }
            }))
          }
        }
      });

      // 3. Save attachments info
      if (files && files.length > 0) {
        await tx.attachment.createMany({
          data: files.map(file => ({
            fileName: file.originalname,
            filePath: file.path, 
            contentType: file.mimetype,
            fileSize: file.size,
            incomingDocumentId: doc.id,
            uploadedByUserId: req.user!.id
          }))
        });
      }

      return doc;
    });

    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getIncomingDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, keyword, year } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    // Build Where clause
    let whereClause: any = {};

    if (year) whereClause.year = Number(year);
    if (keyword) {
      whereClause.OR = [
        { summary: { contains: String(keyword), mode: 'insensitive' } },
        { originalCode: { contains: String(keyword), mode: 'insensitive' } },
        { originalIssuer: { contains: String(keyword), mode: 'insensitive' } }
      ];
    }

    // AUTH LOGIC: Staff can only see docs related to their departments
    if (req.user?.role === 'STAFF') {
      whereClause.departments = {
        some: {
          departmentId: { in: req.user.departmentIds }
        }
      };
    }

    const [docs, total] = await Promise.all([
      prisma.incomingDocument.findMany({
        where: whereClause,
        include: {
          departments: { include: { department: true } },
          attachments: true,
          project: true
        },
        orderBy: { incomingNumber: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.incomingDocument.count({ where: whereClause })
    ]);

    res.json({
      success: true,
      data: docs,
      pagination: { total, page: Number(page), limit: Number(limit) }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};