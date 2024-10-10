package tech.buildrun.springPonto.config;

import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.web.SecurityFilterChain;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // Injeção das chaves RSA públicas e privadas, usadas para criptografar
    // e descriptografar o token JWT. As chaves são carregadas a partir
    // dos arquivos definidos nas propriedades da aplicação.
    @Value("${jwt.public.key}")
    private RSAPublicKey publicKey;
    
    @Value("${jwt.private.key}")
    private RSAPrivateKey privateKey;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // Configurações de segurança para todas as requisições
        http
            // Exige autenticação para qualquer requisição
            .authorizeHttpRequests(authorize -> authorize
            // esse request Matchers server para deixar essa rota publica
            //pq depois que vc implmenta o secury spring ele bloqueia todas as rotas
            .requestMatchers(HttpMethod.POST, "/Login").permitAll()
            .anyRequest().authenticated())
            
            // Configura OAuth2 para usar JWT como forma de autenticação
            .oauth2ResourceServer(oAuth2 -> oAuth2.jwt(Customizer.withDefaults()))
            
            // Define o gerenciamento de sessão como 'stateless', adequado para APIs REST
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

        // Caso necessário, desative CSRF para permitir requisições sem verificação
        // (útil para APIs que não utilizam cookies, como APIs RESTful)
        .csrf(csrf -> csrf.disable());
        
        return http.build();
    }

    @Bean
    // Este Bean é responsável por descriptografar o token JWT usando a chave pública.
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withPublicKey(publicKey).build();
    }

    @Bean
    // Este Bean cria o codificador de JWT usando as chaves RSA.
    public JwtEncoder jwtEncoder() {
        JWK jwk = new RSAKey.Builder(this.publicKey).privateKey(this.privateKey).build();
        var jwks = new ImmutableJWKSet<>(new JWKSet(jwk));
        return new NimbusJwtEncoder(jwks);
    }

    @Bean
    // Bean para criptografar senhas usando BCrypt.
    public BCryptPasswordEncoder bcryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
