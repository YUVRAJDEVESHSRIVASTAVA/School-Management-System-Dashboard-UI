package com.school.controller;

import com.school.entity.Attendance;
import com.school.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @GetMapping
    public List<Attendance> getAllAttendance() { return attendanceService.getAllAttendance(); }

    @GetMapping("/student/{studentId}")
    public List<Attendance> getByStudentId(@PathVariable Long studentId) {
        return attendanceService.getAttendanceByStudentId(studentId);
    }

    @GetMapping("/roll/{rollNumber}")
    public List<Attendance> getByRollNumber(@PathVariable String rollNumber) {
        return attendanceService.getAttendanceByRollNumber(rollNumber);
    }

    @PostMapping("/student/{studentId}")
    public ResponseEntity<Attendance> addAttendance(
            @PathVariable Long studentId, @RequestBody Attendance attendance) {
        return ResponseEntity.ok(attendanceService.saveAttendance(studentId, attendance));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAttendance(@PathVariable Long id) {
        attendanceService.deleteAttendance(id);
        return ResponseEntity.ok("Attendance record deleted.");
    }
}
