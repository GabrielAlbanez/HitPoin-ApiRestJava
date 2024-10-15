package tech.buildrun.springPonto.services;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tech.buildrun.springPonto.Entities.HitPoint;
import tech.buildrun.springPonto.Entities.User;
import tech.buildrun.springPonto.Repository.HitPointRepository;
import tech.buildrun.springPonto.Repository.UserRepository;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

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

    public HitPoint baterPonto(String dataPonto, UUID userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User usuario = userOptional.get();

            System.out.println("tipo ponto: " + dataPonto);

            LocalDateTime dataAtual = LocalDateTime.now();


            int dia = dataAtual.getDayOfMonth();

            int mes = dataAtual.getMonthValue(); // 1 a 12
            int ano = dataAtual.getYear(); // ano atual

            DateTimeFormatter formato = DateTimeFormatter.ofPattern("HH:mm:ss");
            String horaFormatada = dataAtual.format(formato);

            HitPoint hitPoint = new HitPoint();
            hitPoint.setTipo(dataPonto);
            hitPoint.setUser(usuario);
            hitPoint.setHora(horaFormatada);
            hitPoint.setDia(dia);
            hitPoint.setMes(mes);
            hitPoint.setAno(ano);

            return hitPointRepository.save(hitPoint);
        } else {
            throw new RuntimeException("Usuário não encontrado.");
        }
    }

}