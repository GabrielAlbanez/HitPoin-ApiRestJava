package tech.buildrun.springPonto.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.transaction.Transactional;
import tech.buildrun.springPonto.Entities.HitPoint;
import tech.buildrun.springPonto.Entities.PasswordResetToken;
import tech.buildrun.springPonto.Entities.Role;
import tech.buildrun.springPonto.Entities.User;
import tech.buildrun.springPonto.Repository.PasswordResetTokenRepository;
import tech.buildrun.springPonto.Repository.RoleRepository;
import tech.buildrun.springPonto.Repository.UserRepository;
import tech.buildrun.springPonto.controller.dto.CreateUser;
import tech.buildrun.springPonto.controller.dto.ForgotPasswordRequest;
import tech.buildrun.springPonto.controller.dto.HitPointRequest;
import tech.buildrun.springPonto.controller.dto.RequestCreateUser;
import tech.buildrun.springPonto.controller.dto.RequestGetUser;
import tech.buildrun.springPonto.controller.dto.RequestHitPoint;
import tech.buildrun.springPonto.controller.dto.ResetPasswordRequest;
import tech.buildrun.springPonto.services.EmailService;
import tech.buildrun.springPonto.services.HitPointService;

import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.stream.Collectors;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/usuarios")
public class UserController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final HitPointService hitPointService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;
    @Value("${upload.directory}")
    private String uploadDirectory;
    private ConcurrentHashMap<String, String> connectedUsers = new ConcurrentHashMap<>();

    // tem que fazer esse construtor para passar o repoitory do jpa e iguala o
    // atributo da classe para a gente poder usar os metodos aq
    public UserController(UserRepository userRepository, RoleRepository roleRepository,
            BCryptPasswordEncoder bCryptPasswordEncoder, HitPointService hitPointService,
            PasswordResetTokenRepository passwordResetTokenRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.hitPointService = hitPointService;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.emailService = emailService;

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

    @Transactional
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        String email = request.getEmail();

        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com este e-mail"));

            Optional<User> userExisting = userRepository.findByEmail(email);

            if (userExisting.isEmpty()) {
                return ResponseEntity.ok("endereço de e-mail invalido");
            }

            // Verifica se já existe um token de redefinição de senha para o usuário
            Optional<PasswordResetToken> existingToken = passwordResetTokenRepository.findByUser(user);

            if (existingToken.isPresent()) {
                // Se já existe um token, retorna uma mensagem informando que o e-mail já foi
                // enviado
                return ResponseEntity.status(HttpStatus.OK)
                        .body("Um link de redefinição de senha já foi enviado para este e-mail.");
            }

            // Gera um novo token de redefinição de senha
            String token = UUID.randomUUID().toString();

            PasswordResetToken passwordResetToken = new PasswordResetToken();
            passwordResetToken.setUser(user);
            passwordResetToken.setToken(token);

            // Armazena o novo token associado ao usuário
            passwordResetTokenRepository.save(passwordResetToken);

            // Envia e-mail com o link de redefinição
            String resetLink = "http://localhost:3000/Password/Reset?token=" + token;
            emailService.sendEmail(user.getEmail(), "Redefinição de Senha",
                    "Clique no link para redefinir sua senha: " + resetLink);

            return ResponseEntity.ok("Link de redefinição de senha enviado para o e-mail: " + email);

        } catch (UsernameNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Usuário não encontrado com este e-mail");
        }
    }

    @Transactional
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        String token = request.getToken();
        String newPassword = request.getNewPassword();

        try {
            PasswordResetToken passwordResetToken = passwordResetTokenRepository.findByToken(token)
                    .orElseThrow(() -> new RuntimeException("Token inválido ou não encontrado."));

            // try {
            // // Verifica se o token está expirado
            // if (passwordResetToken.isExpired()) {
            // return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            // .body("Token expirado. Por favor, solicite um novo link de redefinição de
            // senha.");
            // }
            // } catch (IllegalStateException e) {
            // // Caso o expirationDate seja nulo
            // return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            // .body("Erro interno: Data de expiração do token não definida.");
            // }

            // Atualizar a senha do usuário
            User user = passwordResetToken.getUser();
            user.setPassWord(bCryptPasswordEncoder.encode(newPassword));
            userRepository.save(user);

            // Remover o token após a redefinição de senha
            passwordResetTokenRepository.delete(passwordResetToken);

            return ResponseEntity.ok("Senha redefinida com sucesso.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erro: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ocorreu um erro inesperado. Por favor, tente novamente.");
        }
    }

    @Transactional
    @DeleteMapping("/deleteUser/{id}")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable UUID id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com o ID: " + id));

        user.getRoles().clear(); // Limpa as roles do usuário

        userRepository.deleteById(id);

        return ResponseEntity.ok("usuario Deleteado com sucesso");
    }

    @Transactional
    @PostMapping("/imageUpload")
    public ResponseEntity<?> uploadUserImage(@RequestParam("file") MultipartFile file, Authentication authentication) {
        String idUser = authentication.getName();
        UUID userId = UUID.fromString(idUser);

        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path projectDir = Paths.get(System.getProperty("user.dir"), "HitPoint", uploadDirectory);
        Path filePath = projectDir.resolve(filename);

        try {
            // Garante que o diretório exista
            if (!Files.exists(projectDir)) {
                Files.createDirectories(projectDir);
            }

            // Salva o arquivo no diretório especificado
            file.transferTo(filePath.toFile());

            // Atualiza o caminho da imagem no banco de dados
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                user.setImagePath("uploads/images/" + filename);
                userRepository.save(user);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado");
            }

            // Limpeza de imagens não utilizadas
            cleanupUnusedImages();

            // Retorna o caminho da imagem e uma mensagem de sucesso
            return ResponseEntity.ok(Map.of(
                    "message", "Imagem enviada com sucesso!",
                    "imagePath", "uploads/images/" + filename));

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao salvar a imagem");
        }
    }

    // Método para limpeza de imagens não utilizadas
    private void cleanupUnusedImages() {
        Path projectDir = Paths.get(System.getProperty("user.dir"), "HitPoint", uploadDirectory);

        // Recupera os caminhos das imagens que estão sendo utilizadas no banco de dados
        List<String> usedImagePaths = userRepository.findAll().stream()
                .map(User::getImagePath)
                .filter(path -> path != null && !path.isEmpty())
                .collect(Collectors.toList());

        try (DirectoryStream<Path> directoryStream = Files.newDirectoryStream(projectDir)) {
            for (Path filePath : directoryStream) {
                String relativePath = projectDir.relativize(filePath).toString().replace("\\", "/");

                // Se o caminho da imagem não estiver na lista de imagens utilizadas, deletamos
                // o arquivo
                if (!usedImagePaths.contains("uploads/images/" + relativePath)) {
                    Files.delete(filePath);
                    System.out.println("Imagem deletada: " + filePath);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

@MessageMapping("/status") // Escuta mensagens enviadas para /app/status
@SendTo("/topic/status")   // Envia resposta para todos conectados ao tópico /topic/status
public ConcurrentMap<String, String> updateUserStatus(String message) {
    try {
        // Parse da mensagem recebida
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, String> payload = objectMapper.readValue(message, Map.class);

        String username = payload.get("username");
        String status = payload.get("status");

        // Atualiza o status do usuário no mapa
        if (username != null && status != null) {
            connectedUsers.put(username, status);

            // Debug para verificar se está funcionando
            System.out.println("Usuário: " + username + ", Status: " + status);
        } else {
            System.err.println("Mensagem inválida recebida: " + message);
        }
    } catch (Exception e) {
        System.err.println("Erro ao processar mensagem: " + e.getMessage());
    }

    // Retorna o mapa atualizado para todos conectados
    return connectedUsers;
}
    

    @Transactional
    @GetMapping("/connected-users")
    public ConcurrentMap<String, String> getAllUsers() {
        return connectedUsers; // Retorna os usuários conectados
    }

}
