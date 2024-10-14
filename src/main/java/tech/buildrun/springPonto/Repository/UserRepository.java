package tech.buildrun.springPonto.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Repository;

import tech.buildrun.springPonto.Entities.User;

import org.springframework.data.jpa.repository.JpaRepository; // Importando a interface JpaRepository
// import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> { // Especificando a entidade e o tipo da chave
                                                                    // primária
    // Você pode adicionar métodos adicionais de consulta aqui, se necessário

    Optional<User> findAllByUsername(String username);

    Optional<User> findByUserId(UUID userId);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.pontos WHERE u.userId = :userId")
    Optional<User> findUserWithPoints(@Param("userId") UUID userId);

    // Método para encontrar todos os usuários com seus pontos
    @Query("SELECT u FROM User u FULL JOIN FETCH u.pontos")
    List<User> findAllWithPoints();

}
