package com.school.service;

import com.school.entity.Student;
import com.school.repository.StudentRepository;
import com.school.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    public Map<String, Object> loginStudent(String email, String password) {
        Optional<Student> opt = studentRepository.findByEmailAndPassword(email.trim().toLowerCase(), password);
        Map<String, Object> result = new HashMap<>();
        if (opt.isPresent()) {
            Student s = opt.get();
            result.put("ok", true);
            result.put("role", "student");
            result.put("fullName", s.getName());
            result.put("username", s.getEmail());
            result.put("rollNumber", s.getRollNumber());
            result.put("studentClass", s.getStudentClass());
            result.put("section", s.getSection());
        } else {
            result.put("ok", false);
            result.put("message", "Invalid email or password.");
        }
        return result;
    }

    public Map<String, Object> loginTeacher(String username, String password) {
        // Teachers are stored in localStorage for now; accept any teacher with non-empty creds
        Map<String, Object> result = new HashMap<>();
        if (username != null && !username.isBlank() && password != null && !password.isBlank()) {
            result.put("ok", true);
            result.put("role", "teacher");
            result.put("fullName", username);
            result.put("username", username);
        } else {
            result.put("ok", false);
            result.put("message", "Invalid credentials.");
        }
        return result;
    }
}