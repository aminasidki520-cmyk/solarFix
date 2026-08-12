package com.example.demo.config;

import com.example.demo.entity.user.Administrator;
import com.example.demo.entity.user.Role;
import com.example.demo.entity.user.Technician;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Inserts administrators and technicians at startup.
 * Runs after DataInitializer (Order 2).
 * Skips insertion if users already exist.
 */
@Component
@Order(2)
public class UserDataInitializer implements ApplicationRunner {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {

        Long count = (Long) entityManager
                .createQuery("SELECT COUNT(u) FROM User u")
                .getSingleResult();

        if (count > 0) {
            System.out.println(">>> Users already exist, skipping user initialization.");
            return;
        }

        System.out.println(">>> Inserting users...");

        // ─────────────────────────────────────────────
        // 1. ADMINISTRATORS
        // ─────────────────────────────────────────────
        String[][] adminData = {
                // username, password, firstName, lastName, email, phone, region, employeeNumber, department, position
                {"admin1", "Admin123!", "Youssef",  "El Mansouri", "youssef.admin@solar.com",  "0600000001", "National",    "EMP001", "Direction",    "System Administrator"},
                {"admin2", "Admin123!", "Fatima",   "Benali",      "fatima.admin@solar.com",   "0600000002", "Casablanca",  "EMP002", "Operations",   "Operations Manager"},
                {"admin3", "Admin123!", "Karim",    "Tazi",        "karim.admin@solar.com",    "0600000003", "Rabat",       "EMP003", "Maintenance",  "Maintenance Director"},
        };

        for (String[] d : adminData) {
            Administrator admin = new Administrator();
            admin.setUsername(d[0]);
            admin.setPassword(passwordEncoder.encode(d[1]));
            admin.setFirstName(d[2]);
            admin.setLastName(d[3]);
            admin.setEmail(d[4]);
            admin.setPhoneNumber(d[5]);
            admin.setRegionOfResponsibility(d[6]);
            admin.setRole(Role.ADMIN);
            admin.setEmployeeNumber(d[7]);
            admin.setDepartment(d[8]);
            admin.setPosition(d[9]);
            entityManager.persist(admin);
        }

        // ─────────────────────────────────────────────
        // 2. TECHNICIANS
        // ─────────────────────────────────────────────
        String[][] techData = {
                // username, password, firstName, lastName, email, phone, region, availability
                {"tech1", "Tech123!", "Mohamed",  "Alami",      "mohamed.tech@solar.com",  "0611111001", "Casablanca", "true"},
                {"tech2", "Tech123!", "Sara",     "Idrissi",    "sara.tech@solar.com",     "0611111002", "Rabat",      "true"},
                {"tech3", "Tech123!", "Omar",     "Cherkaoui",  "omar.tech@solar.com",     "0611111003", "Marrakech",  "false"},
                {"tech4", "Tech123!", "Nadia",    "Karimi",     "nadia.tech@solar.com",    "0611111004", "Fes",        "true"},
                {"tech5", "Tech123!", "Amine",    "Bouazza",    "amine.tech@solar.com",    "0611111005", "Agadir",     "false"},
                {"tech6", "Tech123!", "Zineb",    "Hamdouni",   "zineb.tech@solar.com",    "0611111006", "Tanger",     "true"},
                {"tech7", "Tech123!", "Hassan",   "Outajar",    "hassan.tech@solar.com",   "0611111007", "Oujda",      "true"},
                {"tech8", "Tech123!", "Rim",      "Benkirane",  "rim.tech@solar.com",      "0611111008", "Meknes",     "false"},
        };

        // Skills per technician
        List<List<String>> skillSets = List.of(
                List.of("Electrical Maintenance", "Inverter Repair", "PV Systems"),
                List.of("Sensor Calibration", "Data Analysis", "Electrical Safety"),
                List.of("Mechanical Repair", "Panel Cleaning", "Structural Inspection"),
                List.of("Thermal Imaging", "Fault Detection", "PV Systems"),
                List.of("Inverter Repair", "Grid Connection", "High Voltage"),
                List.of("Sensor Calibration", "Monitoring Systems", "PV Systems"),
                List.of("Electrical Maintenance", "Panel Installation", "Safety Protocols"),
                List.of("Data Analysis", "Fault Detection", "Reporting")
        );

        for (int i = 0; i < techData.length; i++) {
            String[] d = techData[i];
            Technician tech = new Technician();
            tech.setUsername(d[0]);
            tech.setPassword(passwordEncoder.encode(d[1]));
            tech.setFirstName(d[2]);
            tech.setLastName(d[3]);
            tech.setEmail(d[4]);
            tech.setPhoneNumber(d[5]);
            tech.setRegionOfResponsibility(d[6]);
            tech.setRole(Role.TECHNICIAN);
            tech.setAvailability(Boolean.parseBoolean(d[7]));
            tech.setSkills(new java.util.ArrayList<>(skillSets.get(i)));
            entityManager.persist(tech);
        }

        System.out.println(">>> Users inserted: 3 administrators + 8 technicians.");
    }
}
