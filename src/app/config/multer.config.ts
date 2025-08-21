/* eslint-disable @typescript-eslint/no-explicit-any */
import multer from 'multer';
import httpStatus from 'http-status-codes';
import AppError from '../errorHelpers/appError';

/**
 * Multer configuration for memory storage
 * - Stores files in memory (no disk writes)
 * - Better for Cloudinary integration
 */
const memoryStorage = multer.memoryStorage();

/**
 * File filter for image validation
 */
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError(httpStatus.BAD_REQUEST, 'Only image files are allowed!'), false);
  }
};

/**
 * Multer instance for single file upload
 */
export const uploadSingle = multer({
  storage: memoryStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1
  }
});

/**
 * Multer instance for multiple file upload
 */
export const uploadMultiple = multer({
  storage: memoryStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 5 // Max 5 files
  }
});