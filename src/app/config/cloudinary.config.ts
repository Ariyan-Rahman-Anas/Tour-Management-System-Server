import { v2 as cloudinary } from 'cloudinary';
import { envVars } from './env';
import { CloudinaryImage } from '../modules/tour/tour.interface';
import AppError from '../errorHelpers/appError';
import httpStatus from "http-status-codes"
import stream from "stream"

export interface CloudinaryResultI{
  url: string
  secure_url: string
  asset_folder: string
  display_name: string
  original_filename: string
 }

cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
  secure: true // Always use HTTPS
});

export { cloudinary };
  
const uploadBuffer = async (buffer: Buffer, fileName: string): Promise<CloudinaryResultI | undefined > => {
    try {
      return new Promise((resolve, reject) => {
        const public_id = `pdf/${fileName}-${Date.now()}`
        const bufferStream = new stream.PassThrough()
        bufferStream.end(buffer)

        cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            public_id,
            folder:"PDF"
          },
          (error, result) => {
            if (error) {
              reject(error)
            }
            resolve(result)
          }
        ).end(buffer)
  
      })
    } catch (error: any) {
      throw new AppError(httpStatus.BAD_REQUEST, `Error occurred during buffer upload: ${error.message}`)
    }
  }


  const uploadFile =async(file: Express.Multer.File, folder: string): Promise<CloudinaryImage>=>{
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
          allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
          transformation: { width: 800, height: 800, crop: 'limit' }
        },
        (error, result) => {
          if (error || !result) return reject(error || new Error('Upload failed'));
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
            // Map other properties you need
          });
        }
      );
      
      uploadStream.end(file.buffer);
    });
  }

  //  * Delete file from Cloudinary
  const deleteFile = async (publicId: string)=>{
    return cloudinary.uploader.destroy(publicId);
  }


export const cloudinaryUtils = {
  uploadFile,
  deleteFile,
  uploadBuffer
}