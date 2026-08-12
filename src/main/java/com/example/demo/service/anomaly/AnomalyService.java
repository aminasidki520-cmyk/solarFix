package com.example.demo.service.anomaly;

import com.example.demo.controllers.AnomalyController;
import com.example.demo.entity.anomaly.Anomaly;
import com.example.demo.entity.anomaly.AnomalyType;
import com.example.demo.entity.anomaly.Severity;
import com.example.demo.entity.equipement.Equipment;
import com.example.demo.entity.ticket.Ticket;
import com.example.demo.repository.anomaly.AnomalyRepository;
import jakarta.persistence.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.time.LocalDateTime;

@Service
public class AnomalyService {

    @Autowired
    private AnomalyRepository anomalyRepository;




    public List<Anomaly> getAllAnomalies() {
        return anomalyRepository.findAll();
    }

    public List<Anomaly> getAnomalyWithSeverity(Severity  severity) {

    return  anomalyRepository.findBySeverity(severity);};

    public List<Anomaly> getAnomalyBetween( @RequestParam LocalDateTime start,@RequestParam LocalDateTime end) {

        return  anomalyRepository.findByStartAtGreaterThanEqualAndEndAtLessThanEqual(start, end);};

}