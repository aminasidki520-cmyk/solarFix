package com.example.demo.repository.report;

import com.example.demo.entity.report.Report;
import com.example.demo.entity.report.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {

    List<Report> findByTicket_TicketId(Long ticketId);

    List<Report> findByStatus(ReportStatus status);

    // ASSUMPTION: User entity has getId() (Long) — adjust if it's UUID/String.
    List<Report> findByAuthor_Id(Long authorId);

    List<Report> findAllByOrderByCreatedAtDesc();
}
