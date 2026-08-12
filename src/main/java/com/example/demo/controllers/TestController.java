package com.example.demo.controllers;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/hello")
    public String helloPublic() {
        return "Hello! This is a PUBLIC endpoint.";
    }

    @GetMapping("/protected")
    public String helloProtected() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return "Hello " + username + "! This is a PROTECTED endpoint.";
    }

    @GetMapping("/user-info")
    public Object userInfo(Authentication authentication) {
        return "Username: " + authentication.getName()
                + ", Roles: " + authentication.getAuthorities();
    }
}

