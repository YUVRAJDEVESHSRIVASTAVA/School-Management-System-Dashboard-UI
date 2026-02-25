package com.school.service;

import com.school.entity.Marks;
import com.school.entity.Student;
import com.school.exception.ResourceNotFoundException;
import com.school.repository.MarksRepository;
import com.school.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class MarksService {

    @Autowired private MarksRepository marksRepository;
    @Autowired private StudentRepository studentRepository;

    public List<Marks> getAllMarks() { return marksRepository.findAllWithStudent(); }

    public List<Marks> getMarksByStudentId(Long studentId) {
        return marksRepository.findByStudentId(studentId);
    }

    public List<Marks> getMarksByRollNumber(String rollNumber) {
        return marksRepository.findByStudentRollNumber(rollNumber);
    }

    public List<Marks> getMarksByExamType(String examType) {
        return marksRepository.findByExamType(examType);
    }

    @Transactional
    public Marks saveMarks(Long studentId, Marks marks) {
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + studentId));
        marks.setStudent(student);
        return marksRepository.save(marks);
    }

    @Transactional
    public void deleteMarks(Long id) { marksRepository.deleteById(id); }
}