import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI!);
let db: Db;

export const connectDB = async (): Promise<void> => {
  await client.connect();
  db = client.db(process.env.DB_NAME);
  console.log('Connected to MongoDB Atlas');
};

export const getDB = (): Db => {
  if (!db) {
    throw new Error('DB not initialized');
  }
  return db;
};
