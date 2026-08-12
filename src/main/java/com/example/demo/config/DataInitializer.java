package com.example.demo.config;

import com.example.demo.entity.equipement.*;
import com.example.demo.entity.equipement.Module;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

/**
 * Runs once at startup. Inserts equipment ONLY (inverters, modules, sensors)
 * if the database is empty. Anomalies and tickets are no longer created here —
 * see AnomalyGeneratorScheduler, which generates them gradually over time.
 */
@Component
@Order(1)
public class DataInitializer implements ApplicationRunner {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {

        Long count = (Long) entityManager
                .createQuery("SELECT COUNT(e) FROM Equipment e")
                .getSingleResult();
        if (count > 0) {
            System.out.println(">>> Equipment already exists, skipping initialization.");
            return;
        }

        System.out.println(">>> Inserting equipment...");

        // ─────────────────────────────────────────────
        // 1. INVERTERS
        // ─────────────────────────────────────────────
        String[][] inverterData = {
                {"SN-INV-001", "SolarEdge", "SE5000H"},
                {"SN-INV-002", "SolarEdge", "SE7600H"},
                {"SN-INV-003", "Fronius", "Symo 8.2-3-M"},
                {"SN-INV-004", "Huawei", "SUN2000-10KTL"},
                {"SN-INV-005", "SMA", "Sunny Tripower 6.0"}
        };
        InverterType[] invTypes = {InverterType.CENTRAL, InverterType.MICRO, InverterType.CENTRAL, InverterType.MICRO, InverterType.CENTRAL};
        InverterStatus[] invStatuses = {InverterStatus.OPERATIONAL, InverterStatus.FAULTY, InverterStatus.OPERATIONAL, InverterStatus.UNDER_MAINTENANCE, InverterStatus.OPERATIONAL};

        for (int i = 0; i < inverterData.length; i++) {
            Inverter inv = new Inverter();
            inv.setSerialNumber(inverterData[i][0]);
            inv.setManufacturer(inverterData[i][1]);
            inv.setModel(inverterData[i][2]);
            inv.setInstallationDate(LocalDate.of(2022, 1 + i, 10));
            inv.setLocation("Zone A - Row " + (i + 1));
            inv.setWarrantyExpiryDate(LocalDate.of(2032, 1 + i, 10));
            inv.setDescription("Grid-tied inverter unit " + (i + 1));
            inv.setRatedPower(5000.0 + i * 1000);
            inv.setInputVoltage(350.0 + i * 10);
            inv.setOutputVoltage(230.0);
            inv.setEfficiency(97.5 - i * 0.2);
            inv.setNumberOfMppt(2 + i % 3);
            inv.setInverterType(invTypes[i]);
            inv.setInverterStatus(invStatuses[i]);
            inv.setFirmwareVersion("v" + (2 + i) + ".0.1");
            entityManager.persist(inv);
        }

        // ─────────────────────────────────────────────
        // 2. MODULES
        // ─────────────────────────────────────────────
        String[][] moduleData = {
                {"SN-MOD-001", "JA Solar", "JAM60S20-385"},
                {"SN-MOD-002", "LONGi", "LR4-60HIH-370"},
                {"SN-MOD-003", "Canadian Solar", "CS3W-400P"},
                {"SN-MOD-004", "Trina Solar", "TSM-400DE15"},
                {"SN-MOD-005", "First Solar", "FS-6450A"}
        };
        ModuleTechnology[] modTechs = {ModuleTechnology.MONOCRISTALLINE, ModuleTechnology.MONOCRISTALLINE, ModuleTechnology.POLYCRYSTALLINE, ModuleTechnology.MONOCRISTALLINE, ModuleTechnology.THIN_FILM};
        ModuleStatus[] modStatuses = {ModuleStatus.OPERATIONAL, ModuleStatus.FAULTY, ModuleStatus.OPERATIONAL, ModuleStatus.UNDER_MAINTENANCE, ModuleStatus.OFFLINE};

        for (int i = 0; i < moduleData.length; i++) {
            Module mod = new Module();
            mod.setSerialNumber(moduleData[i][0]);
            mod.setManufacturer(moduleData[i][1]);
            mod.setModel(moduleData[i][2]);
            mod.setInstallationDate(LocalDate.of(2021, 3 + i, 15));
            mod.setLocation("Zone B - Panel " + (i + 1));
            mod.setWarrantyExpiryDate(LocalDate.of(2046, 3 + i, 15));
            mod.setDescription("Photovoltaic panel unit " + (i + 1));
            mod.setRatedPower(370.0 + i * 10);
            mod.setVoltage(40.0 + i * 0.5);
            mod.setCurrent(9.5 + i * 0.1);
            mod.setEfficiency(19.5 + i * 0.3);
            mod.setLength(1.75 + i * 0.01);
            mod.setWidth(1.00 + i * 0.005);
            mod.setWeight(20.0 + i * 0.5);
            mod.setModuleTechnology(modTechs[i]);
            mod.setModuleStatus(modStatuses[i]);
            entityManager.persist(mod);
        }

        // ─────────────────────────────────────────────
        // 3. SENSORS
        // ─────────────────────────────────────────────
        String[][] sensorData = {
                {"SN-SEN-001", "Vaisala", "HMP110", "TEMPERATURE", "°C", "38.5"},
                {"SN-SEN-002", "Fluke", "1760", "VOLTAGE", "V", "235.0"},
                {"SN-SEN-003", "Yokogawa", "CW120", "CURRENT", "A", "12.3"},
                {"SN-SEN-004", "Kipp & Zonen", "CMP11", "IRRADIANCE", "W/m²", "850.0"},
                {"SN-SEN-005", "Davis", "6410", "WIND_SPEED", "m/s", "4.2"}
        };
        SensorStatus[] senStatuses = {SensorStatus.ACTIVE, SensorStatus.FAULTY, SensorStatus.ACTIVE, SensorStatus.MAINTENANCE, SensorStatus.ACTIVE};

        for (int i = 0; i < sensorData.length; i++) {
            Sensor sensor = new Sensor();
            sensor.setSerialNumber(sensorData[i][0]);
            sensor.setManufacturer(sensorData[i][1]);
            sensor.setModel(sensorData[i][2]);
            sensor.setInstallationDate(LocalDate.of(2023, 1 + i, 5));
            sensor.setLocation("Zone C - Station " + (i + 1));
            sensor.setWarrantyExpiryDate(LocalDate.of(2028, 1 + i, 5));
            sensor.setDescription("Environmental sensor " + (i + 1));
            sensor.setName(sensorData[i][1] + " " + sensorData[i][2]);
            sensor.setSensorType(SensorType.valueOf(sensorData[i][3]));
            sensor.setSensorStatus(senStatuses[i]);
            sensor.setCurrentValue(Double.parseDouble(sensorData[i][5]));
            sensor.setUnit(sensorData[i][4]);
            entityManager.persist(sensor);
        }

        System.out.println(">>> Equipment inserted: 15 items (5 inverters + 5 modules + 5 sensors).");
    }
}