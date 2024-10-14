package tech.buildrun.springPonto.services;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tech.buildrun.springPonto.Entities.HitPoint;
import tech.buildrun.springPonto.Entities.User;
import tech.buildrun.springPonto.Repository.HitPointRepository;
import tech.buildrun.springPonto.Repository.UserRepository;

/**
 * HitPointService
 */
@Service
public class HitPointService {

    @Autowired // ele injeta uma instacia automatica de HitPointRepository no -
               // HitPointRepository assim que a classe for montada
    private HitPointRepository hitPointRepository;

    @Autowired
    private UserRepository userRepository;

    public HitPoint baterPonto(UUID userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User usuario = userOptional.get();

            // caso exista o usuario ele vai criar a instacia do ponto

           

            HitPoint hitPoint = new HitPoint();
            hitPoint.setUser(usuario);

          
     

            return hitPointRepository.save(hitPoint);
        } else {
            throw new RuntimeException("Usuário não encontrado.");
        }
    }

}