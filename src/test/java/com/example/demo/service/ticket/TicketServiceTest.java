package com.example.demo.service.ticket;

import com.example.demo.entity.anomaly.Anomaly;
import com.example.demo.entity.anomaly.Severity;
import com.example.demo.entity.equipement.Equipment;
import com.example.demo.entity.ticket.AssignmentStatus;
import com.example.demo.entity.ticket.CreateTicketRequest;
import com.example.demo.entity.ticket.Ticket;
import com.example.demo.entity.ticket.TicketAssignment;
import com.example.demo.entity.ticket.TicketPriority;
import com.example.demo.entity.ticket.TicketStatus;
import com.example.demo.entity.ticket.TicketUpdate;
import com.example.demo.entity.user.Administrator;
import com.example.demo.entity.user.Technician;
import com.example.demo.exception.BusinessException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.anomaly.AnomalyRepository;
import com.example.demo.repository.ticket.TicketAssignmentRepository;
import com.example.demo.repository.ticket.TicketRepository;
import com.example.demo.repository.user.AdministratorRepository;
import com.example.demo.service.User.TechnicianService;
import com.example.demo.service.notification.NotificationService;
import com.example.demo.entity.report.Report;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TicketServiceTest {

    @Mock
    private TicketRepository ticketRepository;

    @Mock
    private TechnicianService technicianService;

    @Mock
    private AdministratorRepository administratorRepository;

    @Mock
    private TicketAssignmentRepository ticketAssignmentRepository;

    @Mock
    private TicketAssignmentService ticketAssignmentService;

    @Mock
    private NotificationService notificationService;

    @Mock
    private AnomalyRepository anomalyRepository;

    @Mock
    private Equipment equipment;

    @Mock
    private Administrator administrator;

    @Mock
    private Technician technician;

    @Mock
    private TicketAssignment ticketAssignment;

    @InjectMocks
    private TicketService ticketService;


    // ============================================================
    // GET TICKET BY ID
    // ============================================================

    @Test
    void getTicketById_shouldReturnTicket_whenTicketExists() {

        Long ticketId = 1L;

        Ticket ticket = new Ticket();

        when(ticketRepository.findByIdWithAssignmentsAndTechnician(ticketId))
                .thenReturn(Optional.of(ticket));

        Ticket result = ticketService.getTicketById(ticketId);

        assertNotNull(result);
        assertEquals(ticket, result);

        verify(ticketRepository)
                .findByIdWithAssignmentsAndTechnician(ticketId);
    }


    @Test
    void getTicketById_shouldThrowResourceNotFoundException_whenTicketDoesNotExist() {

        Long ticketId = 999L;

        when(ticketRepository.findByIdWithAssignmentsAndTechnician(ticketId))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> ticketService.getTicketById(ticketId)
        );
    }


    // ============================================================
    // GET ALL TICKETS
    // ============================================================

    @Test
    void getAllTickets_shouldReturnAllTickets() {

        Ticket ticket1 = new Ticket();
        Ticket ticket2 = new Ticket();

        when(ticketRepository.findAll())
                .thenReturn(List.of(ticket1, ticket2));

        List<Ticket> result = ticketService.getAllTickets();

        assertEquals(2, result.size());
        assertEquals(ticket1, result.get(0));
        assertEquals(ticket2, result.get(1));

        verify(ticketRepository).findAll();
    }


    // ============================================================
    // GET TICKETS BY PRIORITY
    // ============================================================

    @Test
    void getTicketWithPriority_shouldReturnMatchingTickets() {

        Ticket ticket = new Ticket();

        when(ticketRepository.findByPriority(TicketPriority.HIGH))
                .thenReturn(List.of(ticket));

        List<Ticket> result =
                ticketService.getTicketWithPriority(TicketPriority.HIGH);

        assertEquals(1, result.size());
        assertEquals(ticket, result.get(0));

        verify(ticketRepository)
                .findByPriority(TicketPriority.HIGH);
    }


    // ============================================================
    // UPDATE STATUS
    // ============================================================

    @Test
    void updateTicketStatus_shouldUpdateStatus_whenTicketExists() {

        Long ticketId = 1L;

        Ticket ticket = new Ticket();
        ticket.setStatus(TicketStatus.OPEN);

        when(ticketRepository.findById(ticketId))
                .thenReturn(Optional.of(ticket));

        ticketService.updateTicketStatus(
                ticketId,
                TicketStatus.IN_PROGRESS
        );

        assertEquals(
                TicketStatus.IN_PROGRESS,
                ticket.getStatus()
        );

        verify(ticketRepository).save(ticket);
    }


    @Test
    void updateTicketStatus_shouldDoNothing_whenTicketDoesNotExist() {

        Long ticketId = 999L;

        when(ticketRepository.findById(ticketId))
                .thenReturn(Optional.empty());

        ticketService.updateTicketStatus(
                ticketId,
                TicketStatus.IN_PROGRESS
        );

        verify(ticketRepository, never()).save(any());
    }


    // ============================================================
    // UPDATE PRIORITY
    // ============================================================

    @Test
    void updateTicketPriority_shouldUpdatePriority_whenTicketExists() {

        Long ticketId = 1L;

        Ticket ticket = new Ticket();
        ticket.setPriority(TicketPriority.LOW);

        when(ticketRepository.findById(ticketId))
                .thenReturn(Optional.of(ticket));

        ticketService.updateTicketPriority(
                ticketId,
                TicketPriority.CRITICAL
        );

        assertEquals(
                TicketPriority.CRITICAL,
                ticket.getPriority()
        );

        verify(ticketRepository).save(ticket);
    }


    @Test
    void updateTicketPriority_shouldDoNothing_whenTicketDoesNotExist() {

        Long ticketId = 999L;

        when(ticketRepository.findById(ticketId))
                .thenReturn(Optional.empty());

        ticketService.updateTicketPriority(
                ticketId,
                TicketPriority.HIGH
        );

        verify(ticketRepository, never()).save(any());
    }


    // ============================================================
    // CREATE MANUAL TICKET
    // ============================================================

    @Test
    void createManualTicket_shouldThrowException_whenAnomalyDoesNotExist() {

        Long anomalyId = 999L;

        CreateTicketRequest request = new CreateTicketRequest();
        request.setAnomalyId(anomalyId);

        when(anomalyRepository.findById(anomalyId))
                .thenReturn(Optional.empty());

        assertThrows(
                RuntimeException.class,
                () -> ticketService.createManualTicket(request)
        );
    }


    @Test
    void createManualTicket_shouldThrowBusinessException_whenAnomalyAlreadyHasTicket() {

        Long anomalyId = 1L;

        Anomaly anomaly = new Anomaly();
        anomaly.setTicket(new Ticket());

        when(anomalyRepository.findById(anomalyId))
                .thenReturn(Optional.of(anomaly));

        CreateTicketRequest request = new CreateTicketRequest();
        request.setAnomalyId(anomalyId);

        assertThrows(
                BusinessException.class,
                () -> ticketService.createManualTicket(request)
        );
    }


    @Test
    void createManualTicket_shouldCreateTicketSuccessfully() {

        Long anomalyId = 1L;

        Anomaly anomaly = new Anomaly();
        anomaly.setAnomalyId(anomalyId);
        anomaly.setRegion("test-region");

        CreateTicketRequest request = new CreateTicketRequest();

        request.setAnomalyId(anomalyId);
        request.setTitle("Test ticket");
        request.setDescription("Test description");
        request.setPriority(TicketPriority.HIGH);
        request.setStatus(TicketStatus.OPEN);
        request.setAdditionalNotes(null);

        when(anomalyRepository.findById(anomalyId))
                .thenReturn(Optional.of(anomaly));

        when(administratorRepository
                .findByRegionOfResponsibility("test-region"))
                .thenReturn(List.of(administrator));

        when(administrator.getId())
                .thenReturn(10L);

        when(technicianService.findBestTechnician("test-region"))
                .thenReturn(technician);

        when(technician.getId())
                .thenReturn(20L);

        when(ticketRepository.save(any(Ticket.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        doReturn(ticketAssignment)
                .when(ticketAssignmentService)
                .createTicketAssignement(
                        anyLong(),
                        any(),
                        anyLong()
                );

        doNothing()
                .when(notificationService)
                .notifyAdmin(any(Administrator.class), any(Ticket.class));

        Ticket result =
                ticketService.createManualTicket(request);

        assertNotNull(result);
        assertEquals("Test ticket", result.getTitle());
        assertEquals("Test description", result.getDescription());
        assertEquals(TicketPriority.HIGH, result.getPriority());
        assertEquals(TicketStatus.OPEN, result.getStatus());
        assertEquals(anomaly, result.getAnomaly());
        assertEquals(administrator, result.getAdministrator());

        verify(ticketRepository).save(any(Ticket.class));
        verify(notificationService)
                .notifyAdmin(administrator, result);
    }


    @Test
    void createManualTicket_shouldUseOpenStatus_whenStatusIsNull() {

        Long anomalyId = 1L;

        Anomaly anomaly = new Anomaly();
        anomaly.setAnomalyId(anomalyId);
        anomaly.setRegion("test-region");

        CreateTicketRequest request = new CreateTicketRequest();

        request.setAnomalyId(anomalyId);
        request.setTitle("Manual ticket");
        request.setDescription("Description");
        request.setPriority(TicketPriority.LOW);
        request.setStatus(null);
        request.setAdditionalNotes(null);

        when(anomalyRepository.findById(anomalyId))
                .thenReturn(Optional.of(anomaly));

        when(administratorRepository
                .findByRegionOfResponsibility("test-region"))
                .thenReturn(List.of(administrator));

        when(administrator.getId())
                .thenReturn(10L);

        when(technicianService.findBestTechnician("test-region"))
                .thenReturn(technician);

        when(technician.getId())
                .thenReturn(20L);

        when(ticketRepository.save(any(Ticket.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        doReturn(ticketAssignment)
                .when(ticketAssignmentService)
                .createTicketAssignement(
                        anyLong(),
                        any(),
                        anyLong()
                );

        Ticket result =
                ticketService.createManualTicket(request);

        assertEquals(TicketStatus.OPEN, result.getStatus());
    }


    // ============================================================
    // ADD TICKET UPDATE
    // ============================================================

    @Test
    void addTicketUpdate_shouldDoNothing_whenTicketDoesNotExist() {

        Long ticketId = 999L;

        when(ticketRepository.findById(ticketId))
                .thenReturn(Optional.empty());

        ticketService.addTicketUpdate(
                ticketId,
                "Some update"
        );

        verify(ticketRepository, never()).save(any());
    }


    @Test
    void addTicketUpdate_shouldAddUpdate_whenTicketExists() {

        Long ticketId = 1L;

        Ticket ticket = new Ticket();

        ticket.setUpdates(new ArrayList<>());

        when(ticketRepository.findById(ticketId))
                .thenReturn(Optional.of(ticket));

        ticketService.addTicketUpdate(
                ticketId,
                "Technician assigned"
        );

        assertEquals(1, ticket.getUpdates().size());

        TicketUpdate update =
                ticket.getUpdates().get(0);

        assertEquals(
                "Technician assigned",
                update.getUpdateDescription()
        );

        assertEquals(ticket, update.getTicket());

        verify(ticketRepository).save(ticket);
    }


    // ============================================================
    // ADD REPORT
    // ============================================================

    @Test
    void addReportToTicket_shouldDoNothing_whenTicketDoesNotExist() {

        Long ticketId = 999L;

        Report report = new Report();

        when(ticketRepository.findById(ticketId))
                .thenReturn(Optional.empty());

        ticketService.addReportToTicket(
                ticketId,
                report
        );

        verify(ticketRepository, never()).save(any());
    }


    @Test
    void addReportToTicket_shouldAddReport_whenTicketExists() {

        Long ticketId = 1L;

        Ticket ticket = new Ticket();

        ticket.setReports(new ArrayList<>());

        Report report = new Report();

        when(ticketRepository.findById(ticketId))
                .thenReturn(Optional.of(ticket));

        ticketService.addReportToTicket(
                ticketId,
                report
        );

        assertEquals(1, ticket.getReports().size());
        assertEquals(report, ticket.getReports().get(0));
        assertEquals(ticket, report.getTicket());

        verify(ticketRepository).save(ticket);
    }


    // ============================================================
    // DELETE TICKET
    // ============================================================

    @Test
    void deleteTicket_shouldThrowException_whenTicketDoesNotExist() {

        Long ticketId = 999L;

        when(ticketRepository.findById(ticketId))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> ticketService.deleteTicket(ticketId)
        );

        verify(ticketRepository, never())
                .delete(any());
    }


    @Test
    void deleteTicket_shouldDeleteTicket_andUnlinkAnomaly() {

        Long ticketId = 1L;

        Ticket ticket = new Ticket();

        Anomaly anomaly = new Anomaly();
        anomaly.setTicket(ticket);

        ticket.setAnomaly(anomaly);

        when(ticketRepository.findById(ticketId))
                .thenReturn(Optional.of(ticket));

        ticketService.deleteTicket(ticketId);

        assertNull(anomaly.getTicket());

        verify(ticketRepository)
                .delete(ticket);
    }


    // ============================================================
    // ASSIGN TICKET
    // ============================================================

         // ============================================================
    // ASSIGN TICKET
    // ============================================================

    @Test
    void assignTicketToTechnician_shouldDoNothing_whenTicketDoesNotExist() {

        Long ticketId = 999L;
        Long technicianId = 20L;

        when(ticketRepository.findById(ticketId))
                .thenReturn(Optional.empty());

        when(technicianService.getTechnicianById(technicianId))
                .thenReturn(technician);

        ticketService.assignTicketToTechnician(
                ticketId,
                technicianId
        );

        verify(ticketRepository)
                .findById(ticketId);

        verify(ticketRepository, never())
                .save(any(Ticket.class));
    }


    @Test
    void assignTicketToTechnician_shouldDoNothing_whenTechnicianDoesNotExist() {

        Long ticketId = 1L;
        Long technicianId = 20L;

        Ticket ticket = new Ticket();
        ticket.setAssignments(new ArrayList<>());

        when(ticketRepository.findById(ticketId))
                .thenReturn(Optional.of(ticket));

        when(technicianService.getTechnicianById(technicianId))
                .thenReturn(null);

        ticketService.assignTicketToTechnician(
                ticketId,
                technicianId
        );

        verify(ticketRepository)
                .findById(ticketId);

        verify(ticketRepository, never())
                .save(any(Ticket.class));
    }


    @Test
    void assignTicketToTechnician_shouldCreateAssignment_whenBothExist() {

        Long ticketId = 1L;
        Long technicianId = 20L;

        Ticket ticket = new Ticket();
        ticket.setAssignments(new ArrayList<>());

        when(ticketRepository.findById(ticketId))
                .thenReturn(Optional.of(ticket));

        when(technicianService.getTechnicianById(technicianId))
                .thenReturn(technician);

        ticketService.assignTicketToTechnician(
                ticketId,
                technicianId
        );

        assertEquals(
                1,
                ticket.getAssignments().size()
        );

        TicketAssignment assignment =
                ticket.getAssignments().get(0);

        assertEquals(
                ticket,
                assignment.getTicket()
        );

        assertEquals(
                technician,
                assignment.getTechnician()
        );

        assertEquals(
                AssignmentStatus.PENDING,
                assignment.getStatus()
        );

        assertNotNull(
                assignment.getAssignedAt()
        );

        verify(ticketRepository)
                .save(ticket);

        verify(ticketAssignmentRepository, never())
                .save(any(TicketAssignment.class));
    }
    


    // ============================================================
    // CREATE TICKET - PRIORITY
    // ============================================================

    @Test
    void createTicket_shouldSetLowPriority_whenSeverityIsLow() {

        Ticket ticket =
                createTicketWithSeverity(Severity.LOW);

        assertEquals(
                TicketPriority.LOW,
                ticket.getPriority()
        );
    }


    @Test
    void createTicket_shouldSetMediumPriority_whenSeverityIsMedium() {

        Ticket ticket =
                createTicketWithSeverity(Severity.MEDIUM);

        assertEquals(
                TicketPriority.MEDIUM,
                ticket.getPriority()
        );
    }


    @Test
    void createTicket_shouldSetCriticalPriority_whenSeverityIsHigh() {

        Ticket ticket =
                createTicketWithSeverity(Severity.HIGH);

        assertEquals(
                TicketPriority.CRITICAL,
                ticket.getPriority()
        );
    }


    private Ticket createTicketWithSeverity(
            Severity severity
    ) {

        Anomaly anomaly = new Anomaly();

        anomaly.setAnomalyId(1L);
        anomaly.setSeverity(severity);
        anomaly.setAnomalyType(null);
        anomaly.setRegion("test-region");
        anomaly.setEquipment(equipment);

        when(equipment.getSerialNumber())
                .thenReturn("TEST-SERIAL");

        when(administratorRepository
                .findByRegionOfResponsibility("test-region"))
                .thenReturn(List.of(administrator));

        when(administrator.getId())
                .thenReturn(10L);

        when(technicianService
                .findBestTechnician("test-region"))
                .thenReturn(technician);

        when(technician.getId())
                .thenReturn(20L);

        when(ticketAssignmentService
                .createTicketAssignement(
                        20L,
                        null,
                        10L
                ))
                .thenReturn(ticketAssignment);

        when(ticketRepository.save(any(Ticket.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        return ticketService.createTicket(anomaly);
    }
        // ============================================================
    // RESOLVE TICKET
    // ============================================================

    @Test
    void resolveTicket_shouldResolveTicket_whenTicketExists() {

        Long ticketId = 1L;

        Ticket ticket = new Ticket();
        ticket.setStatus(TicketStatus.IN_PROGRESS);

        when(ticketRepository.findById(ticketId))
                .thenReturn(Optional.of(ticket));

        ticketService.resolveTicket(ticketId);

        assertEquals(
                TicketStatus.RESOLVED,
                ticket.getStatus()
        );

        assertNotNull(ticket.getResolvedAt());
        assertNotNull(ticket.getUpdatedAt());

        verify(ticketRepository).save(ticket);
    }


    @Test
    void resolveTicket_shouldDoNothing_whenTicketDoesNotExist() {

        Long ticketId = 999L;

        when(ticketRepository.findById(ticketId))
                .thenReturn(Optional.empty());

        ticketService.resolveTicket(ticketId);

        verify(ticketRepository, never())
                .save(any(Ticket.class));
    }


    // ============================================================
    // CLOSE TICKET
    // ============================================================

    @Test
    void closeTicket_shouldCloseTicket_whenTicketExists() {

        Long ticketId = 1L;

        Ticket ticket = new Ticket();
        ticket.setStatus(TicketStatus.RESOLVED);

        when(ticketRepository.findById(ticketId))
                .thenReturn(Optional.of(ticket));

        ticketService.closeTicket(ticketId);

        assertEquals(
                TicketStatus.CLOSED,
                ticket.getStatus()
        );

        assertNotNull(ticket.getUpdatedAt());

        verify(ticketRepository).save(ticket);
    }


    @Test
    void closeTicket_shouldDoNothing_whenTicketDoesNotExist() {

        Long ticketId = 999L;

        when(ticketRepository.findById(ticketId))
                .thenReturn(Optional.empty());

        ticketService.closeTicket(ticketId);

        verify(ticketRepository, never())
                .save(any(Ticket.class));
    }


    // ============================================================
    // REOPEN TICKET
    // ============================================================

    @Test
    void reopenTicket_shouldReopenTicket_whenTicketExists() {

        Long ticketId = 1L;

        Ticket ticket = new Ticket();
        ticket.setStatus(TicketStatus.CLOSED);

        when(ticketRepository.findById(ticketId))
                .thenReturn(Optional.of(ticket));

        ticketService.reopenTicket(ticketId);

        assertEquals(
                TicketStatus.OPEN,
                ticket.getStatus()
        );

        assertNotNull(ticket.getUpdatedAt());

        verify(ticketRepository).save(ticket);
    }


    @Test
    void reopenTicket_shouldDoNothing_whenTicketDoesNotExist() {

        Long ticketId = 999L;

        when(ticketRepository.findById(ticketId))
                .thenReturn(Optional.empty());

        ticketService.reopenTicket(ticketId);

        verify(ticketRepository, never())
                .save(any(Ticket.class));
    }


    // ============================================================
    // GET TECHNICIAN
    // ============================================================

    @Test
    void getTechnician_shouldReturnTechnician_whenAssignmentExists() {

        Long ticketId = 1L;

        Ticket ticket = new Ticket();

        TicketAssignment assignment = new TicketAssignment();
        assignment.setTechnician(technician);

        ticket.setAssignments(
                new ArrayList<>(List.of(assignment))
        );

        when(ticketRepository
                .findByIdWithAssignmentsAndTechnician(ticketId))
                .thenReturn(Optional.of(ticket));

        Technician result =
                ticketService.getTechnician(ticketId);

        assertEquals(
                technician,
                result
        );
    }


    @Test
    void getTechnician_shouldReturnNull_whenNoAssignmentExists() {

        Long ticketId = 1L;

        Ticket ticket = new Ticket();

        ticket.setAssignments(
                new ArrayList<>()
        );

        when(ticketRepository
                .findByIdWithAssignmentsAndTechnician(ticketId))
                .thenReturn(Optional.of(ticket));

        Technician result =
                ticketService.getTechnician(ticketId);

        assertNull(result);
    }


    // ============================================================
    // GET TICKET BY STATUS
    // ============================================================

    @Test
    void getTicketByStatus_shouldReturnTickets() {

        Ticket ticket = new Ticket();

        when(ticketRepository.findByStatus(TicketStatus.OPEN))
                .thenReturn(List.of(ticket));

        List<Ticket> result =
                ticketService.getTicketByStatus(
                        TicketStatus.OPEN
                );

        assertEquals(1, result.size());
        assertEquals(ticket, result.get(0));

        verify(ticketRepository)
                .findByStatus(TicketStatus.OPEN);
    }


    // ============================================================
    // GET TICKETS BY PRIORITY
    // ============================================================

    @Test
    void getTicketsByPriority_shouldReturnTickets_whenRepositoryReturnsList() {

        Ticket ticket = new Ticket();

        when(ticketRepository.findByPriority(TicketPriority.HIGH))
                .thenReturn(List.of(ticket));

        List<Ticket> result =
                ticketService.getTicketsByPriority(
                        TicketPriority.HIGH
                );

        assertEquals(1, result.size());
        assertEquals(ticket, result.get(0));

        verify(ticketRepository)
                .findByPriority(TicketPriority.HIGH);
    }


    @Test
    void getTicketsByPriority_shouldReturnEmptyList_whenRepositoryReturnsNull() {

        when(ticketRepository.findByPriority(TicketPriority.HIGH))
                .thenReturn(null);

        List<Ticket> result =
                ticketService.getTicketsByPriority(
                        TicketPriority.HIGH
                );

        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(ticketRepository)
                .findByPriority(TicketPriority.HIGH);
    }


    // ============================================================
    // FILTER BY DATE OF CREATION
    // ============================================================

    @Test
    void filterByDateofCreation_shouldReturnTicketInsideDateRange() {

        LocalDateTime startDate =
                LocalDateTime.of(2026, 1, 1, 0, 0);

        LocalDateTime endDate =
                LocalDateTime.of(2026, 1, 10, 0, 0);

        Ticket ticket = new Ticket();

        ticket.setCreatedAt(
                LocalDateTime.of(2026, 1, 5, 12, 0)
        );

        when(ticketRepository.findAll())
                .thenReturn(List.of(ticket));

        List<Ticket> result =
                ticketService.filterByDateofCreation(
                        startDate,
                        endDate
                );

        assertEquals(1, result.size());
        assertEquals(ticket, result.get(0));
    }


    @Test
    void filterByDateofCreation_shouldIgnoreTicketBeforeStartDate() {

        LocalDateTime startDate =
                LocalDateTime.of(2026, 1, 1, 0, 0);

        LocalDateTime endDate =
                LocalDateTime.of(2026, 1, 10, 0, 0);

        Ticket ticket = new Ticket();

        ticket.setCreatedAt(
                LocalDateTime.of(2025, 12, 20, 12, 0)
        );

        when(ticketRepository.findAll())
                .thenReturn(List.of(ticket));

        List<Ticket> result =
                ticketService.filterByDateofCreation(
                        startDate,
                        endDate
                );

        assertTrue(result.isEmpty());
    }


    @Test
    void filterByDateofCreation_shouldIgnoreTicketAfterEndDate() {

        LocalDateTime startDate =
                LocalDateTime.of(2026, 1, 1, 0, 0);

        LocalDateTime endDate =
                LocalDateTime.of(2026, 1, 10, 0, 0);

        Ticket ticket = new Ticket();

        ticket.setCreatedAt(
                LocalDateTime.of(2026, 1, 20, 12, 0)
        );

        when(ticketRepository.findAll())
                .thenReturn(List.of(ticket));

        List<Ticket> result =
                ticketService.filterByDateofCreation(
                        startDate,
                        endDate
                );

        assertTrue(result.isEmpty());
    }
}
