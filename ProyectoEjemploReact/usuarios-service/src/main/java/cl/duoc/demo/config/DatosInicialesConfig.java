package cl.duoc.demo.config;

import cl.duoc.demo.model.Usuario;
import cl.duoc.demo.repository.UsuarioRepository;
import java.sql.Connection;
import javax.sql.DataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DatosInicialesConfig {
    private static final Logger log = LoggerFactory.getLogger(DatosInicialesConfig.class);

    @Bean
    PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

    @Bean
    CommandLineRunner cargarUsuariosIniciales(UsuarioRepository repositorio,
            PasswordEncoder codificador, DataSource dataSource,
            @Value("${app.seed.enabled:true}") boolean habilitado) {
        return args -> {
            try (Connection conexion = dataSource.getConnection()) {
                log.info("Base de datos H2 en uso: {}", conexion.getMetaData().getURL());
            }
            if (!habilitado) return;
            crearSiNoExiste(repositorio, codificador, "Administrador", "admin@duoc.cl", "Admin123!", "ADMIN");
            crearSiNoExiste(repositorio, codificador, "Profesor Demo", "profesor@duoc.cl", "Profesor123!", "USER");
            crearSiNoExiste(repositorio, codificador, "Alumno Demo", "alumno@duoc.cl", "Alumno123!", "USER");
            log.info("Usuarios disponibles en H2: {}", repositorio.count());
        };
    }

    private void crearSiNoExiste(UsuarioRepository repositorio, PasswordEncoder codificador,
            String nombre, String email, String password, String rol) {
        if (repositorio.findByEmail(email).isPresent()) return;
        Usuario usuario = new Usuario();
        usuario.setNombre(nombre);
        usuario.setEmail(email);
        usuario.setPasswordHash(codificador.encode(password));
        usuario.setRol(rol);
        repositorio.save(usuario);
    }
}
