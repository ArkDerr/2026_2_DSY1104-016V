package cl.duoc.demo.controller;

import cl.duoc.demo.dto.LoginRequest;
import cl.duoc.demo.dto.LoginResponse;
import cl.duoc.demo.service.AuthService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService service;
    public AuthController(AuthService service) { this.service = service; }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest datos) {
        return service.login(datos);
    }
}
