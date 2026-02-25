package com.school.dto;

import java.time.LocalDate;

public class ResultDTO {
    private Long studentId;
    private String examType;
    private int totalMarksObtained;
    private int totalMarks;
    private double percentage;
    private String grade;
    private LocalDate resultDate;

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public String getExamType() { return examType; }
    public void setExamType(String examType) { this.examType = examType; }
    public int getTotalMarksObtained() { return totalMarksObtained; }
    public void setTotalMarksObtained(int v) { this.totalMarksObtained = v; }
    public int getTotalMarks() { return totalMarks; }
    public void setTotalMarks(int totalMarks) { this.totalMarks = totalMarks; }
    public double getPercentage() { return percentage; }
    public void setPercentage(double percentage) { this.percentage = percentage; }
    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
    public LocalDate getResultDate() { return resultDate; }
    public void setResultDate(LocalDate resultDate) { this.resultDate = resultDate; }
}