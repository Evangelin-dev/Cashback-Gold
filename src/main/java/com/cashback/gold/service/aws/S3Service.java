package com.cashback.gold.service.aws;

import com.cashback.gold.exception.InvalidArgumentException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3Service {

    private final S3Client s3Client;

    @Value("${cloud.aws.region.static}")
    private String region;

    @Value("${aws.s3.bucket}")
    private String bucket;

    public String uploadFile(MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                throw new InvalidArgumentException("File is empty or null.");
            }

            String originalFileName = file.getOriginalFilename();
            log.info("Uploading file: {}", originalFileName);

            String encodedName = URLEncoder.encode(originalFileName, StandardCharsets.UTF_8);
            String key = Instant.now().getEpochSecond() + "_" + encodedName;

            PutObjectRequest putReq = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putReq, RequestBody.fromBytes(file.getBytes()));

            return "https://" + bucket + ".s3." + region + ".amazonaws.com/" + key;

        } catch (IOException e) {
            log.error("Failed to upload to S3", e);
            throw new RuntimeException("Failed to upload to S3", e);
        }
    }

    public void deleteFile(String fileUrl) {
        try {
            // Extract the key from the full URL
            String prefix = "https://" + bucket + ".s3." + region + ".amazonaws.com/";
            String key = fileUrl.replace(prefix, "");

            DeleteObjectRequest deleteReq = DeleteObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .build();

            s3Client.deleteObject(deleteReq);
            log.info("Deleted file from S3: {}", key);
        } catch (Exception e) {
            log.error("Failed to delete from S3", e);
            throw new RuntimeException("Failed to delete from S3", e);
        }
    }
}
