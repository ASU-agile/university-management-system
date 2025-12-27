//backend/src/middleware/upload.js
import multer from "multer";

const storage = multer.memoryStorage(); // store file in RAM so we can send to Supabase

const upload = multer({ 
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

export default upload;
