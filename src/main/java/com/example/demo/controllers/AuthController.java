package com.example.demo.controllers;
import com.example.demo.entity.user.Role;
import com.example.demo.entity.user.Technician;
import com.example.demo.entity.user.User;
import com.example.demo.entity.user.Administrator;
import com.example.demo.payload.JwtResponse;
import com.example.demo.payload.LoginRequest;
import com.example.demo.payload.RegisterRequest;
import com.example.demo.repository.user.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import com.example.demo.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        System.out.println("1");
        if (userRepository.existsByUsername(request.getUsername())) {
            System.out.println("2");
            return ResponseEntity.badRequest().body("Erreur : ce nom d'utilisateur existe déjà");
        }
        System.out.println("3");
        Technician technician = new Technician();
        technician.setRole(Role.TECHNICIAN);

        technician.setUsername(request.getUsername());
        technician.setPassword(passwordEncoder.encode(request.getPassword()));

        technician.setFirstName(request.getFirstName());
        technician.setLastName(request.getLastName());
        technician.setEmail(request.getEmail());
        technician.setPhoneNumber(request.getPhoneNumber());
        technician.setRegionOfResponsibility(request.getRegionOfResponsibility());

        userRepository.save(technician);
        System.out.println("7");
        return ResponseEntity.ok("Technicien créé avec succès");
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new RuntimeException("User not found after successful authentication"));

        String token = jwtUtil.generateToken(user.getUsername());

        return ResponseEntity.ok(
                new JwtResponse(
                        token,
                        user.getUsername(),
                        user.getRole()
                )
        );
    }

    @PostMapping("/create-admin")
    public ResponseEntity<?> createAdmin() {
        return ResponseEntity.status(403).body("Endpoint désactivé");
    }



}