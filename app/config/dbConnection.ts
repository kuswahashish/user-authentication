import mongoose from 'mongoose';
import { get } from './config';




const connectDB = async () => {
  try {

    const config = get(process.env.NODE_ENV);
    await mongoose.connect(config.DATABASE_CONNECTION_URL);
    console.log('MongoDB connected');
  } catch (error:any) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
