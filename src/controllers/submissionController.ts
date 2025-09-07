import { Request, Response } from 'express';
import { sanitizeInput } from '../utils/sanitizer';
import { insertSubmission, getSubmissions, getSubmissionById } from '../models/submissionModel';
import { callFaceSwapAPI } from '../services/faceSwapService';
import path from 'path';
import fs from 'fs';

export const showForm = (req: Request, res: Response) => {
  res.render('index');
};

export const handleSubmit = async (req: Request, res: Response) => {
  try {
    const name = sanitizeInput(req.body.name);
    const email = sanitizeInput(req.body.email);
    const phone = sanitizeInput(req.body.phone);

    if (!req.file && !req.body.cameraImage) {
      return res.status(400).send('Image is required');
    }

    let originalImageBuffer: any;

    if (req.file) {
      originalImageBuffer = fs.readFileSync(req.file.path);
    } else if (req.body.cameraImage) {
      const base64Data = req.body.cameraImage.replace(/^data:image\/\w+;base64,/, '');
      originalImageBuffer = Buffer.from(base64Data, 'base64');
    } else {
      return res.status(400).send('Image is required');
    }

    const swappedImageBuffer = await callFaceSwapAPI(originalImageBuffer);

    const record = {
      name,
      email,
      phone,
      termsAccepted: true,
      createdAt: new Date(),
      originalImage: originalImageBuffer,
      swappedImage: swappedImageBuffer,
    };

    await insertSubmission(record);

    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    res.redirect('/submissions');
  } catch (err) {
    console.error('Submission error:', err);
    res.status(500).send('Internal Server Error');
  }
};


export const listSubmissions = async (_req: Request, res: Response) => {
  const submissions = await getSubmissions();
  res.render('submissions', { submissions });
};

export const downloadSubmissionImage = async (req: Request, res: Response) => {
  const id = req.params.id;
  const type = req.query.type === "originalImage" ? "originalImage" : "swappedImage";
  const submission = await getSubmissionById(id);

  if (!submission || !submission[type]) {
    return res.status(404).send("Image not found");
  }

  const field = submission[type];

  // Extract actual Buffer
  let imgBuffer: any;
  if (field?.buffer) {
    imgBuffer = field.buffer; // Mongo Binary object
  } else {
    imgBuffer = field as Buffer; // Already a Buffer
  }

  // Detect format from magic number
  let contentType = "application/octet-stream";
  if (imgBuffer.subarray(0, 8).toString("hex") === "89504e470d0a1a0a") {
    contentType = "image/png";
  } else if (imgBuffer.subarray(0, 2).toString("hex") === "ffd8") {
    contentType = "image/jpeg";
  }

  res.setHeader("Content-Type", contentType);
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${type}.${contentType.split("/")[1]}"`
  );
  res.send(imgBuffer);
};

export default {
  showForm,
  handleSubmit,
  listSubmissions,
  downloadSubmissionImage,
};
