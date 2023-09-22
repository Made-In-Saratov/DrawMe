package ru.madeinsaratov.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PnmController {
    @GetMapping("/api/hello-page")
    public String helloPage() {
        return "Hello. This is Draw Me - media editor application.";
    }
}
