package com.example.demo.config;


import com.example.demo.entity.equipement.Equipment;
import com.example.demo.entity.anomaly.Anomaly;
import com.example.demo.entity.anomaly.AnomalyType;
import com.example.demo.entity.anomaly.Severity;
import com.example.demo.service.ticket.TicketService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

/**
 * Simulates real-world anomaly detection: every fixed interval, there's a
 * chance a new anomaly is generated on a random piece of equipment already
 * in the database. This spreads anomaly (and ticket) creation out over time
 * instead of dumping everything at startup.
 *
 * Tune the pace via application.properties:
 *   solartech.anomaly-generation.interval-ms=60000   (how often the check runs)
 *   solartech.anomaly-generation.probability=0.4     (chance of generating one, 0.0–1.0)
 */
@Component
public class AnomalyGeneratorScheduler {


    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private TicketService ticketService;

    @Value("${solartech.anomaly-generation.probability:0.4}")
    private double generationProbability;

    private final Random random = new Random();

    // Only these two regions guarantee both an Administrator AND a Technician
// match (see UserDataInitializer: admin2=Casablanca, admin3=Rabat, and
// several technicians share those same regions).
    private static final String[] VALID_REGIONS = {"Casablanca", "Rabat"};

    @Scheduled(fixedRateString = "${solartech.anomaly-generation.interval-ms:60000}")
    @Transactional
    public void maybeGenerateAnomaly() {
        System.out.println(">>> Scheduler tick at " + LocalDateTime.now());
        if (random.nextDouble() > generationProbability) {
            return;
        }

        @SuppressWarnings("unchecked")
        List<Equipment> equipmentList = entityManager
                .createQuery("SELECT e FROM Equipment e")
                .getResultList();

        if (equipmentList.isEmpty()) {
            System.out.println(">>> No equipment found, skipping anomaly generation.");
            return;
        }

        Equipment equipment = equipmentList.get(random.nextInt(equipmentList.size()));
        AnomalyType[] types = AnomalyType.values();
        Severity[] severities = Severity.values();

        Anomaly anomaly = new Anomaly();
        anomaly.setAnomalyType(types[random.nextInt(types.length)]);
        anomaly.setSeverity(severities[random.nextInt(severities.length)]);
        anomaly.setGeometry(randomPointNear(34.0, -7.0));
        anomaly.setEquipment(equipment);
        anomaly.setRegion(VALID_REGIONS[random.nextInt(VALID_REGIONS.length)]);
        anomaly.setProcessed(false);
        anomaly.setStartAt(LocalDateTime.now());
        anomaly.setEndAt(null);

        entityManager.persist(anomaly);
        entityManager.flush();

        System.out.println(">>> New anomaly generated: " + anomaly.getAnomalyType()
                + " (" + anomaly.getSeverity() + ") on " + equipment.getSerialNumber()
                + " region=" + anomaly.getRegion());

        try {
            ticketService.createTicket(anomaly);
            System.out.println(">>> Ticket auto-created for this anomaly.");
        } catch (Exception e) {
            System.out.println(">>> Could not auto-create ticket: " + e.getMessage());
        }
    }

    private String randomPointNear(double baseLat, double baseLng) {
        double lat = baseLat + (random.nextDouble() - 0.5);
        double lng = baseLng + (random.nextDouble() - 0.5);
        return String.format("POINT(%.4f %.4f)", lat, lng);
    }
}