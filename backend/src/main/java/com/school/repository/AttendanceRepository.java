package com.school.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.school.entity.Attendance;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    @Query("SELECT a FROM Attendance a JOIN FETCH a.student ORDER BY a.date DESC")
    List<Attendance> findAllWithStudent();

    @Query("SELECT a FROM Attendance a JOIN FETCH a.student WHERE a.student.rollNumber = :rollNumber ORDER BY a.date DESC")
    List<Attendance> findByStudentRollNumber(String rollNumber);

    List<Attendance> findByStudentId(Long studentId);
    List<Attendance> findByStudentStudentClass(String studentClass);
}