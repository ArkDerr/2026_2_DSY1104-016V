package cl.duoc.demo.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtFilter extends OncePerRequestFilter {
    private final JwtService jwtService;

    public JwtFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
            FilterChain chain) throws ServletException, IOException {
        String cabecera = request.getHeader("Authorization");
        if (cabecera != null && cabecera.startsWith("Bearer ")) {
            try {
                Claims claims = jwtService.verificar(cabecera.substring(7));
                String rol = claims.get("role", String.class);
                String email = claims.getSubject();
                if (email != null && !email.isBlank() &&
                        ("ADMIN".equals(rol) || "USER".equals(rol))) {
                    var permisos = List.of(new SimpleGrantedAuthority("ROLE_" + rol));
                    var autenticacion = new UsernamePasswordAuthenticationToken(email, null, permisos);
                    SecurityContextHolder.getContext().setAuthentication(autenticacion);
                }
            } catch (JwtException | IllegalArgumentException ex) {
                // Token inexistente/invalido/caducado: sigue como usuario anonimo.
                SecurityContextHolder.clearContext();
            }
        }
        chain.doFilter(request, response);
    }
}
