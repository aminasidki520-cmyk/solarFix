package com.example.demo.controllers;
import com.example.demo.entity.user.Technician;
import com.example.demo.payload.technician.ChangePasswordRequest;
import com.example.demo.payload.technician.CreateTechnicianRequest;
import com.example.demo.payload.technician.UpdateTechnicianRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.service.User.TechnicianService;
import java.util.List;


@RestController
@RequestMapping("/api/technicians")
public class TechnicianController {
    @Autowired
    private TechnicianService technicianService;


    // Create a technician
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public void createTechnician(
            @RequestBody CreateTechnicianRequest request) {

        technicianService.createTechnician(request);
    }

    // Get all technicians
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Technician> getAllTechnicians() {
        return technicianService.getAllTechnicians();
    }

    // Get technician by id
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Technician getTechnicianById(@PathVariable Long id) {
        return technicianService.getTechnicianById(id);
    }

    // Get available technicians
    @GetMapping("/available")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Technician> getAvailableTechnicians() {
        return technicianService.getAvailableTechnicians();
    }

    // Get technicians ordered by number of assigned tickets
    @GetMapping("/least-busy")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Technician> getLeastBusyTechnicians() {
        return technicianService.getTechniciansWithTheLeastTickets();
    }

    // Update technician information
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Technician updateTechnician(
            @RequestBody UpdateTechnicianRequest request,
            @PathVariable Long id) {

        return technicianService.updateTechnician(request,id);
    }

    // Update availability
    @PutMapping("/{id}/availability")
    @PreAuthorize("hasRole('ADMIN')")
    public Technician updateAvailability(
            @PathVariable Long id,
            @RequestParam boolean availability) {

        return technicianService.updateAvailability(id, availability);
    }

    // Update assigned tickets counter
    @PutMapping("/{id}/tickets")
    @PreAuthorize("hasRole('ADMIN')")
    public Technician updateAssignedTickets(
            @PathVariable Long id,
            @RequestParam long numberOfTickets) {

        return technicianService.updateNumberOfAssignedTickets(id, numberOfTickets);
    }

    // Update skills
    @PutMapping("/{id}/skills")
    @PreAuthorize("hasRole('ADMIN')")
    public Technician updateSkills(
            @PathVariable Long id,
            @RequestBody List<String> skills) {

        return technicianService.updateSkills(id, skills);
    }

    // Change password
    @PutMapping("/{id}/password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> changePassword(@PathVariable Long id,
                                         @RequestBody ChangePasswordRequest request) {

        technicianService.changePassword(request, id);
        return ResponseEntity.ok("Password updated succesfully");
    }

    // Delete technician
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteTechnician(@PathVariable Long id) {
        technicianService.deleteTechnician(id);
    }



}