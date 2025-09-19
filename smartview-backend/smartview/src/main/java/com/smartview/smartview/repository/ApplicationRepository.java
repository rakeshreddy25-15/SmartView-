package com.smartview.smartview.repository;

import com.smartview.smartview.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    // ✅ Custom method
    List<Application> findByUserEmail(String userEmail);
}
