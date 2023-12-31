package com.inet.juchamsi.domain.mileage.application;

import com.inet.juchamsi.domain.mileage.dto.request.GetMileageRequest;
import com.inet.juchamsi.domain.mileage.dto.response.MileageResponse;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface MileageService {
    List<MileageResponse> showMileage(String userId);
    void createMileage(GetMileageRequest request);
}
