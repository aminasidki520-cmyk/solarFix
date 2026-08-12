package com.example.demo.repository.user;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.entity.user.Technician;
import java.util.List;
import java.util.Optional;

public interface TechnicianRepository  extends JpaRepository<Technician, Long> {
    List<Technician> findByAvailabilityAndRegionOfResponsibilityOrderByNumberOfTicketAssignedAsc(
            boolean availability,
            String regionOfResponsibility
    );
    List<Technician> findAllByOrderByNumberOfTicketAssignedAsc();
    List <Technician> findAllByRegionOfResponsibility(String regionOfResponsibility);
    Technician findTechnicianById(Long id);
    List<Technician> findTechnicianByUsername(String username);
    List<Technician> findTechnicianBySkillsAndRegionOfResponsibility(List<String> skills, String regionOfResponsibility);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    List<Technician> findByAvailability(Boolean availability);
    Optional<Technician> findByUsername(String username);

}
