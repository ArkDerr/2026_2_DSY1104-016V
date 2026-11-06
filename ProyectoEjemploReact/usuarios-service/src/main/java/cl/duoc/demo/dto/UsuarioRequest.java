package cl.duoc.demo.dto;

// Contrato JSON: nombre, email, password y rol (identico al proyecto anterior).
public record UsuarioRequest(String nombre, String email, String password, String rol) { }
