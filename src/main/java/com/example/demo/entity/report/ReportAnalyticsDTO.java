package com.example.demo.entity.report;

public record ReportAnalyticsDTO(
        long totalDownloads,
        String downloadsTrend,
        long scheduledReports,
        String storageUsed
) {}