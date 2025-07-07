# Image API Documentation

This document describes the Image API endpoints for uploading, updating, and managing images in the LAP Backend using Backblaze B2 storage.

## Overview

The Image API provides specialized endpoints for handling image files with built-in validation, metadata extraction, and optimization features. All images are validated for format, size, and dimensions before processing.

## Base URL

```
/api/images
```

## Image Validation

All uploaded images are automatically validated for:
- **Supported formats**: JPEG, PNG, GIF, WebP, BMP, TIFF
- **File size**: Maximum 10MB
- **Dimensions**: Maximum 4096x4096 pixels
- **Security**: File header validation to prevent malicious uploads

## Endpoints

### 1. Upload Single Image

Upload a new image to storage.

**Endpoint:** `POST /api/images/upload`

**Content-Type:** `multipart/form-data`

**Parameters:**
- `image` (required): Image file to upload
- `fileName` (optional): Custom filename for the image
- `userId` (optional): ID of the user uploading the image

**Example Request:**
```bash
curl -X POST \
  -F "image=@/path/to/image.jpg" \
  -F "fileName=my-custom-image.jpg" \
  -F "userId=user123" \
  http://localhost:8080/api/images/upload
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "imageId": "4_z27c88f1d182b150646ff7f01_f200ec485_o260318_v0312004_t0028",
  "fileName": "my-custom-image.jpg",
  "originalFileName": "image.jpg",
  "imageUrl": "https://f000.backblazeb2.com/file/my-bucket/my-custom-image.jpg",
  "downloadUrl": "https://f000.backblazeb2.com/file/my-bucket/my-custom-image.jpg",
  "fileSize": 245760,
  "contentType": "image/jpeg",
  "dimensions": {
    "width": 1920,
    "height": 1080
  },
  "uploadTimestamp": 1703875200000,
  "metadata": {
    "originalFileName": "image.jpg",
    "uploadedBy": "user123",
    "timestamp": "1703875200000",
    "fileType": "image",
    "imageWidth": "1920",
    "imageHeight": "1080"
  },
  "isUpdate": false
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Image validation failed: File size exceeds maximum allowed size of 10MB"
}
```

### 2. Update Existing Image

Replace an existing image with a new one.

**Endpoint:** `PUT /api/images/update/{fileName}`

**Content-Type:** `multipart/form-data`

**Parameters:**
- `fileName` (path): Name of the existing image file
- `image` (required): New image file to replace the existing one
- `userId` (optional): ID of the user updating the image

**Example Request:**
```bash
curl -X PUT \
  -F "image=@/path/to/new-image.jpg" \
  -F "userId=user123" \
  http://localhost:8080/api/images/update/my-custom-image.jpg
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Image updated successfully",
  "imageId": "4_z27c88f1d182b150646ff7f01_f200ec486_o260319_v0312005_t0028",
  "fileName": "my-custom-image.jpg",
  "originalFileName": "new-image.jpg",
  "imageUrl": "https://f000.backblazeb2.com/file/my-bucket/my-custom-image.jpg",
  "downloadUrl": "https://f000.backblazeb2.com/file/my-bucket/my-custom-image.jpg",
  "fileSize": 189440,
  "contentType": "image/jpeg",
  "dimensions": {
    "width": 1024,
    "height": 768
  },
  "uploadTimestamp": 1703875260000,
  "metadata": {
    "originalFileName": "new-image.jpg",
    "uploadedBy": "user123",
    "timestamp": "1703875260000",
    "fileType": "image",
    "imageWidth": "1024",
    "imageHeight": "768",
    "isUpdate": "true",
    "previousImageId": "4_z27c88f1d182b150646ff7f01_f200ec485_o260318_v0312004_t0028",
    "updateTimestamp": "1703875260000"
  },
  "isUpdate": true,
  "previousImageId": "4_z27c88f1d182b150646ff7f01_f200ec485_o260318_v0312004_t0028"
}
```

### 3. Upload or Update Image (Upsert)

Upload a new image or update an existing one based on filename.

**Endpoint:** `POST /api/images/upsert/{fileName}`

**Content-Type:** `multipart/form-data`

**Parameters:**
- `fileName` (path): Name of the image file
- `image` (required): Image file to upload or update
- `userId` (optional): ID of the user performing the operation

**Example Request:**
```bash
curl -X POST \
  -F "image=@/path/to/image.jpg" \
  -F "userId=user123" \
  http://localhost:8080/api/images/upsert/profile-image.jpg
```

**Response:** Same as upload or update depending on whether the file exists.

### 4. Download Image

Download an image file.

**Endpoint:** `GET /api/images/download/{fileName}`

**Parameters:**
- `fileName` (path): Name of the image file

**Example Request:**
```bash
curl -X GET http://localhost:8080/api/images/download/my-custom-image.jpg \
  -o downloaded_image.jpg
```

**Success Response:** Returns the image file with appropriate headers.

### 5. Get Image Information

Get metadata and information about an image.

**Endpoint:** `GET /api/images/info/{fileName}`

**Parameters:**
- `fileName` (path): Name of the image file

**Example Request:**
```bash
curl -X GET http://localhost:8080/api/images/info/my-custom-image.jpg
```

**Success Response (200):**
```json
{
  "success": true,
  "imageId": "4_z27c88f1d182b150646ff7f01_f200ec485_o260318_v0312004_t0028",
  "fileName": "my-custom-image.jpg",
  "fileSize": 245760,
  "contentType": "image/jpeg",
  "uploadTimestamp": 1703875200000,
  "dimensions": {
    "width": 1920,
    "height": 1080
  },
  "metadata": {
    "originalFileName": "image.jpg",
    "uploadedBy": "user123",
    "timestamp": "1703875200000",
    "fileType": "image",
    "imageWidth": "1920",
    "imageHeight": "1080"
  },
  "downloadUrl": "https://f000.backblazeb2.com/file/my-bucket/my-custom-image.jpg"
}
```

### 6. List Images

Get a list of all images in the bucket.

**Endpoint:** `GET /api/images/list`

**Query Parameters:**
- `prefix` (optional): Filter images by filename prefix
- `maxCount` (optional, default=50): Maximum number of images to return

**Example Request:**
```bash
curl -X GET "http://localhost:8080/api/images/list?prefix=profile&maxCount=20"
```

**Success Response (200):**
```json
{
  "success": true,
  "totalImages": 2,
  "images": [
    {
      "imageId": "4_z27c88f1d182b150646ff7f01_f200ec485_o260318_v0312004_t0028",
      "fileName": "profile-image-1.jpg",
      "fileSize": 245760,
      "contentType": "image/jpeg",
      "uploadTimestamp": 1703875200000,
      "dimensions": {
        "width": 1920,
        "height": 1080
      },
      "metadata": {
        "originalFileName": "profile.jpg",
        "uploadedBy": "user123"
      },
      "downloadUrl": "https://f000.backblazeb2.com/file/my-bucket/profile-image-1.jpg"
    },
    {
      "imageId": "4_z27c88f1d182b150646ff7f01_f200ec486_o260319_v0312005_t0028",
      "fileName": "profile-image-2.jpg",
      "fileSize": 189440,
      "contentType": "image/png",
      "uploadTimestamp": 1703875260000,
      "dimensions": {
        "width": 1024,
        "height": 768
      },
      "metadata": {
        "originalFileName": "avatar.png",
        "uploadedBy": "user456"
      },
      "downloadUrl": "https://f000.backblazeb2.com/file/my-bucket/profile-image-2.jpg"
    }
  ]
}
```

### 7. Delete Image

Delete an image from storage.

**Endpoint:** `DELETE /api/images/delete/{fileName}`

**Parameters:**
- `fileName` (path): Name of the image file to delete

**Example Request:**
```bash
curl -X DELETE http://localhost:8080/api/images/delete/my-custom-image.jpg
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Image deleted successfully",
  "fileName": "my-custom-image.jpg"
}
```

### 8. Get Image URL

Get the download URL for an image without downloading it.

**Endpoint:** `GET /api/images/url/{fileName}`

**Parameters:**
- `fileName` (path): Name of the image file

**Example Request:**
```bash
curl -X GET http://localhost:8080/api/images/url/my-custom-image.jpg
```

**Success Response (200):**
```json
{
  "success": true,
  "fileName": "my-custom-image.jpg",
  "imageUrl": "https://f000.backblazeb2.com/file/my-bucket/my-custom-image.jpg",
  "downloadUrl": "https://f000.backblazeb2.com/file/my-bucket/my-custom-image.jpg"
}
```

### 9. Validate Image

Validate an image file without uploading it.

**Endpoint:** `POST /api/images/validate`

**Content-Type:** `multipart/form-data`

**Parameters:**
- `image` (required): Image file to validate

**Example Request:**
```bash
curl -X POST \
  -F "image=@/path/to/image.jpg" \
  http://localhost:8080/api/images/validate
```

**Success Response (200):**
```json
{
  "success": true,
  "valid": true,
  "fileName": "image.jpg",
  "fileSize": 245760,
  "contentType": "image/jpeg",
  "dimensions": {
    "width": 1920,
    "height": 1080
  },
  "metadata": {
    "actualContentType": "Unknown",
    "colorModel": "java.awt.image.DirectColorModel",
    "hasAlpha": "false"
  }
}
```

**Validation Failed Response (200):**
```json
{
  "success": true,
  "valid": false,
  "fileName": "large-image.jpg",
  "fileSize": 15728640,
  "contentType": "image/jpeg",
  "errors": [
    "File size exceeds maximum allowed size of 10MB",
    "Image dimensions (5000x3000) exceed maximum allowed dimensions (4096x4096)"
  ]
}
```

### 10. Health Check

Check the health status of the image service.

**Endpoint:** `GET /api/images/health`

**Example Request:**
```bash
curl -X GET http://localhost:8080/api/images/health
```

**Success Response (200):**
```json
{
  "success": true,
  "status": "healthy",
  "service": "Image Storage Service",
  "timestamp": 1703875200000,
  "maxImageSize": 10485760,
  "maxDimensions": "4096x4096"
}
```

## Frontend Integration Examples

### JavaScript/React Example

```javascript
// Upload image
const uploadImage = async (imageFile, fileName, userId) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  if (fileName) formData.append('fileName', fileName);
  if (userId) formData.append('userId', userId);

  try {
    const response = await fetch('/api/images/upload', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Image uploaded:', result);
      return result;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

// Update image
const updateImage = async (fileName, newImageFile, userId) => {
  const formData = new FormData();
  formData.append('image', newImageFile);
  if (userId) formData.append('userId', userId);

  try {
    const response = await fetch(`/api/images/update/${fileName}`, {
      method: 'PUT',
      body: formData
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Image updated:', result);
      return result;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Update failed:', error);
    throw error;
  }
};

// Validate image before upload
const validateImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await fetch('/api/images/validate', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Validation failed:', error);
    throw error;
  }
};

// List images
const listImages = async (prefix = '', maxCount = 50) => {
  try {
    const response = await fetch(`/api/images/list?prefix=${prefix}&maxCount=${maxCount}`);
    const result = await response.json();
    
    if (result.success) {
      return result.images;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Failed to list images:', error);
    throw error;
  }
};
```

### HTML Form Example

```html
<!DOCTYPE html>
<html>
<head>
    <title>Image Upload</title>
</head>
<body>
    <h2>Upload Image</h2>
    <form id="uploadForm" enctype="multipart/form-data">
        <div>
            <label for="imageFile">Choose Image:</label>
            <input type="file" id="imageFile" name="image" accept="image/*" required>
        </div>
        <div>
            <label for="fileName">Custom File Name (optional):</label>
            <input type="text" id="fileName" name="fileName" placeholder="my-image.jpg">
        </div>
        <div>
            <label for="userId">User ID (optional):</label>
            <input type="text" id="userId" name="userId" placeholder="user123">
        </div>
        <button type="submit">Upload Image</button>
    </form>

    <div id="result"></div>

    <script>
        document.getElementById('uploadForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const resultDiv = document.getElementById('result');
            
            try {
                const response = await fetch('/api/images/upload', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    resultDiv.innerHTML = `
                        <h3>Upload Successful!</h3>
                        <p><strong>Image ID:</strong> ${result.imageId}</p>
                        <p><strong>File Name:</strong> ${result.fileName}</p>
                        <p><strong>File Size:</strong> ${result.fileSize} bytes</p>
                        <p><strong>Dimensions:</strong> ${result.dimensions.width}x${result.dimensions.height}</p>
                        <p><strong>Download URL:</strong> <a href="${result.downloadUrl}" target="_blank">${result.downloadUrl}</a></p>
                    `;
                } else {
                    resultDiv.innerHTML = `<p style="color: red;">Error: ${result.message}</p>`;
                }
            } catch (error) {
                resultDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
            }
        });
    </script>
</body>
</html>
```

## Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "success": false,
  "message": "Image validation failed: Unsupported file type: application/pdf"
}
```

#### 404 Not Found
```json
{
  "success": false,
  "message": "Image not found"
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to upload image to storage: Connection timeout"
}
```

### Validation Error Details

When validation fails, the response includes detailed error information:

```json
{
  "success": false,
  "message": "Image validation failed: File size exceeds maximum allowed size of 10MB; Image dimensions (5000x3000) exceed maximum allowed dimensions (4096x4096)"
}
```

## Best Practices

### 1. File Naming
- Use descriptive, URL-safe filenames
- Include file extensions
- Consider using UUIDs for uniqueness
- Avoid special characters and spaces

### 2. Image Optimization
- Compress images before upload to reduce file size
- Use appropriate formats (JPEG for photos, PNG for graphics with transparency)
- Consider generating thumbnails for large images

### 3. Error Handling
- Always validate images client-side before upload
- Handle network errors gracefully
- Provide user-friendly error messages
- Implement retry logic for failed uploads

### 4. Security
- Validate file types on both client and server
- Limit file sizes to prevent abuse
- Sanitize filenames to prevent path traversal attacks
- Consider virus scanning for production environments

### 5. Performance
- Use the validation endpoint before upload for better UX
- Implement progress indicators for large uploads
- Consider using image CDN for better performance
- Cache image URLs when possible

## Rate Limits

To prevent abuse, consider implementing rate limits:
- Max 100 uploads per user per hour
- Max 10 concurrent uploads per user
- Max 50MB total upload per user per day

## Monitoring and Logging

The service logs:
- All upload/update operations
- Validation failures
- File deletion events
- Error conditions
- Performance metrics

Check application logs for troubleshooting and monitoring purposes.