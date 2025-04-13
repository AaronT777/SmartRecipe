const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'smartrecipe',
    allowed_formats: ['jpg', 'jpeg', 'png']
  }
});

const upload = multer({ storage: storage });

// 从 Cloudinary URL 中提取公共 ID
const extractPublicId = (cloudinaryUrl) => {
    if (!cloudinaryUrl) return null;
    try {
      // 提取 URL 路径部分
      const urlPath = new URL(cloudinaryUrl).pathname;
      // 路径格式为: /image/upload/v1744536945/folder/filename.extension
      // 需要提取 folder/filename 部分
      const matches = urlPath.match(/\/image\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
      return matches && matches[1];
    } catch (err) {
      console.error("Failed to extract public ID from URL:", err);
      return null;
    }
  };

module.exports = {
  cloudinary,
  upload,
  extractPublicId
};