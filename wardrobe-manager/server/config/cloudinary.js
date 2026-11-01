import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export function uploadImage(buffer, userId) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: `wardrobe-manager/${userId}`, resource_type: 'image', transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto', fetch_format: 'auto' }] }, (error, result) => error ? reject(error) : resolve(result))
    stream.end(buffer)
  })
}
export const deleteImage = (publicId, userId) => publicId && userId && process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET && publicId.startsWith(`wardrobe-manager/${userId}/`) ? cloudinary.uploader.destroy(publicId, { resource_type: 'image' }) : Promise.resolve()
