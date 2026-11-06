package cl.duoc.demo.service;

import cl.duoc.demo.dto.UsuarioRequest;
import cl.duoc.demo.model.Usuario;
import cl.duoc.demo.repository.UsuarioRepository;
import java.util.List;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UsuarioService {
    private final UsuarioRepository repo;
    private final PasswordEncoder encoder;

    public UsuarioService(UsuarioRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    @Transactional(readOnly = true)
    public List<Usuario> listar() { return repo.findAll(); }

    @Transactional(readOnly = true)
    public Usuario buscar(Long id) {
        return repo.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
    }

    private String normalizarCorreo(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private void validar(UsuarioRequest datos, boolean creando) {
        if (datos == null || datos.nombre() == null || datos.nombre().isBlank()
                || datos.email() == null || datos.email().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nombre y correo obligatorios");
        }
        if (creando && (datos.password() == null || datos.password().isBlank())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Se requiere contraseña");
        }
    }

    private void validarCorreo(String email, Long idActual) {
        repo.findByEmail(email).ifPresent(otro -> {
            if (!otro.getId().equals(idActual)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Correo ya registrado");
            }
        });
    }

    private String resolverRol(String rol) {
        return "ADMIN".equals(rol) ? "ADMIN" : "USER";
    }

    @Transactional
    public Usuario crear(UsuarioRequest datos) {
        validar(datos, true);
        String email = normalizarCorreo(datos.email());
        validarCorreo(email, null);
        Usuario usuario = new Usuario();
        usuario.setNombre(datos.nombre().trim());
        usuario.setEmail(email);
        usuario.setPasswordHash(encoder.encode(datos.password()));
        usuario.setRol(resolverRol(datos.rol()));
        return repo.save(usuario);
    }

    @Transactional
    public Usuario editar(Long id, UsuarioRequest datos, String correoAutenticado) {
        validar(datos, false);
        Usuario usuario = buscar(id);
        String email = normalizarCorreo(datos.email());
        String rol = resolverRol(datos.rol());
        validarCorreo(email, id);
        if (usuario.getEmail().equals(correoAutenticado)
                && (!usuario.getEmail().equals(email) || !"ADMIN".equals(rol))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                "No puedes cambiar tu propio correo o rol ADMIN durante la sesion");
        }
        if ("ADMIN".equals(usuario.getRol()) && !"ADMIN".equals(rol)
                && repo.countByRol("ADMIN") <= 1) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Debe existir al menos un ADMIN");
        }
        usuario.setNombre(datos.nombre().trim());
        usuario.setEmail(email);
        usuario.setRol(rol);
        if (datos.password() != null && !datos.password().isBlank()) {
            usuario.setPasswordHash(encoder.encode(datos.password()));
        }
        return repo.save(usuario);
    }

    @Transactional
    public void eliminar(Long id, String correoAutenticado) {
        Usuario usuario = buscar(id);
        if (usuario.getEmail().equals(correoAutenticado)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "No puedes eliminar tu propia cuenta");
        }
        if ("ADMIN".equals(usuario.getRol()) && repo.countByRol("ADMIN") <= 1) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "No puedes eliminar al ultimo ADMIN");
        }
        repo.delete(usuario);
    }
}
