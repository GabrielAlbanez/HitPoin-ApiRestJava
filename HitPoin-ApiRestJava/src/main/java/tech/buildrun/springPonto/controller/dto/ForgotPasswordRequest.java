package tech.buildrun.springPonto.controller.dto;

/**
 * ForgotPasswordRequest
 */

public class ForgotPasswordRequest {
    private String email;

    public void setEmail(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }
}
