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

    private LoginRequest loginRequest;

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


        if (user.isEmpty() || !user.get().isLoginCorrect(login, bCryptPasswordEncoder)) {
            throw new BadCredentialsException("user or passowrd is invalid");
        }

        var now = Instant.now();
        // tepo de duração do token
        var expiressIn = 3000;

        var scopes = user.get().getRoles().stream().map(Role::getName).collect(Collectors.joining(""));

        // essa var vai determina os atributos do jwt
        var claims = JwtClaimsSet.builder()
                .subject(user.get().getUserId().toString())
                .issuer("token gerado pelo bakcEnd")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(expiressIn))
                .claim("scope",scopes)
                .build();
                

        var jwt = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

        return ResponseEntity.ok(new LoginResponse(jwt, expiressIn, "Login realizado com sucesso"));

    }

}
