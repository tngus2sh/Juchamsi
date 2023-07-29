package com.inet.juchamsi.domain.parking.application.impl;

import com.inet.juchamsi.domain.parking.application.ParkingLotService;
import com.inet.juchamsi.domain.parking.dao.ParkingLotRepository;
import com.inet.juchamsi.domain.parking.entity.ParkingLot;
import com.inet.juchamsi.domain.villa.dao.VillaRepository;
import com.inet.juchamsi.domain.villa.entity.Villa;
import com.inet.juchamsi.global.error.AlreadyExistException;
import com.inet.juchamsi.global.error.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static com.inet.juchamsi.domain.parking.entity.ParkingFlag.EMPTY;
import static com.inet.juchamsi.global.common.Active.ACTIVE;

@Service
@RequiredArgsConstructor
public class ParkingLotServiceImpl implements ParkingLotService {

    private final VillaRepository villaRepository;
    private final ParkingLotRepository parkingLotRepository;

    @Override
    @Transactional
    public void createParkingLot(Long villaId, int parkingLotCol) {
        Optional<Villa> targetVilla = villaRepository.findById(villaId);
        if(!targetVilla.isPresent()) {
            throw new NotFoundException(Villa.class, villaId);
        }

        Villa villa = targetVilla.get();

        Long lotCount = parkingLotRepository.countByVilla(villa);
        if(lotCount > 0) {
            throw new AlreadyExistException(ParkingLot.class, villaId);
        }

        ParkingLot parkingLot;
        for(int i = 1; i <= parkingLotCol; i++) {
            parkingLot = ParkingLot.createFrontParkingLot(villa, i, EMPTY, (i + parkingLotCol), ACTIVE);
            parkingLotRepository.save(parkingLot);

            parkingLot = ParkingLot.createBackParkingLot(villa, (i + parkingLotCol), EMPTY, i, ACTIVE);
            parkingLotRepository.save(parkingLot);
        }
    }
}
