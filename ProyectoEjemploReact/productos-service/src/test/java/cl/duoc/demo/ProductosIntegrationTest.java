package cl.duoc.demo;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import cl.duoc.demo.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:h2:mem:productos_test;DB_CLOSE_DELAY=-1",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
@AutoConfigureMockMvc
class ProductosIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired JwtService jwt;

    @Test
    void listarEsPublicoPeroCrearRequiereJwtAdmin() throws Exception {
        mvc.perform(get("/api/productos")).andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nombre").exists());
        String producto = "{\"nombre\":\"SSD\",\"precio\":25000,\"stock\":2}";
        mvc.perform(post("/api/productos").contentType(MediaType.APPLICATION_JSON)
                .content(producto)).andExpect(status().isUnauthorized());
        String token = jwt.generar("admin@duoc.cl", "ADMIN");
        mvc.perform(post("/api/productos").header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON).content(producto))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.nombre").value("SSD"));
    }
}
