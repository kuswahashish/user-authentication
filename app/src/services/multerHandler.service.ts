import multer, { StorageEngine } from 'multer';
import path from 'path';
import { Request, Response, NextFunction } from 'express';


// Define custom storage engine
const storage: StorageEngine = {
  _handleFile: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    const filePath = path.join('public/uploads/', filename);

    file.stream.pipe(require('fs').createWriteStream(filePath));
    cb(null, { path: filePath, filename });
  },
  _removeFile: (req, file, cb) => {
    require('fs').unlink(file.path, cb);
  }
};

// allow only .jpg and .png files
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpg|jpeg|png/; //Changes as per requirement
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only .jpg, .jpeg, and .png files are allowed!'));
  }
};

// Create multer upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // Limit file size to 2MB
});

export default upload;
