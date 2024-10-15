package tech.buildrun.springPonto.controller;

import org.springframework.web.bind.annotation.RestController;

import jakarta.transaction.Transactional;
import tech.buildrun.springPonto.Entities.HitPoint;
import tech.buildrun.springPonto.Entities.Role;
import tech.buildrun.springPonto.Entities.User;
import tech.buildrun.springPonto.Repository.RoleRepository;
import tech.buildrun.springPonto.Repository.UserRepository;
import tech.buildrun.springPonto.controller.dto.CreateUser;
import tech.buildrun.springPonto.controller.dto.HitPointRequest;
import tech.buildrun.springPonto.controller.dto.RequestCreateUser;
import tech.buildrun.springPonto.controller.dto.RequestGetUser;
import tech.buildrun.springPonto.controller.dto.RequestHitPoint;
import tech.buildrun.springPonto.services.HitPointService;

import java.util.Set;
import java.util.UUID;
import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/usuarios")
public class UserController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final HitPointService hitPointService;

    // tem que fazer esse construtor para passar o repoitory do jpa e iguala o
    // atributo da classe para a gente poder usar os metodos aq
    public UserController(UserRepository userRepository, RoleRepository roleRepository,
            BCryptPasswordEncoder bCryptPasswordEncoder, HitPointService hitPointService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.hitPointService = hitPointService;

    }

    @Transactional
    @PostMapping("/CreateUser")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<RequestCreateUser> createUser(@RequestBody CreateUser dataUser) {

        var basicRole = roleRepository.findByName(Role.Values.BASIC.name());

        var existingUserWithUsername = userRepository.findAllByUsername(dataUser.username());

        var existingUserWithEmmail = userRepository.findByEmail(dataUser.email());

        var cargHoraria = dataUser.cargaHoraria();

        var cargo = dataUser.cargo();

        if (existingUserWithUsername.isPresent()) {
            return ResponseEntity
                    .ok(new RequestCreateUser(Optional.empty(), "Ja temos usuarios logados com esse nome"));
        }

        if (existingUserWithEmmail.isPresent()) {
            return ResponseEntity
                    .ok(new RequestCreateUser(Optional.empty(), "Ja temos usuarios logados com esse email"));
        }

        var user = new User();
        user.setUserName(dataUser.username());
        user.setPassWord(bCryptPasswordEncoder.encode(dataUser.password()));
        user.setRoles(Set.of(basicRole));
        user.setEmail(dataUser.email());
        user.setCargaHoraria(cargHoraria);
        user.setCargo(cargo);
        userRepository.save(user);

        Optional<User> useradata = Optional.ofNullable(user);

        return ResponseEntity.ok(new RequestCreateUser(useradata, "usuario criado com sucesso"));
    }

    @GetMapping("/allUsers")
    // protege a rota, so usuario admin pode acessar
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<List<User>> ListUsers() {

        var alluser = userRepository.findAllWithPoints();

        return ResponseEntity.ok(alluser);

    }

    @Transactional
    @PostMapping("/HitPoint")
    public ResponseEntity<RequestHitPoint> baterPonto(@RequestBody HitPointRequest dataPonto,
            Authentication authentication) {
        // Recupera o nome de usuário a partir da autenticação
        System.out.println("Autenticação: " + authentication);
        System.out.println("Nome pego: " + authentication.getName());
        String idUser = authentication.getName();
        UUID userId = UUID.fromString(idUser);

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        // Bate o ponto

        String pontoName = dataPonto.tipoPonto();

        HitPoint hitPoint = hitPointService.baterPonto(pontoName, user.getUserId());

        return ResponseEntity.ok(new RequestHitPoint(hitPoint, "ponto batido com sucesso"));
    }

    @Transactional
    @PostMapping("/getUser")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<Optional<User>> ListUserByid(@RequestBody RequestGetUser data) {

        var user = userRepository.findById(data.id());
        System.out.println("Usuário encontrado: " + user);

        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(user);
    }

}
