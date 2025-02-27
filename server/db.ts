import mongoose from 'mongoose';
import { defaultConfig } from '@shared/config/appConfig';

// Make sure the MONGODB_URI is set
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error(
    'MONGODB_URI must be set. Did you forget to set the environment variable?'
  );
}

export async function connectDB() {
  try {
    // Configure Mongoose
    mongoose.set('strictQuery', true);

    // Connect with proper options
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Keep trying for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    console.log(`MongoDB Connected to "${defaultConfig.app.name}" database...`);

    // Add event listeners for connection issues
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB Connection Error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB Connection Disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.info('MongoDB Connection Reestablished');
    });

  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    throw err; // Let the caller handle the error
  }
}

export const db = mongoose.connection;