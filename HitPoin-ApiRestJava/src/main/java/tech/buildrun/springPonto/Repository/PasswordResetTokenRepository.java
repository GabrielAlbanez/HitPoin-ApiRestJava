package tech.buildrun.springPonto.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import tech.buildrun.springPonto.Entities.PasswordResetToken;
import tech.buildrun.springPonto.Entities.User;
import java.util.List;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(String token);

    Optional<PasswordResetToken> findByUser(User user);

}
