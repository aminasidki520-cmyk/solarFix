package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
   
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {

        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*");
        // .withSockJS(); // Uncomment this if your frontend uses SockJS
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {

        // Messages sent from the client to the server
        registry.setApplicationDestinationPrefixes("/app");

        // Destinations where the server sends messages
        registry.enableSimpleBroker("/topic", "/queue");

        // Prefix for user-specific destinations
        registry.setUserDestinationPrefix("/user");
    }
}