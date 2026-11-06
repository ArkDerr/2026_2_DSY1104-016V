package cl.duoc.demo.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/** Firma y valida los JWT compartidos entre ambos microservicios. */
@Service
public class JwtService {
    private final SecretKey key;

    public JwtService(@Value("${app.jwt.secret}") String secret) {
        byte[] bytes = secret.getBytes(StandardCharsets.UTF_8);
        if (bytes.length < 32) {
            throw new IllegalArgumentException("JWT_SECRET debe tener al menos 32 bytes UTF-8");
        }
        this.key = Keys.hmacShaKeyFor(bytes);
    }

    public String generar(String email, String rol) {
        Date ahora = new Date();
        Date vence = new Date(ahora.getTime() + 3_600_000);
        return Jwts.builder()
                .subject(email)
                .claim("role", rol)
                .issuedAt(ahora)
                .expiration(vence)
                .signWith(key)
                .compact();
    }

    public Claims verificar(String token) {
        return Jwts.parser().verifyWith(key).build()
                .parseSignedClaims(token).getPayload();
    }
}
