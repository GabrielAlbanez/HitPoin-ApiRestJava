package tech.buildrun.springPonto.Entities;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.hibernate.annotations.Cascade;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import tech.buildrun.springPonto.controller.dto.LoginRequest;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.JoinTable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.CascadeType; // Import necessário para CascadeType
import jakarta.persistence.FetchType;

@Entity
@Table(name = "tb_users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "user_id")
    private UUID userId;

    @Column(unique = true)
    private String username;

    @Column(unique = true, name = "email")
    private String email;

    private String password;

    @Column(name = "image")
    private String imagePath;

    @Column(name = "cargo_user")
    private String cargo;

    @Column(name = "carga_horaria")
    private String cargaHoraria;

    // Este Set é semelhante a uma lista, mas não permite dados duplicados.
    // Relação muitos para muitos: um usuário pode ter várias funções (roles) e uma
    // função pode pertencer a vários usuários.
    // Quando ocorre esse tipo de relação, é necessário criar uma tabela
    // intermediária para armazenar as chaves.
    // FetchType.EAGER: Quando você define o fetch como EAGER, isso significa que as
    // entidades relacionadas (neste caso, as roles) serão carregadas
    // automaticamente junto com a entidade User
    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(name = "tb_users_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles;

    @JsonManagedReference
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @Column(name = "pontos")
    private List<HitPoint> pontos;

    public String getCargaHoraria() {
        return cargaHoraria;
    }

    public void setCargaHoraria(String cargaHoraria) {
        this.cargaHoraria = cargaHoraria;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
    }

    public String getCargo() {
        return cargo;
    }

    // Getters e Setters
    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return username;
    }

    public void setUserName(String userName) {
        this.username = userName;
    }

    public String getPassWord() {
        return password;
    }

    public void setPassWord(String passWord) {
        this.password = passWord;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public boolean isLoginCorrect(LoginRequest loginRequest, PasswordEncoder passwordEncoder) {

        return passwordEncoder.matches(loginRequest.password(), this.password);

    }

    public void setListPoint(List<HitPoint> listDePontos) {
        this.pontos = listDePontos;
    }

    public List<HitPoint> geHitPoints() {
        return pontos;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getImagePath() {
        return imagePath;
    }
    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }
}
