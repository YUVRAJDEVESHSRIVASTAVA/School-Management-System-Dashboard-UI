package com.school.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.school.entity.Marks;
import java.util.List;

@Repository
public interface MarksRepository extends JpaRepository<Marks, Long> {
    @Query("SELECT m FROM Marks m JOIN FETCH m.student ORDER BY m.student.name, m.subject")
    List<Marks> findAllWithStudent();

    @Query("SELECT m FROM Marks m JOIN FETCH m.student WHERE m.student.rollNumber = :rollNumber ORDER BY m.subject")
    List<Marks> findByStudentRollNumber(String rollNumber);

    @Query("SELECT m FROM Marks m JOIN FETCH m.student WHERE m.examType = :examType ORDER BY m.student.name")
    List<Marks> findByExamType(String examType);

    List<Marks> findByStudentId(Long studentId);
    List<Marks> findByStudentIdAndExamType(Long studentId, String examType);
}