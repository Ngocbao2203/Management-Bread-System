import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
  api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
});

export const uploadImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      upload_preset: 'ml_default', // Tạo upload preset trên Cloudinary Dashboard
    });
    return result.secure_url; // Trả về URL của ảnh đã upload
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};