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
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
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

    // esse value e para injetar valores dentro desses atributos
    // os valores injetados vao ser as chaves criadas pelo openssl guardados nos
    // arquivos
    // a gente usa essa chave para criptografa o tojen jwt
    // {jwt.public.key} - referencia la no application propietyes - e de la agente
    // passa path name das pastas com as chaves

    @Value("${jwt.public.key}")
    private RSAPublicKey publicKey;
    @Value("${jwt.private.key}")
    private RSAPrivateKey privatKey;

    @Bean
    private SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // esse http vai ser o parametro responsavel por controla toda a parte de
        // segurança do projeto
        // todas as requizoes precisam ser autenticadas para serem realizadas
        http

                .authorizeHttpRequests(authorize -> authorize.anyRequest().authenticated())
                // .csrf(csrf -> csrf.disable())
                // desativar caso der erro para fazer req
                .oauth2ResourceServer(oAuth2 -> oAuth2.jwt(Customizer.withDefaults()))
                // esse sessionManagement -Usar SessionCreationPolicy.STATELESS é uma abordagem
                // moderna para autenticação em aplicações web, especialmente para APIs RESTful.
                // Essa configuração força o cliente a enviar informações de autenticação (como
                // tokens) com cada requisição, permitindo que o servidor permaneça sem estado e
                // escalável.
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        return http.build();
    }

    @Bean
    //faz a descripografia do jew quando chega na req
    public JwtDecoder jwtdecoder() {
        return(NimbusJwtDecoder.withPublicKey(publicKey).build());
    }

    @Bean
    public JwtEncoder jwtEncoder() {
        JWK jwk = new RSAKey.Builder(this.publicKey).privateKey(this.privatKey).build();
        var jwks = new ImmutableJWKSet<>(new JWKSet(jwk));
        return new NimbusJwtEncoder(jwks);
    }

}
