package tech.buildrun.springPonto.Entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.ManyToOne; // Supondo que o relacionamento com User seja de muitos para um
import jakarta.persistence.Column; // Para a anotação @Column
import jakarta.persistence.JoinColumn; // Importação correta para JoinColumn
import org.hibernate.annotations.CreationTimestamp; // Importação correta para CreationTimestamp

import com.fasterxml.jackson.annotation.JsonBackReference;

import java.time.LocalDateTime; // Importação para LocalDateTime

@Entity
@Table(name = "tipo_ponto")
public class HitPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "point_id")
    private Long pointId;

    @JsonBackReference
    @ManyToOne // Adicionando a anotação para o relacionamento com User
    @JoinColumn(name = "user_id") // relata qual vai ser o nome do campo que vai guar a chave estrageira do usario - no caso o id
    private User user;

    @CreationTimestamp // Anotação correta para preencher automaticamente
    @Column(name = "created_at") // Nome da coluna no banco, se necessário
    private LocalDateTime timeStamp; // Usando LocalDateTime para data e hora

    @Column(name = "tipo_ponto")
    private String tipoPonto;

    // Getters e Setters
    public Long getPointId() {
        return pointId;
    }

    public void setPointId(Long pointId) {
        this.pointId = pointId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getTimeStamp() {
        return timeStamp;
    }

    public void setTimeStamp(LocalDateTime timeStamp) {
        this.timeStamp = timeStamp; // Opcional, mas geralmente não é necessário, pois é gerado automaticamente
    }

    public void setTipo(String tipo) {
        this.tipoPonto = tipo;
    }

    public String getTipoPonto() {
        return tipoPonto;
    }
}
