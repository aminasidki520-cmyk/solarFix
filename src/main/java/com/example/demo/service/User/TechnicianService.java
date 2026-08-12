package com.example.demo.service.User;

import org.springframework.stereotype.Service;
import com.example.demo.repository.user.TechnicianRepository;
import com.example.demo.entity.user.Technician;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.entity.user.Role;
import com.example.demo.payload.technician.CreateTechnicianRequest;
import com.example.demo.payload.technician.UpdateTechnicianRequest;
import com.example.demo.payload.technician.ChangePasswordRequest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Service
public class TechnicianService {
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private TechnicianRepository technicianRepository;

    public void createTechnician(CreateTechnicianRequest request) {
        // Check if username already exists
        if (technicianRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists.");
        }

        // Check if email already exists
        if (technicianRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists.");
        }

        Technician technician = new Technician();

        technician.setFirstName(request.getFirstName());
        technician.setLastName(request.getLastName());
        technician.setUsername(request.getUsername());
        technician.setEmail(request.getEmail());
        technician.setPassword(passwordEncoder.encode(request.getPassword()));
        technician.setPhoneNumber(request.getPhoneNumber());
        technician.setRegionOfResponsibility(request.getRegion());
        technician.setAvailability(request.isAvailability());
        technician.setSkills(request.getSkills());

        // Default values
        technician.setRole(Role.TECHNICIAN);
        technician.setNumberOfTicketAssigned(0L);

        technicianRepository.save(technician);
    }

    public Technician updateTechnician(UpdateTechnicianRequest request, Long id) {

        Technician technician = technicianRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Technician not found"));

        technician.setFirstName(request.getFirstName());
        technician.setAvailability(request.isAvailability());
        technician.setLastName(request.getLastName());
        technician.setEmail(request.getEmail());
        technician.setPhoneNumber(request.getPhoneNumber());
        technician.setRegionOfResponsibility(request.getRegion());

        return technicianRepository.save(technician);
    }

    public Technician updateAvailability(Long id, boolean availability) {

        Technician technician = technicianRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Technician not found"));

        technician.setAvailability(availability);

        return technicianRepository.save(technician);
    }


    public Technician updateNumberOfAssignedTickets(Long id, long numberOfTickets) {

        Technician technician = technicianRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Technician not found"));

        technician.setNumberOfTicketAssigned(numberOfTickets);

        return technicianRepository.save(technician);
    }

    public Technician updateSkills(Long id, List<String> skills) {

        Technician technician = technicianRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Technician not found"));

        technician.setSkills(skills);

        return technicianRepository.save(technician);
    }

    public void changePassword(ChangePasswordRequest request,Long id) {

        Technician technician = technicianRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Technician not found"));

        technician.setPassword(passwordEncoder.encode(request.getNewPassword()));

         technicianRepository.save(technician);
    }


    public List<Technician> getAllTechnicians() {
        return technicianRepository.findAll();
    }

    public Technician getTechnicianById(Long id) {
        return technicianRepository.findById(id).orElse(null);
    }

    public List<Technician> getAvailableTechnicians() {
        return technicianRepository.findByAvailability(true);
    }

    ;

    public void deleteTechnician(Long id) {
        technicianRepository.deleteById(id);
    }

    public List<Technician> getTechniciansWithTheLeastTickets() {
        return technicianRepository.findAllByOrderByNumberOfTicketAssignedAsc();
    }

    public Technician findBestTechnician(String region){
        List<Technician> techs = technicianRepository.findByAvailabilityAndRegionOfResponsibilityOrderByNumberOfTicketAssignedAsc(true, region);
        if (techs.isEmpty()) {
            System.out.println(">>> Aucun technicien disponible dans la région : " + region);
            return null; // Renvoie null pour éviter le crash
        }
        return techs.get(0);
    }

    


}
