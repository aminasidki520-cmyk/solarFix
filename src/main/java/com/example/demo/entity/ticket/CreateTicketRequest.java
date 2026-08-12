package com.example.demo.entity.ticket;

import com.example.demo.entity.ticket.TicketPriority;
import com.example.demo.entity.ticket.TicketStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateTicketRequest {
    private String title;
    private String description;
    private TicketPriority priority;
    private TicketStatus status; // optional, defaults to OPEN if null
    private Long anomalyId;      // required — Ticket.anomaly is mandatory
    private LocalDateTime dueDate; // optional
    private String additionalNotes; // optional — becomes a TicketUpdate after creation
}
