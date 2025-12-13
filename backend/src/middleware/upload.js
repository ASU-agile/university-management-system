//backend/src/middleware/upload.js
import multer from "multer";

const storage = multer.memoryStorage(); // store file in RAM so we can send to Supabase

const upload = multer({ storage });

export default upload;
