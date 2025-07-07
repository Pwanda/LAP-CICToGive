package com.lap.service;

import com.backblaze.b2.client.B2StorageClient;
import com.backblaze.b2.client.contentSources.B2ByteArrayContentSource;
import com.backblaze.b2.client.contentSources.B2ContentSource;
import com.backblaze.b2.client.contentSources.B2ContentTypes;
import com.backblaze.b2.client.exceptions.B2Exception;
import com.backblaze.b2.client.structures.*;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class B2StorageService {

    private static final Logger logger = LoggerFactory.getLogger(
        B2StorageService.class
    );

    private final B2StorageClient b2StorageClient;
    private final String bucketName;
    private B2Bucket bucket;

    @Autowired
    public B2StorageService(
        B2StorageClient b2StorageClient,
        @Qualifier("bucketName") String bucketName
    ) {
        this.b2StorageClient = b2StorageClient;
        this.bucketName = bucketName;
    }

    private void initializeBucket() throws B2Exception {
        if (bucket == null) {
            logger.info("Initializing bucket: {}", bucketName);
            try {
                // List buckets and find the one we need
                B2ListBucketsRequest listRequest = B2ListBucketsRequest.builder(
                    b2StorageClient.getAccountId()
                ).build();
                B2ListBucketsResponse listResponse =
                    b2StorageClient.listBuckets(listRequest);

                bucket = listResponse
                    .getBuckets()
                    .stream()
                    .filter(b -> b.getBucketName().equals(bucketName))
                    .findFirst()
                    .orElseThrow(() ->
                        new RuntimeException("Bucket not found: " + bucketName)
                    );

                logger.info("Bucket initialized: {}", bucket.getBucketName());
            } catch (B2Exception e) {
                logger.error("Error initializing bucket: {}", e.getMessage());
                throw e;
            }
        }
    }

    /**
     * Upload a file from MultipartFile
     */
    public B2FileVersion uploadFile(MultipartFile file, String fileName) {
        try {
            initializeBucket();
            logger.info(
                "Uploading file: {} to bucket: {}",
                fileName,
                bucketName
            );

            byte[] fileBytes = file.getBytes();
            String contentType = file.getContentType() != null
                ? file.getContentType()
                : B2ContentTypes.APPLICATION_OCTET;

            B2ContentSource contentSource = B2ByteArrayContentSource.builder(
                fileBytes
            ).build();

            B2UploadFileRequest uploadRequest = B2UploadFileRequest.builder(
                bucket.getBucketId(),
                fileName,
                contentType,
                contentSource
            ).build();

            B2FileVersion fileVersion = b2StorageClient.uploadSmallFile(
                uploadRequest
            );
            logger.info(
                "File uploaded successfully: {}",
                fileVersion.getFileName()
            );
            return fileVersion;
        } catch (IOException | B2Exception e) {
            logger.error("Error uploading file: {}", e.getMessage());
            throw new RuntimeException("File upload failed", e);
        }
    }

    /**
     * Upload file with custom metadata
     */
    public B2FileVersion uploadFileWithMetadata(
        MultipartFile file,
        String fileName,
        Map<String, String> metadata
    ) {
        try {
            initializeBucket();
            logger.info(
                "Uploading file with metadata: {} to bucket: {}",
                fileName,
                bucketName
            );

            byte[] fileBytes = file.getBytes();
            String contentType = file.getContentType() != null
                ? file.getContentType()
                : B2ContentTypes.APPLICATION_OCTET;

            B2ContentSource contentSource = B2ByteArrayContentSource.builder(
                fileBytes
            ).build();

            B2UploadFileRequest.Builder requestBuilder =
                B2UploadFileRequest.builder(
                    bucket.getBucketId(),
                    fileName,
                    contentType,
                    contentSource
                );

            // Add custom metadata
            if (metadata != null && !metadata.isEmpty()) {
                requestBuilder.setCustomFields(metadata);
            }

            B2UploadFileRequest uploadRequest = requestBuilder.build();
            B2FileVersion fileVersion = b2StorageClient.uploadSmallFile(
                uploadRequest
            );
            logger.info(
                "File uploaded successfully: {}",
                fileVersion.getFileName()
            );
            return fileVersion;
        } catch (IOException | B2Exception e) {
            logger.error(
                "Error uploading file with metadata: {}",
                e.getMessage()
            );
            throw new RuntimeException("File upload failed", e);
        }
    }

    /**
     * Download file by name
     */
    public byte[] downloadFileByName(String fileName) {
        try {
            initializeBucket();
            logger.info(
                "Downloading file: {} from bucket: {}",
                fileName,
                bucketName
            );

            B2DownloadByNameRequest downloadRequest =
                B2DownloadByNameRequest.builder(bucketName, fileName).build();

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            b2StorageClient.downloadByName(
                downloadRequest,
                (responseHeaders, inputStream) -> {
                    try {
                        byte[] buffer = new byte[8192];
                        int bytesRead;
                        while ((bytesRead = inputStream.read(buffer)) != -1) {
                            outputStream.write(buffer, 0, bytesRead);
                        }
                    } catch (IOException e) {
                        throw new RuntimeException(
                            "Failed to read download stream",
                            e
                        );
                    }
                }
            );

            byte[] fileBytes = outputStream.toByteArray();
            logger.info("File downloaded successfully: {}", fileName);
            return fileBytes;
        } catch (B2Exception e) {
            logger.error("Error downloading file: {}", e.getMessage());
            throw new RuntimeException("File download failed", e);
        }
    }

    /**
     * Download file by ID
     */
    public byte[] downloadFileById(String fileId) {
        try {
            initializeBucket();
            logger.info("Downloading file by ID: {}", fileId);

            B2DownloadByIdRequest downloadRequest =
                B2DownloadByIdRequest.builder(fileId).build();

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            b2StorageClient.downloadById(
                downloadRequest,
                (responseHeaders, inputStream) -> {
                    try {
                        byte[] buffer = new byte[8192];
                        int bytesRead;
                        while ((bytesRead = inputStream.read(buffer)) != -1) {
                            outputStream.write(buffer, 0, bytesRead);
                        }
                    } catch (IOException e) {
                        throw new RuntimeException(
                            "Failed to read download stream",
                            e
                        );
                    }
                }
            );

            byte[] fileBytes = outputStream.toByteArray();
            logger.info("File downloaded successfully by ID: {}", fileId);
            return fileBytes;
        } catch (B2Exception e) {
            logger.error("Error downloading file by ID: {}", e.getMessage());
            throw new RuntimeException("File download failed", e);
        }
    }

    /**
     * Delete file by name
     */
    public void deleteFileByName(String fileName) {
        try {
            initializeBucket();
            logger.info(
                "Deleting file: {} from bucket: {}",
                fileName,
                bucketName
            );

            Optional<B2FileVersion> fileVersionOpt = getFileVersionByName(
                fileName
            );
            if (fileVersionOpt.isPresent()) {
                B2FileVersion fileVersion = fileVersionOpt.get();
                B2DeleteFileVersionRequest deleteRequest =
                    B2DeleteFileVersionRequest.builder(
                        fileVersion.getFileId(),
                        fileVersion.getFileName()
                    ).build();

                b2StorageClient.deleteFileVersion(deleteRequest);
                logger.info("File deleted successfully: {}", fileName);
            } else {
                logger.warn("File not found for deletion: {}", fileName);
            }
        } catch (B2Exception e) {
            logger.error("Error deleting file: {}", e.getMessage());
            throw new RuntimeException("File deletion failed", e);
        }
    }

    /**
     * Delete file by ID
     */
    public void deleteFileById(String fileId) {
        try {
            initializeBucket();
            logger.info("Deleting file by ID: {}", fileId);

            B2DeleteFileVersionRequest deleteRequest =
                B2DeleteFileVersionRequest.builder(fileId, "unknown").build();

            b2StorageClient.deleteFileVersion(deleteRequest);
            logger.info("File deleted successfully by ID: {}", fileId);
        } catch (B2Exception e) {
            logger.error("Error deleting file by ID: {}", e.getMessage());
            throw new RuntimeException("File deletion failed", e);
        }
    }

    /**
     * Get file version by name
     */
    public Optional<B2FileVersion> getFileVersionByName(String fileName) {
        try {
            initializeBucket();
            B2ListFileNamesRequest listRequest = B2ListFileNamesRequest.builder(
                bucket.getBucketId()
            )
                .setStartFileName(fileName)
                .setMaxFileCount(100)
                .build();

            for (B2FileVersion fileVersion : b2StorageClient.fileNames(
                listRequest
            )) {
                if (fileVersion.getFileName().equals(fileName)) {
                    return Optional.of(fileVersion);
                }
            }
            return Optional.empty();
        } catch (B2Exception e) {
            logger.error("Error getting file version: {}", e.getMessage());
            return Optional.empty();
        }
    }

    /**
     * List files in bucket
     */
    public List<B2FileVersion> listFiles(int maxFileCount) {
        try {
            initializeBucket();
            B2ListFileNamesRequest listRequest = B2ListFileNamesRequest.builder(
                bucket.getBucketId()
            )
                .setMaxFileCount(maxFileCount)
                .build();

            List<B2FileVersion> files = new ArrayList<>();
            for (B2FileVersion fileVersion : b2StorageClient.fileNames(
                listRequest
            )) {
                files.add(fileVersion);
                if (files.size() >= maxFileCount) {
                    break;
                }
            }
            return files;
        } catch (B2Exception e) {
            logger.error("Error listing files: {}", e.getMessage());
            throw new RuntimeException("File listing failed", e);
        }
    }

    /**
     * Get download URL for a file
     */
    public String getDownloadUrl(String fileName) {
        try {
            initializeBucket();
            // For private buckets, we need to use the backend as a proxy
            // Return a URL that points to our backend API
            String proxyUrl = "/api/files/download/" + fileName;
            logger.info("Generated proxy URL for private bucket: {}", proxyUrl);
            return proxyUrl;
        } catch (B2Exception e) {
            logger.error("Error getting download URL: {}", e.getMessage());
            throw new RuntimeException("Failed to get download URL", e);
        }
    }

    /**
     * Get authorized download URL for a file
     */
    public String getAuthorizedDownloadUrl(
        String fileName,
        int durationInSeconds
    ) {
        try {
            initializeBucket();

            // For private buckets, return the proxy URL through our backend
            // The backend will handle the B2 authentication
            String proxyUrl = "/api/files/download/" + fileName;

            logger.info(
                "Using backend proxy URL for private bucket file: {} (duration: {}s)",
                fileName,
                durationInSeconds
            );

            return proxyUrl;
        } catch (Exception e) {
            logger.error("Error getting download URL: {}", e.getMessage());
            throw new RuntimeException("Failed to get download URL", e);
        }
    }

    /**
     * Check if file exists
     */
    public boolean fileExists(String fileName) {
        return getFileVersionByName(fileName).isPresent();
    }

    /**
     * Get bucket info
     */
    public String getBucketInfo() {
        try {
            initializeBucket();
            return String.format(
                "Bucket: %s (ID: %s)",
                bucket.getBucketName(),
                bucket.getBucketId()
            );
        } catch (B2Exception e) {
            logger.error("Error getting bucket info: {}", e.getMessage());
            return "Error getting bucket info";
        }
    }

    /**
     * Get account ID
     */
    public String getAccountId() {
        try {
            return b2StorageClient.getAccountId();
        } catch (Exception e) {
            logger.error("Error getting account ID: {}", e.getMessage());
            return "Error getting account ID";
        }
    }

    /**
     * Upload image with validation
     */
    public B2FileVersion uploadImage(MultipartFile file, String fileName) {
        if (!isImageFile(file)) {
            throw new IllegalArgumentException("File is not a valid image");
        }
        return uploadFile(file, fileName);
    }

    /**
     * Upload image with dimensions metadata
     */
    public B2FileVersion uploadImageWithDimensions(
        MultipartFile file,
        String fileName,
        Integer width,
        Integer height
    ) {
        if (!isImageFile(file)) {
            throw new IllegalArgumentException("File is not a valid image");
        }

        Map<String, String> metadata = new HashMap<>();
        if (width != null) metadata.put("width", width.toString());
        if (height != null) metadata.put("height", height.toString());

        return uploadFileWithMetadata(file, fileName, metadata);
    }

    /**
     * Update existing image
     */
    public B2FileVersion updateImage(
        String oldFileName,
        MultipartFile file,
        String newFileName
    ) {
        // Delete old image if it exists
        if (fileExists(oldFileName)) {
            deleteFileByName(oldFileName);
        }

        // Upload new image
        return uploadImage(file, newFileName);
    }

    /**
     * Check if file is an image
     */
    private boolean isImageFile(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && contentType.startsWith("image/");
    }

    /**
     * Get image metadata
     */
    public Map<String, String> getImageMetadata(String fileName) {
        Optional<B2FileVersion> fileVersionOpt = getFileVersionByName(fileName);
        if (fileVersionOpt.isPresent()) {
            return fileVersionOpt.get().getFileInfo();
        }
        return new HashMap<>();
    }

    // Wrapper methods for FileStorageService compatibility

    /**
     * List files (wrapper for FileStorageService)
     */
    public List<String> listFiles() {
        try {
            List<B2FileVersion> fileVersions = listFiles(1000);
            return fileVersions
                .stream()
                .map(B2FileVersion::getFileName)
                .toList();
        } catch (Exception e) {
            throw new RuntimeException("Failed to list files", e);
        }
    }

    /**
     * Get file metadata (wrapper for FileStorageService)
     */
    public Map<String, String> getFileMetadata(String fileName) {
        return getImageMetadata(fileName);
    }

    /**
     * Upload image (wrapper for FileStorageService)
     */
    public String uploadImageWrapper(MultipartFile file, String fileName) {
        try {
            uploadImage(file, fileName);
            return getDownloadUrl(fileName);
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload image", e);
        }
    }

    /**
     * Upload file (wrapper for FileStorageService)
     */
    public String uploadFileWrapper(MultipartFile file, String fileName) {
        try {
            uploadFile(file, fileName);
            return getDownloadUrl(fileName);
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload file", e);
        }
    }
}
