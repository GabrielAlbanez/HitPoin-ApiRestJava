package tech.buildrun.springPonto.Entities;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;

@Entity
public class PasswordResetToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private User user;

    private String token;
    
    @CreationTimestamp
    private LocalDateTime createdAt; // Data de criação do token

    private LocalDateTime expirationDate; // Data de expiração do token

    // Construtores, getters e setters

    public PasswordResetToken() {}

    public PasswordResetToken(User user, String token) {
        this.user = user;
        this.token = token;
        this.createdAt = LocalDateTime.now(); // Define a data de criação manualmente
        this.expirationDate = createdAt.plus(1, ChronoUnit.HOURS); // Define a expiração em 1 hora
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getExpirationDate() {
        return expirationDate;
    }

    public Long getId() {
        return id;
    }

    public String getToken() {
        return token;
    }

    public User getUser() {
        return user;
    }

    public void setExpirationDate(LocalDateTime expirationDate) {
        this.expirationDate = expirationDate;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // Método para verificar se o token está expirado
    public boolean isExpired() {
        if (expirationDate == null) {
            throw new IllegalStateException("Data de expiração não está definida para o token.");
        }
        return LocalDateTime.now().isAfter(expirationDate);
    }
}
