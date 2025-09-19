package com.smartview.smartview.controller;

import com.smartview.smartview.model.Application;
import com.smartview.smartview.repository.ApplicationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    private final ApplicationRepository repository;

    public ApplicationController(ApplicationRepository repository) {
        this.repository = repository;
    }


    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = false) String email) {
        if (email != null && !email.isEmpty()) {
            List<Application> userApps = repository.findByUserEmail(email);
            return ResponseEntity.ok(userApps);
        }
        return ResponseEntity.ok(repository.findAll());
    }

    // ===== Create new application =====
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Application app) {
        return ResponseEntity.ok(repository.save(app));
    }

    // ===== Update application =====
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestBody Application updatedApp) {
        Optional<Application> appOpt = repository.findById(id);
        if (appOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Application not found");
        }

        Application app = appOpt.get();
        app.setCompany(updatedApp.getCompany());
        app.setPosition(updatedApp.getPosition());
        app.setStatus(updatedApp.getStatus());
        app.setDate(updatedApp.getDate());
        app.setUserEmail(updatedApp.getUserEmail());

        return ResponseEntity.ok(repository.save(app));
    }

    // ===== Delete application =====
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.status(404).body("Application not found");
        }

        repository.deleteById(id);
        return ResponseEntity.ok("Application deleted successfully");
    }
}
