# Backblaze B2 Integration Guide

This document explains how to integrate and use Backblaze B2 cloud storage with the LAP Backend.

## Overview

The LAP Backend now includes Backblaze B2 cloud storage integration, allowing you to:
- Upload files to B2 storage
- Download files from B2 storage
- Manage file metadata
- List and delete files
- Generate download URLs

## Setup Instructions

### 1. Get Your B2 Credentials

1. Create a Backblaze account at [https://www.backblaze.com/](https://www.backblaze.com/)
2. Go to the B2 Cloud Storage section
3. Create a new bucket for your application
4. Create an Application Key:
   - Go to "App Keys" in your B2 account
   - Click "Add a New Application Key"
   - Give it a name (e.g., "LAP-Backend")
   - Select your bucket or choose "All" for all buckets
   - Choose appropriate permissions (usually "Read and Write")
   - Copy the **Application Key ID** and **Application Key**

### 2. Configure Your Application

Add your B2 credentials to `src/main/resources/application.properties`:

```properties
# Backblaze B2 Configuration
b2.application.key.id=YOUR_B2_APPLICATION_KEY_ID_HERE
b2.application.key=YOUR_B2_APPLICATION_KEY_HERE
b2.bucket.name=YOUR_B2_BUCKET_NAME_HERE
```

**⚠️ Security Note**: For production environments, use environment variables instead of hardcoding credentials:

```properties
# Use environment variables in production
b2.application.key.id=${B2_APPLICATION_KEY_ID}
b2.application.key=${B2_APPLICATION_KEY}
b2.bucket.name=${B2_BUCKET_NAME}
```

### 3. Environment Variables (Recommended for Production)

Set these environment variables:

```bash
export B2_APPLICATION_KEY_ID="your_key_id_here"
export B2_APPLICATION_KEY="your_application_key_here"
export B2_BUCKET_NAME="your_bucket_name_here"
```

Or in your Docker environment:

```yaml
environment:
  - B2_APPLICATION_KEY_ID=your_key_id_here
  - B2_APPLICATION_KEY=your_application_key_here
  - B2_BUCKET_NAME=your_bucket_name_here
```

## API Endpoints

The following REST endpoints are available for file operations:

### Upload Files

#### Single File Upload
```http
POST /api/files/upload
Content-Type: multipart/form-data

Form data:
- file: (binary file)
```

#### Multiple Files Upload
```http
POST /api/files/upload/multiple
Content-Type: multipart/form-data

Form data:
- files: (multiple binary files)
```

### Download Files

#### Download by Filename
```http
GET /api/files/download/{fileName}
```

#### Download by File ID
```http
GET /api/files/download/id/{fileId}
```

#### Get Download URL
```http
GET /api/files/url/{fileName}
```

### File Management

#### List Files
```http
GET /api/files/list?prefix=optional_prefix&maxCount=100
```

#### Get File Information
```http
GET /api/files/info/{fileName}
```

#### Check if File Exists
```http
GET /api/files/exists/{fileName}
```

#### Delete File
```http
DELETE /api/files/delete/{fileName}
```

### System Information

#### Get Bucket Information
```http
GET /api/files/bucket/info
```

#### Health Check
```http
GET /api/files/health
```

## Usage Examples

### JavaScript/Frontend Examples

#### Upload a File
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('/api/files/upload', {
    method: 'POST',
    body: formData
})
.then(response => response.json())
.then(data => {
    console.log('Upload successful:', data);
    // data.fileId, data.fileName, etc.
});
```

#### Download a File
```javascript
fetch(`/api/files/download/${fileName}`)
.then(response => response.blob())
.then(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
});
```

#### List Files
```javascript
fetch('/api/files/list?maxCount=50')
.then(response => response.json())
.then(data => {
    console.log('Files:', data.files);
});
```

### cURL Examples

#### Upload a File
```bash
curl -X POST -F "file=@/path/to/your/file.jpg" \
  http://localhost:8080/api/files/upload
```

#### Download a File
```bash
curl -X GET http://localhost:8080/api/files/download/filename.jpg \
  -o downloaded_file.jpg
```

#### List Files
```bash
curl -X GET "http://localhost:8080/api/files/list?maxCount=10"
```

#### Delete a File
```bash
curl -X DELETE http://localhost:8080/api/files/delete/filename.jpg
```

## File Metadata

When uploading files, the system automatically adds metadata:
- `originalFileName`: The original name of the uploaded file
- `uploadedBy`: Set to "LAP-Backend" (can be customized)
- `timestamp`: Upload timestamp in milliseconds

## Error Handling

All endpoints return JSON responses with the following structure:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message describing what went wrong",
  "timestamp": 1234567890123
}
```

## Security Considerations

1. **Credentials**: Never commit credentials to version control
2. **Environment Variables**: Use environment variables for production
3. **Bucket Permissions**: Set appropriate bucket permissions (private vs public)
4. **File Validation**: Implement file type and size validation as needed
5. **Rate Limiting**: Consider implementing rate limiting for upload endpoints

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify your Application Key ID and Application Key are correct
   - Check that the key has appropriate permissions for your bucket

2. **Bucket Not Found**
   - Ensure the bucket name is correct and exists
   - Verify the Application Key has access to the specified bucket

3. **File Not Found**
   - Check that the file name is correct
   - Verify the file exists in the bucket

4. **Upload Failures**
   - Check file size limits
   - Verify network connectivity
   - Check application logs for detailed error messages

### Debugging

Enable debug logging by adding to `application.properties`:

```properties
logging.level.com.lap.service.B2StorageService=DEBUG
logging.level.com.lap.controller.FileStorageController=DEBUG
```

## Performance Considerations

1. **Large Files**: For files over 100MB, consider implementing large file upload using B2's multipart upload
2. **Concurrent Uploads**: The B2 client is thread-safe and supports concurrent operations
3. **Caching**: Consider caching file metadata and download URLs when appropriate
4. **CDN**: For frequently accessed files, consider using a CDN in front of B2

## B2 Pricing

- Storage: $0.005/GB/month
- Downloads: $0.01/GB
- Uploads: Free
- API calls: $0.004/1000 transactions

For current pricing, visit: [https://www.backblaze.com/b2/cloud-storage-pricing.html](https://www.backblaze.com/b2/cloud-storage-pricing.html)

## Additional Resources

- [B2 Documentation](https://www.backblaze.com/b2/docs/)
- [B2 Java SDK GitHub](https://github.com/Backblaze/b2-sdk-java)
- [B2 Integration Checklist](https://www.backblaze.com/b2/docs/integration_checklist.html)