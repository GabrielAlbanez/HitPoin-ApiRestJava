package tech.buildrun.springPonto.controller;

import java.time.Instant;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.RestController;

import tech.buildrun.springPonto.Entities.Role;
import tech.buildrun.springPonto.Repository.UserRepository;
import tech.buildrun.springPonto.controller.dto.LoginRequest;
import tech.buildrun.springPonto.controller.dto.LoginResponse;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
public class TokenController {

    private JwtEncoder jwtEncoder;

    private UserRepository userRepository;

    private BCryptPasswordEncoder bCryptPasswordEncoder;

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
            // Retorna mensagem amigável se o usuário ou a senha estiverem incorretos
            return ResponseEntity
                    .status(401) // Código de status para Unauthorized
                    .body(new LoginResponse(null, 0, "Usuário ou senha inválidos"));
        }

        var now = Instant.now();
        // Tempo de duração do token
        var expiressIn = 3000;

        var scopes = user.get().getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.joining(" ")); // Adiciona espaço entre os scopes

        // Essa var vai determinar os atributos do JWT
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
}
