package com.inet.juchamsi.global.config;

import com.inet.juchamsi.global.jwt.JwtAuthenticationFilter;
import com.inet.juchamsi.global.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .httpBasic().disable() // Http basic Auth 기반으로 로그인 인증창이 뜸. disable시에 인증창 뜨지 않음 // httpBasic 방식 대신에 JWT 방식을 사용하므로 disable로 설정
                    .csrf().disable() // rest api이므로 csrf 보안이 필요없으므로 disable 처리
                    .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS) // JWT를 사용하기 때문에 session을 stateless로 설정한다. stateless로 설정 시 Spring Security는 세션을 사용하지 않는다.
                .and()
                    .authorizeRequests() // 요청 url에 따라 접근 권한 설정
                    .antMatchers("/**").permitAll() // /아래 모든 리소스의 접근을 인증절차 없이 허용한다
                    .antMatchers("/user").hasRole("USER") // 모든 url은 인증 후 user레벨의 권한을 가진 사용자만 접근을 허용
                    .antMatchers("/owner").hasRole("OWNER")
                    .antMatchers("/admin").hasRole("ADMIN")
                    .anyRequest().authenticated() // 인증된 유저만 접근 허용
                .and()
                    .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class); // UsernamePasswordAuthenticationFilter: 아이디, 패스워드 기반의 인증을 담당하는 필터

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // 단방향 비밀번호 암호화
        // default: bcrypt 전략 사용
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }
}
