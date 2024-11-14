package tech.buildrun.springPonto.Entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private Long roleId;

    private String name;

    // Getters e Setters
    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // Enum para os valores de função
    public enum Values {
        BASIC(1L),
        ADMIN(2L);

        Long roleId;

        // Construtor do Enum
        Values(Long roleId) {
            this.roleId = roleId;
        }

        // Método para obter o roleId
        public Long getRoleId() {
            return roleId; // Adicionado ponto e vírgula
        }
    }
}
