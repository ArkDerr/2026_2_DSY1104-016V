package cl.duoc.demo.service;

import cl.duoc.demo.model.Producto;
import cl.duoc.demo.repository.ProductoRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProductoService {
    private final ProductoRepository repo;
    public ProductoService(ProductoRepository repo) { this.repo = repo; }

    @Transactional(readOnly = true)
    public List<Producto> listar() { return repo.findAll(); }

    @Transactional(readOnly = true)
    public Producto buscar(Long id) {
        return repo.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
    }

    private void validar(Producto datos) {
        if (datos == null || datos.getNombre() == null || datos.getNombre().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nombre obligatorio");
        }
        if (!Double.isFinite(datos.getPrecio()) || datos.getPrecio() < 0 || datos.getStock() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Precio y stock no pueden ser negativos");
        }
    }

    @Transactional
    public Producto crear(Producto datos) {
        validar(datos);
        datos.setId(null); // Nunca aceptar un ID arbitrario enviado por React.
        datos.setNombre(datos.getNombre().trim());
        return repo.save(datos);
    }

    @Transactional
    public Producto editar(Long id, Producto datos) {
        validar(datos);
        Producto actual = buscar(id);
        actual.setNombre(datos.getNombre().trim());
        actual.setDescripcion(datos.getDescripcion());
        actual.setPrecio(datos.getPrecio());
        actual.setImagen(datos.getImagen());
        actual.setStock(datos.getStock());
        return repo.save(actual);
    }

    @Transactional
    public void eliminar(Long id) {
        Producto actual = buscar(id);
        repo.delete(actual);
    }
}
