package tech.buildrun.springPonto.controller;

import org.springframework.web.bind.annotation.RestController;

import jakarta.persistence.metamodel.SetAttribute;
import jakarta.transaction.Transactional;
import tech.buildrun.springPonto.Entities.Role;
import tech.buildrun.springPonto.Entities.User;
import tech.buildrun.springPonto.Repository.RoleRepository;
import tech.buildrun.springPonto.Repository.UserRepository;
import tech.buildrun.springPonto.controller.dto.CreateUser;
import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/usuarios")
public class UserController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    // tem que fazer esse construtor para passar o repoitory do jpa e iguala o
    // atributo da classe para a gente poder usar os metodos aq
    public UserController(UserRepository userRepository, RoleRepository roleRepository,
            BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @Transactional
    @PostMapping("/CreateUser")
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

}
