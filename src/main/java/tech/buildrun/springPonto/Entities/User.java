package tech.buildrun.springPonto.Entities;

import java.util.Set;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.JoinTable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.CascadeType; // Import necessário para CascadeType
import jakarta.persistence.FetchType;

@Entity
@Table(name = "tb_users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO) // Mudei para AUTO; o suporte a UUID depende da configuração do
                                                    // banco de dados
    @Column(name = "user_id", updatable = false, nullable = false)
    private UUID userId;

    @Column(name = "user_name", unique = true, nullable = false) // Adicionei nullable = false para garantir que não
                                                                 // seja nulo
    private String userName;

    @Column(name = "pass_word", nullable = false) // Adicionei nullable = false para garantir que não seja nulo
    private String passWord;

    // Este Set é semelhante a uma lista, mas não permite dados duplicados.
    // Relação muitos para muitos: um usuário pode ter várias funções (roles) e uma
    // função pode pertencer a vários usuários.
    // Quando ocorre esse tipo de relação, é necessário criar uma tabela
    // intermediária para armazenar as chaves.
    // FetchType.EAGER: Quando você define o fetch como EAGER, isso significa que as
    // entidades relacionadas (neste caso, as roles) serão carregadas
    // automaticamente junto com a entidade User
    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinTable(name = "tb_users_role", joinColumns = @JoinColumn(name = "user_id"), // Chave estrangeira para o usuário
                                                                                    // na tabela intermediária
            inverseJoinColumns = @JoinColumn(name = "role_id")// Chave estrangeira para a função na tabela intermediária
    )
    private Set<Role> roles;

    // Getters e Setters
    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassWord() {
        return passWord;
    }

    public void setPassWord(String passWord) {
        this.passWord = passWord;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }
}
