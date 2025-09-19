package com.smartview.smartview.repository;

import com.smartview.smartview.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUserEmail(String userEmail);
}
