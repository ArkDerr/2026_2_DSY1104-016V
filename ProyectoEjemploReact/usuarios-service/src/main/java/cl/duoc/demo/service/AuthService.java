package cl.duoc.demo.service;

import cl.duoc.demo.dto.LoginRequest;
import cl.duoc.demo.dto.LoginResponse;
import cl.duoc.demo.model.Usuario;
import cl.duoc.demo.repository.UsuarioRepository;
import cl.duoc.demo.security.JwtService;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private final UsuarioRepository repo;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    public AuthService(UsuarioRepository repo, PasswordEncoder encoder, JwtService jwtService) {
        this.repo = repo;
        this.encoder = encoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest datos) {
        if (datos == null || datos.email() == null || datos.password() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas");
        }
        String email = datos.email().trim().toLowerCase(Locale.ROOT);
        Usuario usuario = repo.findByEmail(email)
            .filter(u -> encoder.matches(datos.password(), u.getPasswordHash()))
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Credenciales incorrectas"));
        String token = jwtService.generar(usuario.getEmail(), usuario.getRol());
        return new LoginResponse(token, usuario.getNombre(), usuario.getRol());
    }
}
