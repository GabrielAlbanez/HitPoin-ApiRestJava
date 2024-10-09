package tech.buildrun.springPonto.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

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

}
