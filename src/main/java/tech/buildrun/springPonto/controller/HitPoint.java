package tech.buildrun.springPonto.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import tech.buildrun.springPonto.Entities.User;
import tech.buildrun.springPonto.Repository.HitPointRepository;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/Pontos")
public class HitPoint {

    private HitPointRepository hitPointRepository;

    public HitPoint(HitPointRepository hitPointRepository){
          this.hitPointRepository = hitPointRepository;
    }


    @GetMapping("/AllPoints")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<List<tech.buildrun.springPonto.Entities.HitPoint>> ListUsers() {

        var allPoints = hitPointRepository.findAll();

        return ResponseEntity.ok(allPoints);

    }



}
