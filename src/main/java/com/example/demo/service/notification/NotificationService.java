package com.example.demo.service.notification;

import com.example.demo.entity.ticket.Ticket;
import com.example.demo.entity.user.Administrator;
import com.example.demo.entity.user.Technician;
import org.springframework.beans.factory.annotation.Autowired;//this makes the object to be created automatically
import org.springframework.messaging.simp.SimpMessagingTemplate;// it is responsible for sending the messages
import org.springframework.stereotype.Service;

@Service//Spring automatically creates one object of this class when the application starts
public class NotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void notifyAdmin(Administrator administrator, Ticket ticket) {

        String message =
                "A new ticket has been assigned.\n" +
                        "Ticket #" + ticket.getTicketId() +
                        " - " + ticket.getTitle();

        messagingTemplate.convertAndSendToUser(
                administrator.getUsername(),
                "/queue/notifications",//this is the destination
                message
        );
    }
    public void notifyTechnician(Technician technician,Ticket ticket){
        String message =
                "A new ticket has been assigned to you .\n" +
                        "Ticket #" + ticket.getTicketId() +
                        " - " + ticket.getTitle();

        messagingTemplate.convertAndSendToUser(
                technician.getUsername(),
                "/queue/notifications",//this is the destination
                message
        );

    }
}