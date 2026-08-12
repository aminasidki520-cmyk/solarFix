package com.example.demo.repository.ticket;
import com.example.demo.entity.ticket.TicketPriority;
import com.example.demo.entity.ticket.TicketStatus;
import com.example.demo.entity.user.Administrator;
import com.example.demo.entity.user.Technician;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.entity.ticket.Ticket;
import java.util.List;
@Repository
public interface TicketRepository  extends JpaRepository<Ticket, Long> {
    Ticket findByTicketId(Long ticketId);
    List<Ticket> findByPriority(TicketPriority priority);

    List<Ticket> findByStatus(TicketStatus status);
    @Query("SELECT t FROM Ticket t LEFT JOIN FETCH t.assignments a LEFT JOIN FETCH a.technician WHERE t.ticketId = :id")
    Optional<Ticket> findByIdWithAssignmentsAndTechnician(@Param("id") Long id);

}
