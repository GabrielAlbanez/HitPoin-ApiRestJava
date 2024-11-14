package tech.buildrun.springPonto.controller.dto;





import java.util.List;

import tech.buildrun.springPonto.Entities.HitPoint;

public record RequestGetPostForDay(List<HitPoint> hitPoints, String resposta) {
}

