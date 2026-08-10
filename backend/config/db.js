import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Set public DNS servers on local Windows networks if needed, skip in Linux/cloud production environments (e.g. Render)
if (process.platform === 'win32' && process.env.NODE_ENV !== 'production') {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (e) {
    // Fallback
  }
}

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI;
    if (!connStr || connStr.includes('<username>')) {
      console.warn('⚠️  MONGODB_URI is using placeholder credentials or not set in .env file.');
      console.warn('⚠️  Running server in local fallback / memory storage mode.');
      return false;
    }

    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 8000
    });

    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host} [Database: ${conn.connection.name}]`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Atlas Connection Error: ${error.message}`);
    console.warn('⚠️  Falling back to in-memory event persistence mode.');
    return false;
  }
};

export default connectDB;
