package com.example.demo.service.anomaly;
import com.example.demo.entity.anomaly.Anomaly;
import com.example.demo.entity.ticket.Ticket;
import com.example.demo.repository.ticket.TicketRepository;
import com.example.demo.repository.anomaly.AnomalyRepository;
import com.example.demo.service.ticket.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;




@Service
public class AnomalyPollingService {

    @Autowired
    private AnomalyRepository anomalyRepository;

    @Autowired
    private TicketService ticketService;

    @Autowired
    private TicketRepository ticketRepository;

    @Scheduled(fixedDelay = 30000) // toutes les 30 secondes
    @Transactional
    public void checkNewAnomalies() {
        System.out.println("========== POLLING ==========");

        List<Anomaly> newAnomalies = anomalyRepository.findByProcessedFalse();
        System.out.println("Found anomalies = " + newAnomalies.size());
        for (Anomaly anomaly : newAnomalies) {
            Ticket ticket=ticketService.createTicket(anomaly);

            anomaly.setProcessed(true);
            anomalyRepository.save(anomaly);

        }
    }
}