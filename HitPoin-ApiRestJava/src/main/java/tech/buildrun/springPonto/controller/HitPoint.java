package tech.buildrun.springPonto.controller;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import tech.buildrun.springPonto.Entities.User;
import tech.buildrun.springPonto.Repository.HitPointRepository;
import tech.buildrun.springPonto.Repository.UserRepository;
import tech.buildrun.springPonto.controller.dto.RequestGetPostForDay;
import tech.buildrun.springPonto.controller.dto.RequestGetPostForDayUserRequest;

import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/Pontos")
public class HitPoint {

    private HitPointRepository hitPointRepository;
    private UserRepository userRepository;

    public HitPoint(HitPointRepository hitPointRepository, UserRepository userRepository) {
        this.hitPointRepository = hitPointRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/AllPoints")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<List<tech.buildrun.springPonto.Entities.HitPoint>> ListUsers() {

        var allPoints = hitPointRepository.findAll();

        return ResponseEntity.ok(allPoints);

    }

    @PostMapping("/GetPostForDayUser")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<RequestGetPostForDay> getPointsByDayAndMonthAndIdUser(
            @RequestBody RequestGetPostForDayUserRequest request) { // Classe para encapsular a requisição

        try {
            String id = request.getId();
            Integer dia = request.getDia();
            Integer mes = request.getMes();
            Integer ano = request.getAno();

            System.out.println("id : " + id);

            UUID userId = UUID.fromString(id);

            System.out.println("user id convertido : " + userId);

            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

            if (user.geHitPoints() == null || user.geHitPoints().isEmpty()) {
                return new ResponseEntity<>(
                        new RequestGetPostForDay(List.of(),
                                "O usuário com ID " + userId + " não possui pontos registrados."),
                        HttpStatus.OK);
            }

            var filterPoint = user.geHitPoints().stream()
                    .filter(ponto -> ponto.getDia() == dia && ponto.getMes() == mes && ponto.getAno() == ano)
                    .collect(Collectors.toList());

            return new ResponseEntity<>(
                    new RequestGetPostForDay(filterPoint, "Pontos filtrados com sucesso."),
                    HttpStatus.OK);

        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(
                    new RequestGetPostForDay(List.of(), "Erro ao converter o ID para UUID: " + e.getMessage()),
                    HttpStatus.BAD_REQUEST);

        } catch (RuntimeException e) {
            return new ResponseEntity<>(
                    new RequestGetPostForDay(List.of(), "Falha ao buscar ponto: " + e.getMessage()),
                    HttpStatus.NOT_FOUND);
        } catch (Exception e) {

            return new ResponseEntity<>(
                    new RequestGetPostForDay(List.of(), "Erro inesperado: " + e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
