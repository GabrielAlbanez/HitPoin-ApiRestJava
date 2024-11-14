package tech.buildrun.springPonto.controller.dto;

/**
 * RequestGetPostForDayUserRequest
 */
public class RequestGetPostForDayUserRequest {
    private String id;
    private Integer dia;
    private Integer mes;
    private Integer ano;


    public Integer getAno() {
        return ano;
    }

    public void setAno(Integer ano) {
        this.ano = ano;
    }

    // Getters e Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getDia() {
        return dia;
    }

    public void setDia(Integer dia) {
        this.dia = dia;
    }

    public Integer getMes() {
        return mes;
    }

    public void setMes(Integer mes) {
        this.mes = mes;
    }

}