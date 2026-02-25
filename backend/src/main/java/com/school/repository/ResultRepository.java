package com.school.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.school.entity.Result;
import java.util.List;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {
    @Query("SELECT r FROM Result r JOIN FETCH r.student ORDER BY r.student.name, r.examType")
    List<Result> findAllWithStudent();

    @Query("SELECT r FROM Result r JOIN FETCH r.student WHERE r.student.rollNumber = :rollNumber")
    List<Result> findByStudentRollNumber(String rollNumber);

    @Query("SELECT r FROM Result r JOIN FETCH r.student WHERE r.examType = :examType ORDER BY r.student.name")
    List<Result> findByExamType(String examType);

    List<Result> findByStudentId(Long studentId);
}