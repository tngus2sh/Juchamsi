package com.inet.juchamsi.domain.mileage.dao;

import com.inet.juchamsi.domain.mileage.entity.Mileage;
import com.inet.juchamsi.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MileageRepository extends JpaRepository<Mileage, Long> {

    @Query("select m from Mileage m where m.user=:user")
    List<Mileage> showMyMileage(@Param("user") User user);
}
