package com.example.demo.entity.anomaly;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("ONDULEUR_ANOMALY")
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class InverterAnomaly extends Anomaly {

    private String serialNumber;       // Inverter serial number
    private String model;              // Inverter model
    private Double outputPower;        // Power output (kW)
    private Double temperature;        // Inverter temperature (°C)
    private String faultCode;          // Error code
    private String faultDescription;   // Description of the fault
    private Boolean isRunning;         // Is it running?

    public InverterAnomaly(String serialNumber, String model,
                           Double outputPower, String faultCode) {
        this.serialNumber = serialNumber;
        this.model = model;
        this.outputPower = outputPower;
        this.faultCode = faultCode;
        this.isRunning = true;

    }
}