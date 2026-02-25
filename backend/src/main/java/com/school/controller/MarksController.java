package com.school.controller;

import com.school.entity.Marks;
import com.school.service.MarksService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/marks")
public class MarksController {

    @Autowired
    private MarksService marksService;

    @GetMapping
    public List<Marks> getAllMarks() { return marksService.getAllMarks(); }

    @GetMapping("/student/{studentId}")
    public List<Marks> getByStudentId(@PathVariable Long studentId) {
        return marksService.getMarksByStudentId(studentId);
    }

    @GetMapping("/roll/{rollNumber}")
    public List<Marks> getByRollNumber(@PathVariable String rollNumber) {
        return marksService.getMarksByRollNumber(rollNumber);
    }

    @GetMapping("/exam/{examType}")
    public List<Marks> getByExamType(@PathVariable String examType) {
        return marksService.getMarksByExamType(examType);
    }

    @PostMapping("/student/{studentId}")
    public ResponseEntity<Marks> addMarks(
            @PathVariable Long studentId, @RequestBody Marks marks) {
        return ResponseEntity.ok(marksService.saveMarks(studentId, marks));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMarks(@PathVariable Long id) {
        marksService.deleteMarks(id);
        return ResponseEntity.ok("Marks deleted.");
    }
}