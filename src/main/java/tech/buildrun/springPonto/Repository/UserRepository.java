package tech.buildrun.springPonto.Repository;

import java.util.UUID;
import org.springframework.stereotype.Repository;


import org.springframework.data.jpa.repository.JpaRepository; // Importando a interface JpaRepository
import tech.buildrun.springPonto.Entities.Role; // Importando a entidade Role

@Repository
public interface UserRepository extends JpaRepository<Role, UUID> { // Especificando a entidade e o tipo da chave primária
    // Você pode adicionar métodos adicionais de consulta aqui, se necessário
}

