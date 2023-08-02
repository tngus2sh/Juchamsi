package com.inet.juchamsi.domain.mileage.application.impl;

import com.inet.juchamsi.domain.mileage.application.MileageService;
import com.inet.juchamsi.domain.mileage.dao.MileageRepository;
import com.inet.juchamsi.domain.mileage.dto.request.GetMileageRequest;
import com.inet.juchamsi.domain.mileage.dto.response.MileageResponse;
import com.inet.juchamsi.domain.mileage.entity.Mileage;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.global.error.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MileageServiceImpl implements MileageService {

    private final MileageRepository mileageRepository;
    private final UserRepository userRepository;

    @Override
    public List<MileageResponse> showMileage(Long userId) {
        Optional<User> findUser = userRepository.findById(userId);
        if(!findUser.isPresent()) {
            throw new NotFoundException(User.class, userId);
        }

        List<Mileage> mileageList = mileageRepository.showMyMileage(findUser.get());

        Mileage mileage;
        List<MileageResponse> response = new ArrayList<>();
        for(int i = 0; i < mileageList.size(); i++) {
            mileage = mileageList.get(i);
            MileageResponse mileageResponse = MileageResponse.builder()
                    .id(mileage.getId())
                    .point(mileage.getPoint())
                    .type(mileage.getType())
                    .description(mileage.getDescription())
                    .createDate(mileage.getCreatedDate())
                    .lastModifiedDate(mileage.getLastModifiedDate())
                    .build();
            response.add(mileageResponse);
        }

        return response;
    }

    @Override
    public void createMileage(GetMileageRequest request) {
        Optional<User> findUser = userRepository.findByLoginId(request.getLoginId());
        if(!findUser.isPresent()) {
            throw new NotFoundException(User.class, request.getLoginId());
        }

        Mileage mileage = Mileage.builder()
                .user(findUser.get())
                .point(request.getPoint())
                .type(request.getType())
                .description(request.getDescription())
                .build();

        mileageRepository.save(mileage);

        userRepository.getMileage(findUser.get().getLoginId(), request.getPoint());
    }
}
