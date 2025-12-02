import express from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/auth.routes';
import incomingRoutes from './routes/incoming.routes';
import outgoingRoutes from './routes/outgoing.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (attachments)
// Note: In production on Synology, you might want to protect this route or serve via Nginx
const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'data/attachments');
app.use('/uploads', express.static(uploadDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/incoming-documents', incomingRoutes);
app.use('/api/outgoing-documents', outgoingRoutes);

// Health Check
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'EO-Backend' });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: err.message || 'Internal Server Error' 
  });
});

export default app;