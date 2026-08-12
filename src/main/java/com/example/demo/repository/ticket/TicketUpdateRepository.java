package com.example.demo.repository.ticket;

import com.example.demo.entity.ticket.TicketUpdate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// NOTE: your original file was `public class ticketUpdateRepository {}`.
// A Spring Data repository must be an interface extending JpaRepository
// (not a plain class), and by convention the class name is PascalCase.
public interface TicketUpdateRepository extends JpaRepository<TicketUpdate, Long> {

    // Powers the "Activity Timeline" on the ticket detail panel:
    // most recent update first.
    List<TicketUpdate> findByTicket_TicketIdOrderByUpdatedAtDesc(Long ticketId);
}
