import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import eventRoutes from './routes/eventRoutes.js';
import historyRoutes from './routes/historyRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

// Connect to MongoDB Atlas Database
connectDB();

// Robust CORS Middleware for local dev & production hosting (Render, Vercel, Netlify)
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/events', eventRoutes);
app.use('/api/history', historyRoutes);

// Root Status & Health Check Endpoints for Render
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Alaap Music Club API',
    message: '🚀 Backend API is running live on Render!',
    documentation: '/api/events',
    health: '/api/health',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Alaap Music Club API',
    database: 'MongoDB Atlas',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

const PORT = parseInt(process.env.PORT, 10) || 5000;
const HOST = '0.0.0.0'; // Bind to 0.0.0.0 for Render, Docker & Cloud container routing

app.listen(PORT, HOST, () => {
  console.log(`🚀 Alaap Express Backend Server running on http://${HOST}:${PORT}`);
  console.log(`📡 Events API endpoint: http://${HOST}:${PORT}/api/events`);
  console.log(`📜 History API endpoint: http://${HOST}:${PORT}/api/history`);
});

