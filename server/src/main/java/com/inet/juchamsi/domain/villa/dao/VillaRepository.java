package com.inet.juchamsi.domain.villa.dao;

import com.inet.juchamsi.domain.villa.entity.Villa;
import com.inet.juchamsi.global.common.Active;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;

import java.util.Optional;

public interface VillaRepository extends JpaRepository<Villa, Long> {

    @Query("select v.id from Villa v where v.idNumber=:idNumber")
    Optional<Long> existIdNumber(@Param("idNumber") String idNumber);

    @Query("select v.id from Villa v where v.idNumber=:idNumber and v.active=:active")
    Optional<Long> existIdNumberandActive(@Param("idNumber") String idNumber, @Param("active") Active active);
}