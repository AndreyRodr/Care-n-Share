import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadImage = (fileBuffer, folderName = 'cns_posts') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folderName },
      (error, result) => {
        if (error) return reject(error);
        resolve(result); 
      }
    );
    stream.end(fileBuffer);
  });
};

export const ongRegistrationUpload = multer({
  storage,
  limits: {
    fileSize: 8 * 1024 * 1024,
    files: 3
  },
  fileFilter: (req, file, callback) => {
    const isProfilePicture = file.fieldname === 'profilePicture';
    const isDocument =
      file.fieldname === 'statuteDocument' ||
      file.fieldname === 'addressProofDocument';

    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (isProfilePicture && allowedImageTypes.includes(file.mimetype)) {
      return callback(null, true);
    }

    if (isDocument && file.mimetype === 'application/pdf') {
      return callback(null, true);
    }

    return callback(
      new Error(
        'Envie foto de perfil em JPG, PNG ou WEBP e documentos apenas em PDF.'
      )
    );
  }
});

export const uploadPrivateDocument = (
  fileBuffer,
  folderName = 'care_n_share/ong_documents'
) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folderName,
        resource_type: 'raw',
        type: 'private'
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
};

export const createPrivateDocumentAccessUrl = (publicId, fileName) => {
  const expiresAt = Math.floor(Date.now() / 1000) + 5 * 60;

  return cloudinary.utils.private_download_url(publicId, null, {
    resource_type: 'raw',
    type: 'private',
    attachment: fileName,
    expires_at: expiresAt
  });
};