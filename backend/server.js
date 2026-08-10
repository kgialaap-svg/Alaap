import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import eventRoutes from './routes/eventRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

// Connect to MongoDB Atlas Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/events', eventRoutes);

// Root Status Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Alaap Music Club API',
    database: 'MongoDB Atlas',
    timestamp: new Date().toISOString()
  });
});

let PORT = parseInt(process.env.PORT, 10) || 5000;

const startServer = (portToTry) => {
  const server = app.listen(portToTry, () => {
    console.log(`🚀 Alaap Express Backend Server running on port ${portToTry}`);
    console.log(`📡 Events API endpoint: http://localhost:${portToTry}/api/events`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${portToTry} is in use, trying port ${portToTry + 1}...`);
      startServer(portToTry + 1);
    } else {
      console.error(`Server Error: ${err.message}`);
    }
  });
};

startServer(PORT);
