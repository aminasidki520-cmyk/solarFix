package com.example.demo.service.ticket;

import com.example.demo.entity.anomaly.Anomaly;
import com.example.demo.entity.equipement.Equipment;
import com.example.demo.entity.report.Report;
import com.example.demo.entity.user.Administrator;
import com.example.demo.entity.ticket.CreateTicketRequest;
import com.example.demo.entity.user.Technician;
import com.example.demo.entity.ticket.Ticket;
import com.example.demo.entity.ticket.TicketAssignment;
import com.example.demo.entity.ticket.TicketStatus;
import com.example.demo.entity.ticket.TicketPriority;
import com.example.demo.entity.ticket.TicketUpdate;
import com.example.demo.entity.ticket.AssignmentStatus;
import com.example.demo.service.notification.NotificationService;
import com.example.demo.repository.ticket.TicketAssignmentRepository;


import com.example.demo.entity.user.Administrator;
import com.example.demo.repository.ticket.TicketRepository;
import com.example.demo.repository.user.AdministratorRepository;
import com.example.demo.service.User.TechnicianService;
import com.example.demo.repository.anomaly.AnomalyRepository;
import com.example.demo.service.ticket.TicketAssignmentService;
import jakarta.persistence.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;
    @Autowired
    private TechnicianService technicianService;
    @Autowired
    private AdministratorRepository administratorRepository;
    @Autowired
    private TicketAssignmentRepository ticketAssignmentRepository;
    @Autowired
    private TicketAssignmentService ticketAssignmentService;
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private AnomalyRepository anomalyRepository;

    @Transactional
    public Ticket createTicket(Anomaly anomaly) {
        System.out.println("========== createTicket() called ==========");
        log.info("createTicket() called with anomalyId: {}", anomaly.getAnomalyId());

        Ticket ticket = new Ticket();
        ticket.setTitle("Anomaly detected - " + anomaly.getAnomalyType());
        ticket.setDescription("Automatic ticket created for anomaly on equipment: "
                + anomaly.getEquipment().getSerialNumber());
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        ticket.setResolvedAt(null);
        ticket.setStatus(TicketStatus.OPEN);

        ticket.setPriority(switch (anomaly.getSeverity()) {
            case LOW -> TicketPriority.LOW;
            case MEDIUM -> TicketPriority.MEDIUM;
            case HIGH -> TicketPriority.CRITICAL;
        });

        ticket.setAnomaly(anomaly);


        // Find administrator
        List<Administrator> administrators =
                administratorRepository.findByRegionOfResponsibility(anomaly.getRegion());

        Administrator administrator = administrators.get(0);

        // Assign administrator to ticket
        ticket.setAdministrator(administrator);

        // Save ticket
        ticketRepository.save(ticket);
        anomaly.setTicket(ticket);
        anomaly.setProcessed(true);
        anomalyRepository.save(anomaly);        // <-- PERSIST THE CHANGE

        System.out.println("Ticket saved");
        System.out.println(ticket.getTicketId());
        System.out.println(administrator.getId());

        log.info("Ticket saved with ID: {}", ticket.getTicketId());
        // Find technician
        Technician technician =
                technicianService.findBestTechnician(anomaly.getRegion());

        log.info("Technician found: {}", technician);
        //create ticket assignement
        try {
          TicketAssignment ticketAssignment=  ticketAssignmentService.createTicketAssignement(technician.getId(), ticket.getTicketId(), administrator.getId());
            log.info("Calling createTicketAssignement with tech={}, ticket={}, admin={}",
                    technician.getId(), ticket.getTicketId(), administrator.getId());



            System.out.println("Assignment persisted!");
            System.out.println("Assignment ID = " + ticketAssignment.getAssignmentId());
        }catch(Exception e){
            log.error("Failed to create assignement",e);
        }


        // Send real-time notification
        notificationService.notifyAdmin(administrator,ticket);
        notificationService.notifyTechnician(technician, ticket);

        return ticket;

    }
    @Transactional
    public Ticket createManualTicket(CreateTicketRequest request) {
        Anomaly anomaly = anomalyRepository.findById(request.getAnomalyId())
                .orElseThrow(() -> new RuntimeException("Anomaly not found"));

        if (anomaly.getTicket() != null) {
            throw new RuntimeException("This anomaly is already linked to a ticket");
        }

        Ticket ticket = new Ticket();
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        ticket.setStatus(request.getStatus() != null ? request.getStatus() : TicketStatus.OPEN);
        ticket.setPriority(request.getPriority());
        ticket.setDueDate(request.getDueDate());
        ticket.setAnomaly(anomaly);
        anomaly.setTicket(ticket);

        List<Administrator> administrators =
                administratorRepository.findByRegionOfResponsibility(anomaly.getRegion());
        Administrator administrator = administrators.get(0);
        ticket.setAdministrator(administrator);

        ticketRepository.save(ticket);

        Technician technician = technicianService.findBestTechnician(anomaly.getRegion());
        try {
            ticketAssignmentService.createTicketAssignement(technician.getId(), ticket.getTicketId(), administrator.getId());
        } catch (Exception e) {
            log.error("Failed to create assignment for manual ticket", e);
        }

        if (request.getAdditionalNotes() != null && !request.getAdditionalNotes().isBlank()) {
            addTicketUpdate(ticket.getTicketId(), request.getAdditionalNotes());
        }

        notificationService.notifyAdmin(administrator, ticket);

        return ticket;
    }
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public List<Ticket> getTicketWithPriority(TicketPriority ticketPriority) {

        return  ticketRepository.findByPriority(ticketPriority);

    }
    @Transactional
    public Ticket getTicketById(Long id){
        return ticketRepository.findByIdWithAssignmentsAndTechnician(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }


    public void updateTicketStatus(Long ticketId, TicketStatus status) {
        Ticket ticket = ticketRepository.findById(ticketId).orElse(null);
        if (ticket != null) {
            ticket.setStatus(status);
            ticket.setUpdatedAt(LocalDateTime.now());
            ticketRepository.save(ticket);
        }
    }
    public void updateTicketPriority(Long ticketId, TicketPriority priority) {
        Ticket ticket = ticketRepository.findById(ticketId).orElse(null);
        if (ticket != null) {
            ticket.setPriority(priority);
            ticket.setUpdatedAt(LocalDateTime.now());
            ticketRepository.save(ticket);
        }
    }
    public void addTicketUpdate(Long ticketId, String updateDescription) {
        Ticket ticket = ticketRepository.findById(ticketId).orElse(null);
        if (ticket != null) {
            TicketUpdate ticketUpdate = new TicketUpdate();
            ticketUpdate.setTicket(ticket);
            ticketUpdate.setUpdateDescription(updateDescription);
            ticketUpdate.setUpdatedAt(LocalDateTime.now());
            ticket.getUpdates().add(ticketUpdate);
            ticket.setUpdatedAt(LocalDateTime.now());
            ticketRepository.save(ticket);
        }
    }
    public void addReportToTicket(Long ticketId, Report report) {
        Ticket ticket = ticketRepository.findById(ticketId).orElse(null);
        if (ticket != null) {
            report.setTicket(ticket);
            ticket.getReports().add(report);
            ticket.setUpdatedAt(LocalDateTime.now());
            ticketRepository.save(ticket);
        }
    }
    public void deleteTicket(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(() -> new RuntimeException("Ticket not found"));
        Anomaly anomaly=ticket.getAnomaly();
        if(anomaly !=null){
            anomaly.setTicket(null);
        }

        if (ticket != null) {
            ticketRepository.delete(ticket);
        }
    }
    public void assignTicketToTechnician(Long ticketId, Long technicianId) {
        Ticket ticket = ticketRepository.findById(ticketId).orElse(null);
        Technician technician = technicianService.getTechnicianById(technicianId);
        if (ticket != null && technician != null) {
            TicketAssignment ticketAssignment = new TicketAssignment();
            ticketAssignment.setTicket(ticket);
            ticketAssignment.setTechnician(technician);
            ticketAssignment.setAssignedAt(LocalDateTime.now());
            ticketAssignment.setStatus(AssignmentStatus.PENDING);
            ticket.getAssignments().add(ticketAssignment);
            ticket.setUpdatedAt(LocalDateTime.now());
            ticketRepository.save(ticket);
        }
    }

    public void resolveTicket(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId).orElse(null);
        if (ticket != null) {
            ticket.setStatus(TicketStatus.RESOLVED);
            ticket.setResolvedAt(LocalDateTime.now());
            ticket.setUpdatedAt(LocalDateTime.now());
            ticketRepository.save(ticket);
        }
    }
    public void closeTicket(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId).orElse(null);
        if (ticket != null) {
            ticket.setStatus(TicketStatus.CLOSED);
            ticket.setUpdatedAt(LocalDateTime.now());
            ticketRepository.save(ticket);
        }
    }
    public void reopenTicket(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId).orElse(null);
        if (ticket != null) {
            ticket.setStatus(TicketStatus.OPEN);
            ticket.setUpdatedAt(LocalDateTime.now());
            ticketRepository.save(ticket);
        }
    }
    public  Technician getTechnician(Long ticketId){
        return getTicketById(ticketId).getAssignments().stream()
                .map(TicketAssignment::getTechnician)
                .findFirst()
                .orElse(null);
    }
    public  List<Ticket> getTicketByStatus(TicketStatus ticketStatus){
        return ticketRepository.findByStatus(ticketStatus);
    }
public List<Ticket> getTicketsByPriority(TicketPriority ticketPriority){
        List<Ticket> tickets=ticketRepository.findByPriority(ticketPriority);
        if(tickets !=null){
            return tickets;
        };
        return new ArrayList<>();
}
public List<Ticket> filterByDateofCreation(LocalDateTime startDate, LocalDateTime endDate){
        List<Ticket> tickets=ticketRepository.findAll();
        List<Ticket> filteredTickets=new ArrayList<>();
        for(Ticket ticket:tickets){
            if(ticket.getCreatedAt().isAfter(startDate) && ticket.getCreatedAt().isBefore(endDate)){
                filteredTickets.add(ticket);
            }
        }
        return filteredTickets;
    }




}








