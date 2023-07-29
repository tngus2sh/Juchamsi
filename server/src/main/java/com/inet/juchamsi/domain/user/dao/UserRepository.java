package com.inet.juchamsi.domain.user.dao;

import com.inet.juchamsi.domain.user.entity.Approve;
import com.inet.juchamsi.domain.user.entity.Grade;
import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.global.common.Active;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    @Query("select u.id from User u where u.loginId=:loginId")
    Optional<Long> existLoginId(@Param("loginId") String loginId);

    @Query("select u.id from User u where u.phoneNumber=:phoneNumber")
    Optional<Long> existPhoneNumber(@Param("phoneNumber") String phoneNumber);

    @Query("select u.id from User u where u.carNumber=:carNumber")
    Optional<Long> existCarNumber(@Param("carNumber") String carNumber);

    @Query("select u from User u where u.active=:active and u.grade=:grade")
    Optional<List<User>> findAllByGradeAndActive(@Param("grade") Grade grade, @Param("active") Active active);

    @Query("select u from User u where u.loginId=:loginId")
    Optional<User> findByLoginId(@Param("loginId") String loginId);

    @Query("select u from User u where u.loginId=:loginId and u.active=:active")
    Optional<User> findByLoginIdAndActive(@Param("loginId") String loginId, @Param("active") Active active);

    @Query("select u from User u where u.name=:name and u.phoneNumber=:phoneNumber")
    Optional<User> findByNameAndPhone(@Param("name") String name, @Param("phoneNumber") String phoneNumber);

    @Modifying(clearAutomatically = true) // 해야되는 이유 : https://frogand.tistory.com/174
    @Query("update User u set u.phoneNumber=:phoneNumber, u.carNumber=:carNumber, u.villaNumber=:villaNumber where u.loginId=:loginId")
    Optional<Void> updateTenant(@Param("loginId") String loginId, @Param("phoneNumber") String phoneNumber, @Param("carNumber") String carNumber, @Param("villaNumber") int villaNumber);

    @Modifying(clearAutomatically = true)
    @Query("update User u set u.phoneNumber=:phoneNumber, u.carNumber=:carNumber where u.loginId=:loginId")
    Optional<Void> updateOwner(@Param("loginId") String loginId, @Param("phoneNumber") String phoneNumberr, @Param("carNumber") String carNumber);

    @Modifying(clearAutomatically = true)
    @Query("update User u set u.phoneNumber=:phoneNumber where u.loginId=:loginId")
    Optional<Void> updateAdmin(@Param("loginId") String loginId, @Param("phoneNumber") String phoneNumber);

    @Modifying(clearAutomatically = true)
    @Query("update User u set u.refreshToken=:refreshToken where u.loginId=:loginId")
    Optional<Void> updateRefreshToken(@Param("loginId") String loginId, @Param("refreshToken") String refreshToken);

    @Modifying(clearAutomatically = true)
    @Query("update User u set u.approve=:approve where u.loginId=:loginId")
    Optional<Void> updateApprove(@Param("loginId") String loginId, @Param("approve") Approve approve);

    @Modifying(clearAutomatically = true)
    @Query("update User u set u.active=:active where u.loginId=:loginId")
    Optional<Void> updateActive(@Param("loginId") String loginId, @Param("active") Active active);
}
