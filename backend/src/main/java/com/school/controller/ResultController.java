package com.school.controller;

import com.school.entity.Result;
import com.school.service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/results")
public class ResultController {

    @Autowired
    private ResultService resultService;

    @GetMapping
    public List<Result> getAllResults() { return resultService.getAllResults(); }

    @GetMapping("/student/{studentId}")
    public List<Result> getByStudentId(@PathVariable Long studentId) {
        return resultService.getResultsByStudentId(studentId);
    }

    @GetMapping("/roll/{rollNumber}")
    public List<Result> getByRollNumber(@PathVariable String rollNumber) {
        return resultService.getResultsByRollNumber(rollNumber);
    }

    @GetMapping("/exam/{examType}")
    public List<Result> getByExamType(@PathVariable String examType) {
        return resultService.getResultsByExamType(examType);
    }

    @PostMapping("/student/{studentId}")
    public ResponseEntity<Result> addResult(
            @PathVariable Long studentId, @RequestBody Result result) {
        return ResponseEntity.ok(resultService.saveResult(studentId, result));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteResult(@PathVariable Long id) {
        resultService.deleteResult(id);
        return ResponseEntity.ok("Result deleted.");
    }
}