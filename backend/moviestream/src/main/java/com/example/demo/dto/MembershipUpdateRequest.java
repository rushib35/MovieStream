package com.example.demo.dto;

import com.example.demo.entities.Membership;

public class MembershipUpdateRequest {

    private Membership membership;

    public MembershipUpdateRequest() {
    }

    public Membership getMembership() {
        return membership;
    }

    public void setMembership(Membership membership) {
        this.membership = membership;
    }
}