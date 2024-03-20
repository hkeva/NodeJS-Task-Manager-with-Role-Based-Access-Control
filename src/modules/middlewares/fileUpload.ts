import { errorMessage } from "@src/constants/messages/errorMessages";
import { Request, Response, NextFunction } from "express";
import { FileConstants } from "@src/constants/constants";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "uploads");
  },
  filename: function (_req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: FileConstants.ALLOWED_FILE_SIZE },
  fileFilter: function (_req, file, cb) {
    checkFileType(file, cb);
  },
}).array("files", FileConstants.TOTAL_NUM_OF_FILES);

function checkFileType(
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  const filetypes = /jpeg|jpg|png|gif|docx|pdf|cvs|xlsx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error(errorMessage.allowedFleTypes));
  }
}

export const multerUploadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload(req, res, (err: any) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return next(
          res.status(400).json({ message: "Multer Error: " + err.message })
        );
      } else {
        return next(
          res.status(500).json({ message: "Unexpected Error: " + err.message })
        );
      }
    } else {
      const filesArray: { filename: string; size: number }[] = [];

      if (Array.isArray(req.files)) {
        req.files.forEach((file: Express.Multer.File) => {
          filesArray.push({
            filename: file.filename,
            size: file.size,
          });
        });
      } else {
        Object.values(req.files).forEach((fileArray: Express.Multer.File[]) => {
          fileArray.forEach((file: Express.Multer.File) => {
            filesArray.push({
              filename: file.filename,
              size: file.size,
            });
          });
        });
      }
    }

    next();
  });
};
