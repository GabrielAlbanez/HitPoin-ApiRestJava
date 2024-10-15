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
import java.time.LocalTime;

@Entity
@Table(name = "tipo_ponto")
public class HitPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "point_id")
    private Long pointId;

    @JsonBackReference
    @ManyToOne // Adicionando a anotação para o relacionamento com User
    @JoinColumn(name = "user_id") // relata qual vai ser o nome do campo que vai guar a chave estrageira do usario
                                  // - no caso o id
    private User user;

    // Anotação correta para preencher automaticamente

    @Column(name = "tipo_ponto")
    private String tipoPonto;

    @Column(name = "hora_ponto")
    private String hora;

    @Column(name = "dia_ponto")
    private Integer  dia;

    @Column(name = "mes_ponto")
    private Integer mes;

    @Column(name = "ano_ponto")
    private Integer ano;

   

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

    public int getDia() {
        return dia;
    }

    public String getHora() {
        return hora;
    }

    public void setDia(int dia) {
        this.dia = dia;
    }

    public void setHora(String hora) {
        this.hora = hora;
    }

    public Integer getAno() {
        return ano;
    }

    public Integer getMes() {
        return mes;
    }

    public void setAno(Integer ano) {
        this.ano = ano;
    }

    public void setMes(Integer mes) {
        this.mes = mes;
    }

    public void setTipo(String tipo) {
        this.tipoPonto = tipo;
    }

    public String getTipoPonto() {
        return tipoPonto;
    }
}
