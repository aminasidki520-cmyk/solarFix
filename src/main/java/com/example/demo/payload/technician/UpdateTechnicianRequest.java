package com.example.demo.payload.technician;

import java.util.List;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class UpdateTechnicianRequest {
private String firstName;
private String lastName;
private String email;
private String phoneNumber;
private String region;
private boolean availability;
private List<String> skills; }
