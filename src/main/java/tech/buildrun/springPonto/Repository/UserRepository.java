package tech.buildrun.springPonto.Repository;

import java.util.UUID;
import org.springframework.stereotype.Repository;

import tech.buildrun.springPonto.Entities.User;

import org.springframework.data.jpa.repository.JpaRepository; // Importando a interface JpaRepository

@Repository
public interface UserRepository extends JpaRepository<User, UUID> { // Especificando a entidade e o tipo da chave primária
    // Você pode adicionar métodos adicionais de consulta aqui, se necessário
}

