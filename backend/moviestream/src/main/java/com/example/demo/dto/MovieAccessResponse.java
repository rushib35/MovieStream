package com.example.demo.dto;

public class MovieAccessResponse {

    private boolean allowed;
    private String message;

    public MovieAccessResponse() {
    }

    public MovieAccessResponse(boolean allowed, String message) {
        this.allowed = allowed;
        this.message = message;
    }

    public boolean isAllowed() {
        return allowed;
    }

    public void setAllowed(boolean allowed) {
        this.allowed = allowed;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        return "MovieAccessResponse [allowed=" + allowed
                + ", message=" + message + "]";
    }
}