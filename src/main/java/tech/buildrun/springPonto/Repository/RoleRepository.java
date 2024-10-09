package tech.buildrun.springPonto.Repository;

import org.springframework.data.jpa.repository.JpaRepository; // Importando a interface JpaRepository
import tech.buildrun.springPonto.Entities.Role; // Importando a entidade Role
import org.springframework.stereotype.Repository;


@Repository
public interface RoleRepository extends JpaRepository<Role, Long> { // Especificando a entidade e o tipo da chave primária
    // Você pode adicionar métodos adicionais de consulta aqui, se necessário
}
