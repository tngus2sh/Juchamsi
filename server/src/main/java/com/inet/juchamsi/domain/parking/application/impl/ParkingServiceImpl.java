package com.inet.juchamsi.domain.parking.application.impl;

import com.inet.juchamsi.domain.chat.application.ChatService;
import com.inet.juchamsi.domain.chat.dao.ChatRoomRepository;
import com.inet.juchamsi.domain.chat.dao.MessageRepository;
import com.inet.juchamsi.domain.chat.dto.request.ChatMessageRequest;
import com.inet.juchamsi.domain.chat.dto.service.SystemMessageDto;
import com.inet.juchamsi.domain.chat.entity.ChatRoom;
import com.inet.juchamsi.domain.chat.entity.Message;
import com.inet.juchamsi.domain.chat.entity.Status;
import com.inet.juchamsi.domain.parking.application.ParkingService;
import com.inet.juchamsi.domain.parking.dao.ParkingHistoryRepository;
import com.inet.juchamsi.domain.parking.dao.ParkingLotRepository;
import com.inet.juchamsi.domain.parking.dto.request.EntranceExitRequest;
import com.inet.juchamsi.domain.parking.dto.service.ExitTimeDto;
import com.inet.juchamsi.domain.parking.entity.ParkingHistory;
import com.inet.juchamsi.domain.parking.entity.ParkingLot;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.global.common.ChatMessage;
import com.inet.juchamsi.global.error.NotFoundException;
import com.inet.juchamsi.global.notification.application.FirebaseCloudMessageService;
import com.inet.juchamsi.global.notification.dto.request.FCMNotificationRequest;
import lombok.RequiredArgsConstructor;
import net.bytebuddy.dynamic.TypeResolutionStrategy;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.swing.*;
import javax.swing.text.html.Option;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

import static com.inet.juchamsi.domain.chat.entity.Status.ALIVE;
import static com.inet.juchamsi.domain.chat.entity.Type.SYSTEM;
import static com.inet.juchamsi.global.common.Active.ACTIVE;
import static com.inet.juchamsi.global.common.Active.DISABLED;
import static com.inet.juchamsi.global.common.ChatMessage.*;

@Service
@RequiredArgsConstructor
public class ParkingServiceImpl implements ParkingService {

    private final ParkingLotRepository parkingLotRepository;
    private final ParkingHistoryRepository parkingHistoryRepository;
    private final UserRepository userRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final MessageRepository messageRepository;
    private final FirebaseCloudMessageService firebaseCloudMessageService;
    private final ChatService chatService;

    // 입차 위치 정보 저장
    @Override
    public void createEntrance(EntranceExitRequest request) {
        // 주차 위치로 주차장 정보 가져오기
        String groundAddress = request.getGroundAddress();
        Optional<ParkingLot>  parkingLot = parkingLotRepository.findBySeatMacAddress(groundAddress, ACTIVE);
        if (parkingLot.isEmpty()) {
            throw new NotFoundException(ParkingLot.class, groundAddress);
        }
        int seatNumber = parkingLot.get().getSeatNumber();

        // mac 주소로 사용자 내역 가져오기
        String macAddress = request.getMacAddress();
        Optional<User> user = userRepository.findUserByMacAddress(macAddress, ACTIVE);
        if (user.isEmpty()) {
            throw new NotFoundException(User.class, macAddress);
        }

        // 현재 시간 출력
        Timestamp inTime = new Timestamp(System.currentTimeMillis());

        // 주차 히스토리 저장
        parkingHistoryRepository.save(ParkingHistory.builder()
                        .user(user.get())
                        .parkingLot(parkingLot.get())
                        .active(ACTIVE)
                        .inTime(inTime)
                        .outTime(null)
                        .build());

        // 주차가 됐다는 알람을 사용자(차주)에게 전송한다.
        firebaseCloudMessageService.sendNotification(FCMNotificationRequest.builder()
                .loginId(user.get().getLoginId())
                .title(ENTRANCE_MESSAGE)
                .body(user.get().getName() + "님 차가 주차되었습니다.")
                .build());
    }

    @Override
    public void notifyToBackNumber(ExitTimeDto exitTimeDto) {
        int seatNumber = exitTimeDto.getSeatNumber();
        String outTime = exitTimeDto.getOutTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));

        // 주차 위치로 주차장 정보 가져오기
        Optional<ParkingLot> parkingLotOptional = parkingLotRepository.findBySeatNumber(seatNumber, ACTIVE);
        if (parkingLotOptional.isEmpty()) {
            throw new NotFoundException(ParkingLot.class, seatNumber);
        }

        // 주차 위치 정보로부터 뒤차가 있을 경우 해당 차의 출차시간에 맞춰 알람을 보낸다.
        int backNumber = parkingLotOptional.get().getBackNumber();
        if (backNumber != 0) {
            // 뒤차 정보 -> 뒤차의 자리 번호로 해당 주차장 식별키를 알아내 주차장 히스토리에 현재 주차되어 있는 차를 찾음
            Optional<String> backLoginIdOptional = parkingHistoryRepository.findByParkingHistoryAndActive(backNumber, ACTIVE);
            // TODO: 현재 주차가 되어있음 -> 해당 차의 출차시간에 맞춰 알람 보냄

            // 뒤차주에게 현 차주의 출차시간을 알람으로 보내줌
            backLoginIdOptional.ifPresent(s -> firebaseCloudMessageService.sendNotification(FCMNotificationRequest.builder()
                    .loginId(backLoginIdOptional.get())
                    .title("시스템 메세지")
                    .body(ENTRANCE_FRONT_MESSAGE)
                    .build()));
            String backNumberLoginId = backLoginIdOptional.get();

            // 현재 차주의 roomId 구하기
            Optional<String> roomIdOptional = chatRoomRepository.findRoomIdByLoginIdAndType(backNumberLoginId, SYSTEM, ALIVE);
            if (roomIdOptional.isEmpty()) {
                throw new NotFoundException(ChatRoom.class, backNumberLoginId);
            }

            // 뒤 차주의 시스템 메세지 db에 내용 저장
            chatService.createSystemChat(SystemMessageDto.builder()
                    .senderId(SYSTEM_ID)
                    .message(ENTRANCE_FRONT_EXIT_TIME_MESSAGE + "\n" + "[" + outTime + "]")
                    .roomId(roomIdOptional.get())
                    .build());
        }
    }

    @Override
    public void createExit(EntranceExitRequest request) {
        // 주차 위치 맥 주소를 받아온다.
        String groundMacAddress = request.getGroundAddress();
        Optional<ParkingLot> parkingLotOptional = parkingLotRepository.findBySeatMacAddress(groundMacAddress, ACTIVE);
        if (parkingLotOptional.isEmpty()) {
            throw new NotFoundException(ParkingLot.class, groundMacAddress);
        }
        // mac 주소로 현재 주차 표시 되어있는 주차 내역 정보 가져오기
        Optional<ParkingHistory> parkingHistoryOptional = parkingHistoryRepository.findBySeatMacAddressAndActive(groundMacAddress, ACTIVE);
        if (parkingHistoryOptional.isEmpty()) {
            throw new NotFoundException(ParkingHistory.class, groundMacAddress);
        }
        // 주차 내역 정보 업데이트
        parkingHistoryRepository.updateParkingHistory(DISABLED, parkingHistoryOptional.get().getId());
    }

    // 유저에게 출차시간 15분전 알람 주기
    @Scheduled(cron = "0 0/5 * * * ?")
    public void notifyOutTimeToUser() {

    }
}
