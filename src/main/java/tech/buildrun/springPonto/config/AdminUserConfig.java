package tech.buildrun.springPonto.config;

import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import jakarta.transaction.Transactional;
import tech.buildrun.springPonto.Entities.Role;
import tech.buildrun.springPonto.Entities.User;
import tech.buildrun.springPonto.Repository.RoleRepository;
import tech.buildrun.springPonto.Repository.UserRepository;

@Configuration
public class AdminUserConfig implements CommandLineRunner {

    private RoleRepository roleRepository;
    private UserRepository userRepository;
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public AdminUserConfig(UserRepository userRepository, RoleRepository roleRepository,
            BCryptPasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {

        var roleAdmin = roleRepository.findByName(Role.Values.ADMIN.name());

        System.out.println("role" + roleAdmin);

        var userAdmin = userRepository.findAllByUsername("admin");

        userAdmin.ifPresentOrElse(
                user  -> {
                    System.out.println("este usuário já existe");
                },

                () -> {
                    var user = new User();
                    user.setUserName("admin");
                    user.setPassWord(bCryptPasswordEncoder.encode("123")); // Passe a senha a ser codificada
                    user.setRoles(Set.of(roleAdmin));
                    userRepository.save(user);

                });

        throw new UnsupportedOperationException("Unimplemented method 'run'");
    }

}
