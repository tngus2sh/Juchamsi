package com.inet.juchamsi.domain.mileage.dao;

import com.inet.juchamsi.domain.mileage.entity.Mileage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MileageRepository extends JpaRepository<Mileage, Long> {
}
