
import cloudinary from '../config/cloudinary.js';

// =============== In used : delete file or files - when err occur
export const deleteCloudinaryFiles = async (fileData) => {
    try {
        if (!fileData) return;

        let files = [];

        if (fileData.filename) {
            files.push(fileData);
        } else {
            files = Object.values(fileData).flat();
        }

        for (const file of files) {
            if (!file.filename) continue;
            const resourceType = file.mimetype === 'application/pdf' ? 'raw' : 'image';
            await cloudinary.uploader.destroy(file.filename, { resource_type: resourceType });
            console.log(`Cleanup Done: Deleted ${file.filename} (${resourceType}) from Cloudinary`);
        }
    } catch (error) {
        console.error("Cloudinary Cleanup Error:", error);
    }
};

// for update api - dlt old files
export const deleteStoredFile = async (publicId, resourceType = 'image') => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error('Cloudinary Delete Error:', error);
  }
};

// cleaning Cloudinary files if validation fails
export const cleanupUploadedFiles = async (files) => {
    if (!files) return;
    await deleteCloudinaryFiles(files);
};

// multiple image deletions from Cloudinary - update api
export const deleteGalleryImages = async (imageArray) => {
    try {
        if (imageArray && Array.isArray(imageArray) && imageArray.length > 0) {
            await Promise.all(
                imageArray.map(imgUrl => deleteOldFileFromCloudinary(imgUrl))
            );
            console.log(`Successfully deleted ${imageArray.length} gallery images.`);
        }
    } catch (error) {
        console.error("Error in deleteGalleryImages helper:", error);
    }
};

// Specially for Delete API - Handles URLs and Spaces
export const deleteProductAssetsFromCloudinary = async (urls) => {
    try {
        if (!urls || !Array.isArray(urls) || urls.length === 0) return;

        // reuse existing deleteOldFileFromCloudinary for each URL
        await Promise.all(
            urls.map(url => deleteOldFileFromCloudinary(url))
        );

        console.log(`Processed ${urls.length} images for deletion.`);
    } catch (error) {
        console.error("Error in deleteProductAssetsFromCloudinary:", error);
    }
};

// ============== new: extract public_id from a Cloudinary URL and delete the file
export const deleteOldFileFromCloudinary = async (url) => {
    try {
        if (!url || typeof url !== 'string') return;

        // matches: .../upload/v123456789/folder/subfolder/filename.ext
        const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);

        if (!match || !match[1]) {
            console.error("Could not extract public_id from URL:", url);
            return;
        }

        const publicId = match[1];
        const resourceType = url.includes('.pdf') ? 'raw' : 'image';

        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        console.log(`Deleted old file: ${publicId}`);
    } catch (error) {
        console.error("Error deleting old Cloudinary file:", error);
    }
};