package com.inet.juchamsi.domain.user.entity;

import com.inet.juchamsi.domain.villa.entity.Villa;
import com.inet.juchamsi.global.common.Active;
import com.inet.juchamsi.global.common.TimeBaseEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import static javax.persistence.EnumType.STRING;
import static javax.persistence.GenerationType.IDENTITY;

@Entity
@Getter
@ToString
public class User extends TimeBaseEntity implements UserDetails {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column()
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "villa_id")
    private Villa villa;

    @Column(name = "phone_number", unique = true, nullable = false, length = 13)
    private String phoneNumber;

    @Column(name = "login_id", nullable = false, length = 15)
    private String loginId;

    @Column(name = "login_password", nullable = false)
    private String loginPassword;

    @Column(nullable = false, updatable = false, length = 20)
    private String name;

    @Column(name = "total_mileage", nullable = false)
    private int totalMileage;

    @Enumerated(STRING)
    @Column(nullable = false, updatable = false, length = 20)
    private Grade grade;

    @Column(name = "mac_address")
    private String macAddress;

    @Column(name = "car_number", unique = true, length = 15)
    private String carNumber;

    @Column(name = "villa_number")
    private int villaNumber;

    @Enumerated(STRING)
    @Column(length = 20)
    private Approve approve;

    @Enumerated(STRING)
    @Column(length = 20)
    private Active active;

    @Column(name = "refresh_token")
    private String refreshToken;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> roles = new ArrayList<>();

    public User() {}

    @Builder
    public User(Long id, Villa villa, String phoneNumber, String loginId, String loginPassword, String name, int totalMileage, Grade grade, String macAddress, String carNumber, int villaNumber, Approve approve, Active active, String refreshToken, List<String> roles) {
        this.id = id;
        this.villa = villa;
        this.phoneNumber = phoneNumber;
        this.loginId = loginId;
        this.loginPassword = loginPassword;
        this.name = name;
        this.totalMileage = totalMileage;
        this.grade = grade;
        this.macAddress = macAddress;
        this.carNumber = carNumber;
        this.villaNumber = villaNumber;
        this.approve = approve;
        this.active = active;
        this.refreshToken = refreshToken;
        this.roles = roles;
    }
    
    /*
        연관관계 편의 메서드
     */
    public static User createUserTenant(Villa villa, String phoneNumber, String loginId, String loginPassword, String name, int totalMileage, Grade grade, String macAddress, String carNumber, int villaNumber, Approve approve, Active active, String role) {
        return User.builder()
                .villa(villa)
                .phoneNumber(phoneNumber)
                .loginId(loginId)
                .loginPassword(loginPassword)
                .name(name)
                .totalMileage(totalMileage)
                .grade(grade)
                .macAddress(macAddress)
                .carNumber(carNumber)
                .villaNumber(villaNumber)
                .approve(approve)
                .active(active)
                .roles(Collections.singletonList(role))
                .build();
    }

    /*
        admin 연관관계 편의 메서드
     */
    public static User createUserAdmin(String phoneNumber, String loginId, String loginPassword, String name, Grade grade, Approve approve, Active active, String role) {
        return User.builder()
                .phoneNumber(phoneNumber)
                .loginId(loginId)
                .loginPassword(loginPassword)
                .name(name)
                .grade(grade)
                .approve(approve)
                .active(active)
                .roles(Collections.singletonList(role))
                .build();
    }

    // 해당 유저의 권한을 리턴
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // SimpleGrantedAuthority::new -> 생성자를 가리키는 메서드 참조, SimpleGrantedAuthority(사용자의 권한을 나타내는데 활용)
        // .map() -> 스트림의 각 요소를 SimpleGrantedAuthority객체로 변환하는 데에 사용되는 메서드 참조
        // Collectors.toList() -> 스트림의 요소들을 리스트로 수집하는 역할 즉, 스트림의 처리 결과를 리스트 형태로 저장하는 것
        // .collect() -> 스트림의 종료 연산 중 하나, 스트림의 요소들을 수집하여 원하는 결과를 생성할 수 있다.
        // 결과적으로, List<SimpleGrantedAuthority>형태로 반환
        return this.roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        return this.loginPassword;
    }

    @Override
    public String getUsername() {
        return this.loginId;
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
