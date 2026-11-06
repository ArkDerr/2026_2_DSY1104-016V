package cl.duoc.demo.config;

import cl.duoc.demo.model.Producto;
import cl.duoc.demo.repository.ProductoRepository;
import java.sql.Connection;
import javax.sql.DataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DatosInicialesConfig {
    private static final Logger log = LoggerFactory.getLogger(DatosInicialesConfig.class);

    @Bean
    CommandLineRunner cargarProductosIniciales(ProductoRepository repositorio,
            DataSource dataSource, @Value("${app.seed.enabled:true}") boolean habilitado) {
        return args -> {
            try (Connection conexion = dataSource.getConnection()) {
                log.info("Base de datos H2 en uso: {}", conexion.getMetaData().getURL());
            }
            // Se cargan ejemplos solo en una tabla vacia: no se duplican al reiniciar.
            if (!habilitado || repositorio.count() != 0) return;
            repositorio.save(crear("Teclado Gamer", "Teclado mecanico para escritorio", 39990, 12));
            repositorio.save(crear("Mouse Gamer", "Mouse optico para videojuegos", 24990, 20));
            repositorio.save(crear("Audifonos Gamer", "Audifonos con microfono", 49990, 8));
            repositorio.save(crear("Monitor 24 pulgadas", "Monitor Full HD de ejemplo", 129990, 6));
            repositorio.save(crear("Webcam HD", "Camara para videollamadas", 29990, 15));
            log.info("Productos iniciales cargados: {}", repositorio.count());
        };
    }

    private Producto crear(String nombre, String descripcion, double precio, int stock) {
        Producto p = new Producto();
        p.setNombre(nombre);
        p.setDescripcion(descripcion);
        p.setPrecio(precio);
        p.setStock(stock);
        p.setImagen("");
        return p;
    }
}
