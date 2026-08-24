package com.wfc.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDto {

    public static class RegisterRequest {
        @NotBlank @Email
        private String email;
        @NotBlank @Size(min = 6)
        private String password;
        @NotBlank
        private String name;
        private String phone;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
    }

    public static class LoginRequest {
        @NotBlank @Email
        private String email;
        @NotBlank
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class AuthResponse {
        private String token;
        private String email;
        private String name;
        private String role;

        public AuthResponse() {}
        public AuthResponse(String token, String email, String name, String role) {
            this.token = token; this.email = email; this.name = name; this.role = role;
        }
        public String getToken() { return token; }
        public String getEmail() { return email; }
        public String getName() { return name; }
        public String getRole() { return role; }

        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private String token, email, name, role;
            public Builder token(String v) { token = v; return this; }
            public Builder email(String v) { email = v; return this; }
            public Builder name(String v) { name = v; return this; }
            public Builder role(String v) { role = v; return this; }
            public AuthResponse build() { return new AuthResponse(token, email, name, role); }
        }
    }
}
