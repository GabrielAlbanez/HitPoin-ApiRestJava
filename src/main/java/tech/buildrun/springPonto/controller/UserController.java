package tech.buildrun.springPonto.controller;

import org.springframework.web.bind.annotation.RestController;

import jakarta.persistence.metamodel.SetAttribute;
import jakarta.transaction.Transactional;
import tech.buildrun.springPonto.Entities.HitPoint;
import tech.buildrun.springPonto.Entities.Role;
import tech.buildrun.springPonto.Entities.User;
import tech.buildrun.springPonto.Repository.RoleRepository;
import tech.buildrun.springPonto.Repository.UserRepository;
import tech.buildrun.springPonto.controller.dto.CreateUser;
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
import org.springframework.web.bind.annotation.RequestParam;

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
    public ResponseEntity<String> createUser(@RequestBody CreateUser dataUser) {

        var basicRole = roleRepository.findByName(Role.Values.BASIC.name());

        var existingUser = userRepository.findAllByUsername(dataUser.username());

        if (existingUser.isPresent()) {
            return ResponseEntity.ok("Ja temos usuarios logados com esse nome");
        }

        var user = new User();
        user.setUserName(dataUser.username());
        user.setPassWord(bCryptPasswordEncoder.encode(dataUser.password()));
        user.setRoles(Set.of(basicRole));
        userRepository.save(user);

        return ResponseEntity.ok("usuario criado com sucesso");
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
    public ResponseEntity<HitPoint> baterPonto(Authentication authentication) {
        // Recupera o nome de usuário a partir da autenticação
        System.out.println("Autenticação: " + authentication);
        System.out.println("Nome pego: " + authentication.getName());
        String idUser = authentication.getName();
        UUID userId = UUID.fromString(idUser);

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        // Bate o ponto

        HitPoint hitPoint = hitPointService.baterPonto(user.getUserId());

        return ResponseEntity.ok(hitPoint);
    }

}
