import cloudinary from "cloudinary";
import * as dotenv from "dotenv";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

dotenv.config();

const cloudinaryInst = cloudinary.v2;

cloudinaryInst.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinaryInst,
  params: {
    folder: "picturesFromMyProject3",
    format: async (req, file) => "png",
  },
});

const uploadImgMulter = multer({ storage: cloudinaryStorage });

export { uploadImgMulter };
