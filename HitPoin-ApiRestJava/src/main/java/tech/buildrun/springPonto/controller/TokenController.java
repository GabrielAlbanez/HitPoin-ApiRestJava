package tech.buildrun.springPonto.controller;

import java.time.Instant;
import java.util.stream.Collectors;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import tech.buildrun.springPonto.Entities.User;
import tech.buildrun.springPonto.Entities.Role;
import tech.buildrun.springPonto.Repository.UserRepository;
import tech.buildrun.springPonto.controller.dto.LoginRequest;
import tech.buildrun.springPonto.controller.dto.LoginResponse;
import tech.buildrun.springPonto.controller.dto.UserProfileResponse;

@RestController
@RequestMapping("/auth")
public class TokenController {

    private final JwtEncoder jwtEncoder;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public TokenController(JwtEncoder jwtEncoder,
                           UserRepository userRepository,
                           BCryptPasswordEncoder passwordEncoder) {
        this.jwtEncoder = jwtEncoder;
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = passwordEncoder;
    }

    @PostMapping("/Login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest login) {

        System.out.println("email req :  " + login.email());

        var user = userRepository.findByEmail(login.email());

        System.out.println("usuario :  " + user);

        // Verifica se o usuário existe e se a senha está correta
        if (user.isEmpty() || !user.get().isLoginCorrect(login, bCryptPasswordEncoder)) {
            return ResponseEntity
                    .status(401)
                    .body(new LoginResponse(null, 0, "Usuário ou senha inválidos"));
        }

        var now = Instant.now();
        var expiressIn = 30000; // Duração do token

        var scopes = user.get().getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.joining(" "));

        var claims = JwtClaimsSet.builder()
                .subject(user.get().getUserId().toString())
                .issuer("token gerado pelo backEnd")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(expiressIn))
                .claim("scope", scopes)
                .build();

        var jwt = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

        return ResponseEntity.ok(new LoginResponse(jwt, expiressIn, "Login realizado com sucesso"));
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getUserProfile(Authentication authentication) {
        String userId = authentication.getName(); // O ID do usuário extraído do token
        User user = userRepository.findByUserId(UUID.fromString(userId))
                                  .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Prepara a resposta com as informações do usuário
        UserProfileResponse userProfile = new UserProfileResponse(
                user.getUserId(),
                user.getUserName(),
                user.getEmail(),
                user.getRoles().stream().map(Role::getName).collect(Collectors.toList()),
                user.getCargaHoraria(),
                user.getCargo(),
                user.getImagePath()
        );

        return ResponseEntity.ok(userProfile);
    }
}
