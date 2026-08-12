package com.example.demo.controllers;

import com.example.demo.entity.anomaly.Anomaly;
import com.example.demo.service.anomaly.AnomalyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/anomalies")
public class AnomalyController {

    @Autowired
    private AnomalyService anomalyService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Anomaly>> getAllAnomalies() {
        return ResponseEntity.ok(anomalyService.getAllAnomalies());
    }

    @GetMapping("/filter")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Anomaly>> getAnomaliesBetween(LocalDateTime start,LocalDateTime end){
        return ResponseEntity.ok(anomalyService.getAnomalyBetween(start,end));
    }
}