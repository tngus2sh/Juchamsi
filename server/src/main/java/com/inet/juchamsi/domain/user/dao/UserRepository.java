package com.inet.juchamsi.domain.user.dao;

import com.inet.juchamsi.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    @Query("select u.id from User u where u.phoneNumber=:phoneNumber")
    Optional<Long> existPhoneNumber(@Param("phoneNumber") String phoneNumber);

    @Query("select u.id from User u where u.carNumber=:carNumber")
    Optional<Long> existCarNumber(@Param("carNumber") String carNumber);
    
}
