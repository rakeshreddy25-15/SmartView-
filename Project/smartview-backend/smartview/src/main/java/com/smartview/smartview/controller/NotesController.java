package com.smartview.smartview.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "*")
public class NotesController {

    @Value("${file.upload-dir}")
    private String uploadDir;

    // ===== Save Note =====
    @PostMapping("/save")
    public ResponseEntity<Map<String, Object>> saveNote(@RequestBody Map<String, String> body) {
        String content = body.get("content");
        String userEmail = body.getOrDefault("userEmail", "guest");

        Map<String, Object> note = new HashMap<>();
        note.put("id", System.currentTimeMillis());
        note.put("content", content);
        note.put("userEmail", userEmail);

        return ResponseEntity.ok(note);
    }

    // ===== Upload File =====
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            Path path = Paths.get(uploadDir);
            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = path.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return ResponseEntity.ok(fileName);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Upload failed");
        }
    }
}
