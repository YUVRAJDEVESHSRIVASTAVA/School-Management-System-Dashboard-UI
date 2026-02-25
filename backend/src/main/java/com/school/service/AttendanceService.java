package com.school.service;

import com.school.entity.Attendance;
import com.school.entity.Student;
import com.school.exception.ResourceNotFoundException;
import com.school.repository.AttendanceRepository;
import com.school.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class AttendanceService {

    @Autowired private AttendanceRepository attendanceRepository;
    @Autowired private StudentRepository studentRepository;

    public List<Attendance> getAllAttendance() { return attendanceRepository.findAllWithStudent(); }

    public List<Attendance> getAttendanceByStudentId(Long studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }

    public List<Attendance> getAttendanceByRollNumber(String rollNumber) {
        return attendanceRepository.findByStudentRollNumber(rollNumber);
    }

    @Transactional
    public Attendance saveAttendance(Long studentId, Attendance attendance) {
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + studentId));
        attendance.setStudent(student);
        return attendanceRepository.save(attendance);
    }

    @Transactional
    public void deleteAttendance(Long id) { attendanceRepository.deleteById(id); }
}