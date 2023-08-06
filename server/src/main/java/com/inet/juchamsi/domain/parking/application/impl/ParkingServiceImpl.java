package com.inet.juchamsi.domain.parking.application.impl;

import com.inet.juchamsi.domain.chat.application.ChatService;
import com.inet.juchamsi.domain.chat.dao.ChatRoomRepository;
import com.inet.juchamsi.domain.chat.dao.MessageRepository;
import com.inet.juchamsi.domain.chat.dto.service.SystemMessageDto;
import com.inet.juchamsi.domain.chat.entity.ChatRoom;
import com.inet.juchamsi.domain.notification.application.NotificationService;
import com.inet.juchamsi.domain.notification.dto.request.CreateNotificationRequest;
import com.inet.juchamsi.domain.parking.application.ParkingService;
import com.inet.juchamsi.domain.parking.dao.ParkingHistoryRepository;
import com.inet.juchamsi.domain.parking.dao.ParkingLotRepository;
import com.inet.juchamsi.domain.parking.dto.request.EntranceExitRequest;
import com.inet.juchamsi.domain.parking.dto.request.EntranceOutTimeRequest;
import com.inet.juchamsi.domain.parking.dto.service.BackUserOutTimeDto;
import com.inet.juchamsi.domain.parking.dto.service.ExitTimeDto;
import com.inet.juchamsi.domain.parking.entity.ParkingHistory;
import com.inet.juchamsi.domain.parking.entity.ParkingLot;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.domain.villa.entity.Villa;
import com.inet.juchamsi.global.error.NotFoundException;
import com.inet.juchamsi.global.notification.application.FirebaseCloudMessageService;
import com.inet.juchamsi.global.notification.dto.request.FCMNotificationRequest;
import com.inet.juchamsi.global.redis.RedisUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
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
    private final NotificationService notificationService;
    private final RedisUtils redisUtils;

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
        LocalDateTime inTime = LocalDateTime.now();

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
    public void createOutTime(EntranceOutTimeRequest request) {
        String userId = request.getUserId();
        int seatNumber = request.getSeatNumber();
        String outTime = request.getOutTime();

        // 자리번호와 사용자 아이디로 해당 주차내역 식별키 가져오기
        Optional<ParkingHistory> parkingHistoryOptional = parkingHistoryRepository.findAllBySeatNumberAndLoginId(seatNumber, userId, ACTIVE);
        if (parkingHistoryOptional.isEmpty()) {
            throw new NotFoundException(ParkingHistory.class, seatNumber);
        }

        // 가져온 별키로 출차시간 수정하기
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime dateTime = LocalDateTime.parse(outTime, formatter);

        parkingHistoryRepository.updateOutTime(dateTime, parkingHistoryOptional.get().getId());

        notifyToCarOwner(ExitTimeDto.builder()
                .seatNumber(seatNumber)
                .outTime(outTime)
                .loginId(userId)
                .build());

        notifyToBackNumber(ExitTimeDto.builder()
                .seatNumber(seatNumber)
                .outTime(outTime)
                .loginId(userId)
                .build());
    }

    public void notifyToCarOwner(ExitTimeDto exitTimeDto) {
        String outTimeStr = exitTimeDto.getOutTime();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy:MM:dd HH:mm");
        LocalDateTime outTime = LocalDateTime.parse(outTimeStr, formatter);
        LocalDateTime outTimeBeforeFifteen = outTime.minusMinutes(15);

        // 15분전 알람
        notificationService.createNotification(CreateNotificationRequest.builder()
                .loginId(exitTimeDto.getLoginId())
                .notiTime(outTimeBeforeFifteen)
                .message(EXIT_REMINDER)
                .build());

        // 현재 출차시간 알람
        notificationService.createNotification(CreateNotificationRequest.builder()
                .loginId(exitTimeDto.getLoginId())
                .notiTime(outTime)
                .message(EXIT_TIME_REMINDER)
                .build());

    }

    // 출차시간 등록
    public void notifyToBackNumber(ExitTimeDto exitTimeDto) {
        String villaIdNumber = exitTimeDto.getVillaIdNumber();
        int seatNumber = exitTimeDto.getSeatNumber();
        String outTimeStr = exitTimeDto.getOutTime();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy:MM:dd HH:mm");
        LocalDateTime outTime = LocalDateTime.parse(outTimeStr, formatter);

        // 주차 위치로 주차장 정보 가져오기
        Optional<ParkingLot> parkingLotOptional = parkingLotRepository.findBySeatNumber(villaIdNumber, seatNumber, ACTIVE);
        if (parkingLotOptional.isEmpty()) {
            throw new NotFoundException(ParkingLot.class, seatNumber);
        }

        // 주차 위치 정보로부터 뒤차가 있을 경우 해당 차의 출차시간에 맞춰 알람을 보낸다.
        int backNumber = parkingLotOptional.get().getBackNumber();
        Villa villa = parkingLotOptional.get().getVilla();
        if (backNumber != 0) {
            // 뒤차 정보 -> 뒤차의 자리 번호와 빌라 식별키로 해당 주차장 식별키를 알아내 주차장 히스토리에 현재 주차되어 있는 차를 찾음
            Optional<BackUserOutTimeDto> backLoginIdOptional = parkingHistoryRepository.findByParkingHistoryAndActive(villa, backNumber, ACTIVE);

            // 뒤차주에게 현 차주의 출차시간을 알람으로 보내줌
            backLoginIdOptional.ifPresent(s -> firebaseCloudMessageService.sendNotification(FCMNotificationRequest.builder()
                    .loginId(backLoginIdOptional.get().getUserId())
                    .title("시스템 메세지")
                    .body(ENTRANCE_FRONT_MESSAGE)
                    .build()));
            String backNumberLoginId = backLoginIdOptional.get().getUserId();

            // 현재 주차가 되어있음 -> 해당 차의 출차시간에 맞춰 알람 보냄
            notificationService.createNotification(CreateNotificationRequest.builder()
                    .loginId(backNumberLoginId)
                    .notiTime(backLoginIdOptional.get().getOutTime())
                    .message(EXIT_FRONT_MESSAGE)
                    .build());

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

    // 유저에게 출차시간 알림 주기(15분전, 출차시간이 됐을 때)
    @Scheduled(cron = "0 0/1 * * * ?")
    public void notifyOutTimeToUser() {
        LocalDateTime localDateTime = LocalDateTime.now();
        String notiTime = localDateTime.format(DateTimeFormatter.ofPattern("yyyy:MM:dd HH:mm"));

        Map<String, String> entries = redisUtils.getRedisHash(notiTime);

        for (String field : entries.keySet()) {
            String value = (String) entries.get(field);
            if (value.equals(notiTime)) {
                // 알람 보내기
                firebaseCloudMessageService.sendNotification(FCMNotificationRequest.builder()
                                .loginId(field)
                                .title(EXIT_TITLE)
                                .body(value)
                        .build());

                // 시스템 메시지 저장
                Optional<String> chatRoomOptional = chatRoomRepository.findRoomIdByLoginIdAndType(field, SYSTEM, ALIVE);
                if (chatRoomOptional.isEmpty()) {
                    throw new NotFoundException(ChatRoom.class, field);
                }
                chatService.createSystemChat(SystemMessageDto.builder()
                        .senderId(SYSTEM_ID)
                        .message(value)
                        .roomId(chatRoomOptional.get())
                        .build());
            }
        }
    }
}
