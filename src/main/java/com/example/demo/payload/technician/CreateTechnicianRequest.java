package com.example.demo.payload.technician;
import lombok.Data;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class CreateTechnicianRequest {
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String password;
    private String phoneNumber;
    private String region;
    private boolean availability;
    private List<String> skills;
}
