package tech.buildrun.springPonto.controller.dto;

import java.util.List;
import java.util.UUID;

public class UserProfileResponse {

    private UUID userId;
    private String username;
    private String email;
    private List<String> roles;
    private String cargaHoraria;
    private String cargo;
    private String imagePath;

    public UserProfileResponse(UUID userId, String username, String email, List<String> roles, String cargaHoraria, String cargo, String imagePath) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.roles = roles;
        this.cargaHoraria = cargaHoraria;
        this.cargo = cargo;
        this.imagePath = imagePath;
    }

    // Getters e Setters

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public String getCargaHoraria() {
        return cargaHoraria;
    }

    public void setCargaHoraria(String cargaHoraria) {
        this.cargaHoraria = cargaHoraria;
    }

    public String getCargo() {
        return cargo;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
    }

    public String getImagePath() {
        return imagePath;
    }
    
}
