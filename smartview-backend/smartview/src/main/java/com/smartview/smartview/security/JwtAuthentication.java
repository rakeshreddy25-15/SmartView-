package com.smartview.smartview.security;

import org.springframework.security.authentication.AbstractAuthenticationToken;

public class JwtAuthentication extends AbstractAuthenticationToken {
    private final String email;

    public JwtAuthentication(String email) {
        super(null);
        this.email = email;
        setAuthenticated(true);
    }

    @Override
    public Object getPrincipal() {
        return email;
    }

    @Override
    public Object getCredentials() {
        return null;
    }
}
