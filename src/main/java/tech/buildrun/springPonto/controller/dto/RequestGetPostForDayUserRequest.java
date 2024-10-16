package tech.buildrun.springPonto.controller.dto;

/**
 * RequestGetPostForDayUserRequest
 */
public class RequestGetPostForDayUserRequest {
    private String id;
    private Integer dia;
    private Integer mes;

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