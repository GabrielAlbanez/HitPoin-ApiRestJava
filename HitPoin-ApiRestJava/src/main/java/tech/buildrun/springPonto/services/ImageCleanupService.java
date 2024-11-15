package tech.buildrun.springPonto.services;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import tech.buildrun.springPonto.Entities.User;
import tech.buildrun.springPonto.Repository.UserRepository;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.nio.file.*;

@Configuration
public class ImageCleanupService {

    @Value("${upload.directory}")
    private String uploadDirectory;

    private final UserRepository userRepository;

    public ImageCleanupService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @jakarta.annotation.PostConstruct
    @Transactional
    public void cleanupUnusedImages() {
        Path projectDir = Paths.get(System.getProperty("user.dir"), "HitPoint", uploadDirectory);
    
        // Recupera os caminhos das imagens que estão sendo utilizadas no banco de dados
        List<String> usedImagePaths = userRepository.findAll().stream()
            .map(User::getImagePath)
            .filter(path -> path != null && !path.isEmpty())
            .collect(Collectors.toList());
    
        try (DirectoryStream<Path> directoryStream = Files.newDirectoryStream(projectDir)) {
            for (Path filePath : directoryStream) {
                String relativePath = projectDir.relativize(filePath).toString().replace("\\", "/");
    
                // Se o caminho da imagem não estiver na lista de imagens utilizadas, deletamos o arquivo
                if (!usedImagePaths.contains("uploads/images/" + relativePath)) {
                    Files.delete(filePath);
                    System.out.println("Imagem deletada: " + filePath);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
