package com.example.demo.entity.report;

// Request body for PUT /api/reports/{id}
public record UpdateReportRequest(
        String title,
        String content
) {}
