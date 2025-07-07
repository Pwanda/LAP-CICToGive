package com.lap.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    private static final Logger logger = LoggerFactory.getLogger(
        FileStorageService.class
    );

    private final B2StorageService b2StorageService;
    private final LocalFileStorageService localFileStorageService;
    private boolean b2Available = true;

    @Autowired
    public FileStorageService(
        B2StorageService b2StorageService,
        LocalFileStorageService localFileStorageService
    ) {
        this.b2StorageService = b2StorageService;
        this.localFileStorageService = localFileStorageService;
        checkB2Availability();
    }

    /**
     * Upload file - tries B2 first, falls back to local storage
     */
    public String uploadFile(MultipartFile file, String fileName) {
        try {
            if (b2Available) {
                return b2StorageService.uploadFileWrapper(file, fileName);
            }
        } catch (Exception e) {
            logger.warn(
                "B2 upload failed, falling back to local storage: {}",
                e.getMessage()
            );
            b2Available = false;
        }

        return localFileStorageService.uploadFile(file, fileName);
    }

    /**
     * Upload image with validation
     */
    public String uploadImage(MultipartFile file, String fileName) {
        try {
            if (b2Available) {
                return b2StorageService.uploadImageWrapper(file, fileName);
            }
        } catch (Exception e) {
            logger.warn(
                "B2 image upload failed, falling back to local storage: {}",
                e.getMessage()
            );
            b2Available = false;
        }

        return localFileStorageService.uploadImage(file, fileName);
    }

    /**
     * Get download URL for file
     */
    public String getDownloadUrl(String fileName) {
        // For private buckets, always return the backend proxy URL
        return "/api/files/download/" + fileName;
    }

    /**
     * Get download URL with custom expiry
     */
    public String getDownloadUrl(String fileName, int expirySeconds) {
        // For private buckets, always return the backend proxy URL
        // The backend will handle authentication with B2
        return "/api/files/download/" + fileName;
    }

    /**
     * Delete file
     */
    public void deleteFile(String fileName) {
        try {
            if (b2Available) {
                b2StorageService.deleteFileByName(fileName);
                return;
            }
        } catch (Exception e) {
            logger.warn(
                "B2 delete failed, trying local storage: {}",
                e.getMessage()
            );
            b2Available = false;
        }

        localFileStorageService.deleteFileByName(fileName);
    }

    /**
     * Check if file exists
     */
    public boolean fileExists(String fileName) {
        try {
            if (b2Available) {
                return b2StorageService.fileExists(fileName);
            }
        } catch (Exception e) {
            logger.warn(
                "B2 file check failed, checking local storage: {}",
                e.getMessage()
            );
            b2Available = false;
        }

        return localFileStorageService.fileExists(fileName);
    }

    /**
     * Download file content
     */
    public byte[] downloadFile(String fileName) {
        try {
            if (b2Available) {
                return b2StorageService.downloadFileByName(fileName);
            }
        } catch (Exception e) {
            logger.warn(
                "B2 download failed, trying local storage: {}",
                e.getMessage()
            );
            b2Available = false;
        }

        return localFileStorageService.downloadFileByName(fileName);
    }

    /**
     * List files
     */
    public List<String> listFiles() {
        try {
            if (b2Available) {
                return b2StorageService.listFiles();
            }
        } catch (Exception e) {
            logger.warn(
                "B2 list failed, using local storage: {}",
                e.getMessage()
            );
            b2Available = false;
        }

        return localFileStorageService.listFiles();
    }

    /**
     * Get file metadata
     */
    public Map<String, String> getFileMetadata(String fileName) {
        try {
            if (b2Available) {
                return b2StorageService.getFileMetadata(fileName);
            }
        } catch (Exception e) {
            logger.warn(
                "B2 metadata failed, using local storage: {}",
                e.getMessage()
            );
            b2Available = false;
        }

        return localFileStorageService.getImageMetadata(fileName);
    }

    /**
     * Get storage info
     */
    public String getStorageInfo() {
        if (b2Available) {
            try {
                return (
                    "Using B2 Cloud Storage: " +
                    b2StorageService.getBucketInfo()
                );
            } catch (Exception e) {
                logger.warn("B2 info failed: {}", e.getMessage());
                b2Available = false;
            }
        }

        return (
            "Using Local Storage: " + localFileStorageService.getStorageInfo()
        );
    }

    /**
     * Force retry B2 connection
     */
    public void retryB2Connection() {
        logger.info("Retrying B2 connection...");
        checkB2Availability();
    }

    /**
     * Get current storage type
     */
    public String getCurrentStorageType() {
        return b2Available ? "B2 Cloud Storage" : "Local File Storage";
    }

    /**
     * Check if B2 is available
     */
    public boolean isB2Available() {
        return b2Available;
    }

    /**
     * Health check
     */
    public Map<String, Object> getHealthStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("currentStorage", getCurrentStorageType());
        status.put("b2Available", b2Available);

        try {
            status.put("storageInfo", getStorageInfo());
            status.put("healthy", true);
        } catch (Exception e) {
            status.put("healthy", false);
            status.put("error", e.getMessage());
        }

        return status;
    }

    /**
     * Private method to check B2 availability
     */
    private void checkB2Availability() {
        try {
            // Try to get bucket info to test B2 connection
            String bucketInfo = b2StorageService.getBucketInfo();
            if (bucketInfo != null && !bucketInfo.isEmpty()) {
                b2Available = true;
                logger.info("B2 Storage is available");
            } else {
                b2Available = false;
                logger.warn("B2 Storage check returned empty result");
            }
        } catch (Exception e) {
            b2Available = false;
            logger.warn("B2 Storage is not available: {}", e.getMessage());
            logger.info("Falling back to local file storage");
        }
    }
}
