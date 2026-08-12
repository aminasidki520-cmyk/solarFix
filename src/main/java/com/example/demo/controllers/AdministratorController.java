package com.example.demo.controllers;


import com.example.demo.entity.user.Administrator;
import com.example.demo.service.User.AdministratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdministratorController {
    @Autowired
    private AdministratorService administratorService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public String dashboard() {
        return "Welcome Administrator!";
    }

    @GetMapping("/by-region")
    @PreAuthorize("hasRole('ADMIN')")   // adjust if needed
    public ResponseEntity<List<Administrator>> getAdministratorsByRegion(
            @RequestParam String region) {
        List<Administrator> admins = administratorService.getAdministratorsByRegion(region);
        return ResponseEntity.ok(admins);
    }

    // (Optional) endpoint to get the first administrator by region
    @GetMapping("/first-by-region")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Administrator> getFirstAdministratorByRegion(
            @RequestParam String region) {
        List<Administrator> admins = administratorService.getAdministratorsByRegion(region);
        if (admins.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(admins.get(0));}

}