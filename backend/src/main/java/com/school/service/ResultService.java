package com.school.service;

import com.school.entity.Result;
import com.school.entity.Student;
import com.school.exception.ResourceNotFoundException;
import com.school.repository.ResultRepository;
import com.school.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class ResultService {

    @Autowired private ResultRepository resultRepository;
    @Autowired private StudentRepository studentRepository;

    public List<Result> getAllResults() { return resultRepository.findAllWithStudent(); }

    public List<Result> getResultsByStudentId(Long studentId) {
        return resultRepository.findByStudentId(studentId);
    }

    public List<Result> getResultsByRollNumber(String rollNumber) {
        return resultRepository.findByStudentRollNumber(rollNumber);
    }

    public List<Result> getResultsByExamType(String examType) {
        return resultRepository.findByExamType(examType);
    }

    public Result saveResult(Long studentId, Result result) {
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + studentId));
        result.setStudent(student);
        return resultRepository.save(result);
    }

    public void deleteResult(Long id) { resultRepository.deleteById(id); }
}