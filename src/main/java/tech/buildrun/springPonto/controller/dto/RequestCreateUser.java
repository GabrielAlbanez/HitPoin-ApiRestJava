package tech.buildrun.springPonto.controller.dto;

import java.util.Optional;
import tech.buildrun.springPonto.Entities.User;

public record RequestCreateUser(Optional<User> user, String response) {

}
