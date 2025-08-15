// // cloudinary.config.ts

// import {v2 as cloudinary} from "cloudinary"
// import { envVars } from "./env"

// cloudinary.config({
//     cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
//     api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
//     api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET
// })

// export const cloudinaryUpload = cloudinary








// config/cloudinary.config.ts
import { v2 as cloudinary } from 'cloudinary';
import { envVars } from './env';

/**
 * Cloudinary Configuration
 * - Sets up connection to Cloudinary service
 * - Enables secure file uploads
 */
cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
  secure: true // Always use HTTPS
});

export { cloudinary };

// Utility functions for Cloudinary operations
export const cloudinaryUtils = {
  /**
   * Upload file to Cloudinary
   */
  async uploadFile(file: Express.Multer.File, folder: string) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
          allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
          transformation: { width: 800, height: 800, crop: 'limit' }
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      
      uploadStream.end(file.buffer);
    });
  },

  /**
   * Delete file from Cloudinary
   */
  async deleteFile(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
  }
};