import { ObjectId } from 'mongodb';
import { getDB } from '../db';

const COLLECTION = 'submissions';

export interface Submission {
  _id?: ObjectId;
  name: string;
  email: string;
  phone: string;
  termsAccepted: boolean;
  createdAt: Date;
  originalImage: Buffer;
  swappedImage: Buffer;
}

export const insertSubmission = async (submission: Submission): Promise<void> => {
  const db = getDB();
  await db.collection(COLLECTION).insertOne(submission);
};

export const getSubmissions = async (): Promise<Submission[]> => {
  const db = getDB();
  return (await db
  .collection<Submission>(COLLECTION)
  .find({})
  .project({ originalImage: 0, swappedImage: 0 })
  .toArray()) as Submission[];
};

export const getSubmissionById = async (id: string): Promise<Submission | null> => {
  const db = getDB();
  return await db.collection<Submission>(COLLECTION).findOne({ _id: new ObjectId(id) });
};
