import fs from 'fs';
import path from 'path';
import axios from 'axios';

const SEGMIND_API_URL = 'https://api.segmind.com/v1/faceswap-v2';
const SEGMIND_API_KEY = process.env.SEGMIND_API_KEY;

// Convert image file from filesystem to base64 string
function imageFileToBase64(imagePath: string): string {
  const imageData = fs.readFileSync(path.resolve(imagePath));
  return Buffer.from(imageData).toString('base64');
}

// Fetch image from URL and convert to base64 string
async function imageUrlToBase64(imageUrl: string): Promise<string> {
  const response: any = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  return Buffer.from(response.data, 'binary').toString('base64');
}

export const callFaceSwapAPI = async (sourceImageBuffer: Buffer): Promise<Buffer> => {
  if (!SEGMIND_API_KEY) {
    throw new Error('Missing SEGMIND_API_KEY environment variable');
  }

  // Convert the source buffer to base64 string
  const sourceBase64 = sourceImageBuffer.toString('base64');

  // Path to your fixed target image file
  const targetImagePath = path.resolve(__dirname, '../../public/images/target.jpg');
  const targetBase64 = imageFileToBase64(targetImagePath);

  const data = {
    source_img: sourceBase64,
    target_img: targetBase64,
    input_faces_index: 0,
    source_faces_index: 0,
    face_restore: 'codeformer-v0.1.0.pth',
    base64: true  // Request response as base64 image data
  };

  try {
    const response: any = await axios.post(SEGMIND_API_URL, data, {
      headers: {
        'x-api-key': SEGMIND_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.data || !response.data.image) {
      throw new Error('Face swap failed: no image data returned');
    }

    // The response contains the swapped face as a base64-encoded string
    const swappedImageBase64 = response.data.image;

    // Convert base64 string back to buffer and return
    return Buffer.from(swappedImageBase64, 'base64');

  } catch (error: any) {
    throw new Error(`Face swap API error: ${error.response?.data || error.message}`);
  }
};
