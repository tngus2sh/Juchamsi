package com.inet.juchamsi.domain.parking.application.impl;

import com.inet.juchamsi.domain.chat.application.ChatService;
import com.inet.juchamsi.domain.chat.dao.ChatRoomRepository;
import com.inet.juchamsi.domain.chat.dto.service.SystemMessageDto;
import com.inet.juchamsi.domain.chat.entity.ChatRoom;
import com.inet.juchamsi.domain.mileage.application.MileageService;
import com.inet.juchamsi.domain.mileage.dto.request.GetMileageRequest;
import com.inet.juchamsi.domain.notification.application.NotificationService;
import com.inet.juchamsi.domain.notification.dto.request.CreateNotificationRequest;
import com.inet.juchamsi.domain.parking.application.ParkingService;
import com.inet.juchamsi.domain.parking.dao.ParkingHistoryRepository;
import com.inet.juchamsi.domain.parking.dao.ParkingLotRepository;
import com.inet.juchamsi.domain.parking.dto.request.EntranceRequest;
import com.inet.juchamsi.domain.parking.dto.request.EntranceOutTimeRequest;
import com.inet.juchamsi.domain.parking.dto.request.ExitRequest;
import com.inet.juchamsi.domain.parking.dto.response.ParkingHistoryDetailResponse;
import com.inet.juchamsi.domain.parking.dto.response.ParkingHistoryResponse;
import com.inet.juchamsi.domain.parking.dto.response.ParkingNowResponse;
import com.inet.juchamsi.domain.parking.dto.service.*;
import com.inet.juchamsi.domain.parking.entity.ParkingHistory;
import com.inet.juchamsi.domain.parking.entity.ParkingLot;
import com.inet.juchamsi.domain.user.dao.UserRepository;
import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.global.error.AlreadyExistException;
import com.inet.juchamsi.global.error.NotFoundException;
import com.inet.juchamsi.global.notification.application.FirebaseCloudMessageService;
import com.inet.juchamsi.global.notification.dto.request.FCMNotificationRequest;
import com.inet.juchamsi.global.redis.RedisUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

import static com.inet.juchamsi.domain.chat.entity.Status.ALIVE;
import static com.inet.juchamsi.domain.chat.entity.Type.SYSTEM;
import static com.inet.juchamsi.global.common.Active.ACTIVE;
import static com.inet.juchamsi.global.common.Active.DISABLED;
import static com.inet.juchamsi.global.common.ChatMessage.*;

@Service
@Transactional
@RequiredArgsConstructor
public class ParkingServiceImpl implements ParkingService {

    private final ParkingLotRepository parkingLotRepository;
    private final ParkingHistoryRepository parkingHistoryRepository;
    private final UserRepository userRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final FirebaseCloudMessageService firebaseCloudMessageService;
    private final ChatService chatService;
    private final NotificationService notificationService;
    private final RedisUtils redisUtils;
    private final MileageService mileageService;

    // 입차 위치 정보 저장
    @Override
    public void createEntrance(EntranceRequest request) {
        // 주차 위치로 주차장 정보 가져오기
        String groundAddress = request.getGroundAddress();
        Optional<ParkingLot>  parkingLot = parkingLotRepository.findBySeatMacAddress(groundAddress, ACTIVE);
        if (parkingLot.isEmpty()) {
            throw new NotFoundException(ParkingLot.class, groundAddress);
        }

        // 해당 자리가 주차가 되어있는지 확인
        Optional<Long> parkingOptional = parkingHistoryRepository.findParkingHistoryBySeatMacAddress(groundAddress, ACTIVE);
        parkingOptional.ifPresent(s -> {
            throw new AlreadyExistException(ParkingHistory.class, groundAddress);
        });

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

    // 해당 사용자가 막 주차한 상태인지 확인(출차시간 입력x)
    @Override
    public ParkingNowResponse isParkingNow(String userId) {
        // 사용자 아이디로 해당 사용자가 현재 주차중인지 확인
        Optional<ParkingNowDto> parkingHistoryOptional = parkingHistoryRepository.findActiveByLoginId(userId);
        if (parkingHistoryOptional.isEmpty()) {
            throw new NotFoundException(ParkingHistory.class, userId);
        }

        if ("DISABLED".equals(parkingHistoryOptional.get().getActive())) {
            return ParkingNowResponse.builder()
                    .parkingNowFlag("FALSE")
                    .build();
        } else {
            return ParkingNowResponse.builder()
                    .parkingNowFlag("TRUE")
                    .seatNumber(parkingHistoryOptional.get().getSeatNumber())
                    .villaIdNumber(parkingHistoryOptional.get().getVillaIdNumber())
                    .build();
        }
    }

    // 출차시간 저장
    @Override
    public void createOutTime(EntranceOutTimeRequest request) {
        saveOutTime(request);
        
        String userId = request.getUserId();
        
        // 마일리지 적립
        mileageService.createMileage(GetMileageRequest.builder()
                        .loginId(userId)
                        .point(10)
                        .type("적립")
                        .description("출차시간 입력")
                        .build());
    }

    // 출차시간 수정
    @Override
    public void modifyOutTime(EntranceOutTimeRequest request) {
        String userId = request.getUserId();
        // 원래 출차시간 구하기
        Optional<OutTimeFrontNumberDto> parkingHistoryOptional = parkingHistoryRepository.findParkingHistoryByLoginId(userId, ACTIVE);
        if (parkingHistoryOptional.isEmpty()) {
            throw new NotFoundException(ParkingHistory.class, userId);
        }

        // redis에서 해당 차주의 원래 출차 시간들을 삭제하기
        String oldOutTime = parkingHistoryOptional.get()
                .getOutTime()
                .format(DateTimeFormatter.ofPattern("yyyy:MM:dd HH:mm:ss"));
        String oldOutTimeBeforeFifteen = parkingHistoryOptional.get()
                .getOutTime()
                .minusMinutes(15) // 15분전 출차 알림
                .format(DateTimeFormatter.ofPattern("yyyy:MM:dd HH:mm:ss"));

        redisUtils.deleteRedisKey(oldOutTime, userId);
        redisUtils.deleteRedisKey(oldOutTimeBeforeFifteen, userId);

        // 앞차가 있는지 확인
        int frontNumber = parkingHistoryOptional.get().getFrontNumber();
        if (frontNumber != 0) { // 앞차가 있다
            // 앞차에 차가 있는 지 확인
            Optional<String> loginIdOptional = parkingHistoryRepository.findLoginIdByVilla(parkingHistoryOptional.get().getIdNumber(), frontNumber, ACTIVE);
            
            // 앞차가 있다면 레디스에서 현재 차주의 출차시간(key)과 앞차주의 아이디(field)값을 넣어서 삭제
            loginIdOptional.ifPresent(s -> redisUtils.deleteRedisKey(oldOutTime, s));
        }

        // 변경된 시간으로 저장
        saveOutTime(request);
    }

    // 출차 저장
    @Override
    public void createExit(ExitRequest request) {
        // 사용자 맥 주소로 현재 주차 되어있는 위치를 가져와 업데이트 한다.
        // 사용자 맥주소로 주차 히스토리 가져오기
        Optional<ParkingHistory> parkingHistoryOptional = parkingHistoryRepository.findActiveByMacAddress(request.getMacAddress(), ACTIVE, ACTIVE);
        if (parkingHistoryOptional.isEmpty()) {
            throw new NotFoundException(ParkingHistory.class, request.getMacAddress());
        }
        
        // 주차 내역에서 출차시간보다 일찍 나갔다면 알람 설정 지우기
        LocalDateTime localDateTime = LocalDateTime.now();
        LocalDateTime outTime = parkingHistoryOptional.get().getOutTime();

        // 출차시간이 등록되어있지 않다면 그냥 바로 출차 진행
        if (outTime != null) {

            LocalDateTime outTimeBeforeFifteen = outTime.minusMinutes(15);
            Optional<User> userOptional = userRepository.findUserByMacAddress(request.getMacAddress(), ACTIVE);
            if (localDateTime.isBefore(outTime)) { // 출차시간보다 일찍 나갔을 때
                userOptional.ifPresent(s -> redisUtils.deleteRedisKey(outTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")), s.getLoginId()));

                // 앞차가 있다면 앞차 알림도 삭제
                Optional<ParkingLot> lotOptional = parkingHistoryRepository.findParkingLotByMacAddress(request.getMacAddress(), ACTIVE);
                if (lotOptional.isEmpty()) {
                    throw new NotFoundException(ParkingLot.class, request.getMacAddress());
                }
                if (lotOptional.get().getFrontNumber() > 0) { // 앞차가 있을 때
                    Optional<String> frontUserIdOptional = parkingHistoryRepository.findLoginIdByVilla(lotOptional.get().getVilla().getIdNumber(), lotOptional.get().getSeatNumber(), ACTIVE);
                    frontUserIdOptional.ifPresent(s -> redisUtils.deleteRedisKey(outTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")), s));
                }
            }
            if (localDateTime.isBefore(outTimeBeforeFifteen)) { // 출차시간 15분전보다도 일찍 나갔을 때
                userOptional.ifPresent(s -> redisUtils.deleteRedisKey(outTimeBeforeFifteen.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")), s.getLoginId()));
            }
        }
        
        // 주차 내역 정보 업데이트
        parkingHistoryRepository.updateParkingHistory(DISABLED, parkingHistoryOptional.get().getId());
    }

    @Override
    public List<ParkingHistoryResponse> showParkingLot(String villaIdNumber) {
        List<ParkingHistoryDetailDto> parkingHistoryDetailDtoList =  parkingHistoryRepository.findAllParkingLotByVillaIdAndLotId(villaIdNumber);
        List<ParkingHistoryResponse> list = new ArrayList<>();

        for (ParkingHistoryDetailDto parkingHistoryDetailDto : parkingHistoryDetailDtoList) {
            String outTime = null;
            if (parkingHistoryDetailDto.getOutTime() != null) outTime = parkingHistoryDetailDto.getOutTime().toString(); 
            list.add(ParkingHistoryResponse.builder()
                            .userId(parkingHistoryDetailDto.getUserId())
                            .seatNumber(parkingHistoryDetailDto.getSeatNumber())
                            .carNumber(parkingHistoryDetailDto.getCarNumber())
                            .outTime(outTime)
                            .active(parkingHistoryDetailDto.getActive().name())
                            .build());
        }
        return list;
    }

    // 각 주차장 자리마다 세부 정보 출력
    @Override
    public ParkingHistoryDetailResponse showDetailParkingLot(String villaIdNumber, String userId) {
        // 빌라와 주차장 아이디로 자리 번호마다 비어있는지 안 비어있는지 출력
        Optional<ParkingHistoryDetailDto> parkingHistoryDetailDtoOptional =  parkingHistoryRepository.findParkingLotBySeatNumberAndLoginId(villaIdNumber, userId);
        if (parkingHistoryDetailDtoOptional.isEmpty())
            throw new NotFoundException(ParkingHistoryDetailDto.class, userId);

        String frontUserId = "";
        String backUserId = "";
        String frontParkingFlag = "";
        String backParkingFlag = "";
        String frontOutTime = "";
        String backOutTime = "";
        int frontNumber = parkingHistoryDetailDtoOptional.get().getFrontNumber();
        int backNumber = parkingHistoryDetailDtoOptional.get().getBackNumber();

        // 앞 차 정보 넣기
        Optional<BackUserOutTimeDto> backUserOutTimeDtoOptionalFront = parkingHistoryRepository.findByParkingHistoryAndActive(villaIdNumber, frontNumber, ACTIVE);
        if (backUserOutTimeDtoOptionalFront.isEmpty()) {
            frontParkingFlag = "EMPTY";
        } else {
            frontParkingFlag = "FULL";
            frontUserId = backUserOutTimeDtoOptionalFront.get().getUserId();
            frontOutTime = backUserOutTimeDtoOptionalFront.get().getOutTime().toString();
        }

        // 뒤 차 정보 넣기
        Optional<BackUserOutTimeDto> backUserOutTimeDtoOptionalBack = parkingHistoryRepository.findByParkingHistoryAndActive(villaIdNumber, backNumber, ACTIVE);
        if (backUserOutTimeDtoOptionalBack.isEmpty()) {
            backParkingFlag = "EMPTY";
        } else {
            backParkingFlag = "FULL";
            backUserId = backUserOutTimeDtoOptionalBack.get().getUserId();
            backOutTime = backUserOutTimeDtoOptionalBack.get().getOutTime().toString();
        }

        return ParkingHistoryDetailResponse.builder()
                .userId(parkingHistoryDetailDtoOptional.get().getUserId())
                .outTime(parkingHistoryDetailDtoOptional.get().getOutTime().toString())
                .carNumber(parkingHistoryDetailDtoOptional.get().getCarNumber())
                .frontUserId(frontUserId)
                .backUserId(backUserId)
                .frontParkingFlag(frontParkingFlag)
                .backParkingFlag(backParkingFlag)
                .frontOutTime(frontOutTime)
                .backOutTime(backOutTime)
                .frontCarNumber(parkingHistoryDetailDtoOptional.get().getFrontNumber())
                .backCarNumber(parkingHistoryDetailDtoOptional.get().getBackNumber())
                .build();
    }
    
    public void saveOutTime(EntranceOutTimeRequest request) {
        String villaIdNumber = request.getVillaIdNumber();
        String userId = request.getUserId();
        int seatNumber = request.getSeatNumber();
        String outTime = request.getOutTime();

        // 자리번호와 사용자 아이디로 해당 주차내역 식별키 가져오기
        Optional<ParkingHistory> parkingHistoryOptional = parkingHistoryRepository.findAllBySeatNumberAndLoginId(seatNumber, userId, ACTIVE);

        if (parkingHistoryOptional.isEmpty()) {
            throw new NotFoundException(ParkingHistory.class, seatNumber);
        }

        // 가져온 식별키로 출차시간 수정하기
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        LocalDateTime dateTime = LocalDateTime.parse(outTime, formatter);

        parkingHistoryRepository.updateOutTime(dateTime, parkingHistoryOptional.get().getId());
        
        notifyToCarOwner(ExitTimeDto.builder()
                .villaIdNumber(villaIdNumber)
                .seatNumber(seatNumber)
                .outTime(outTime)
                .loginId(userId)
                .build());

        notifyToBackNumber(ExitTimeDto.builder()
                .villaIdNumber(villaIdNumber)
                .seatNumber(seatNumber)
                .outTime(outTime)
                .loginId(userId)
                .build());
    }

    public void notifyToCarOwner(ExitTimeDto exitTimeDto) {
        String outTimeStr = exitTimeDto.getOutTime();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
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

    public void notifyToBackNumber(ExitTimeDto exitTimeDto) {
        String villaIdNumber = exitTimeDto.getVillaIdNumber();
        int seatNumber = exitTimeDto.getSeatNumber();
        String outTimeStr = exitTimeDto.getOutTime();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        LocalDateTime outTime = LocalDateTime.parse(outTimeStr, formatter);

        // 주차 위치로 주차장 정보 가져오기
        Optional<ParkingLot> parkingLotOptional = parkingLotRepository.findBySeatNumber(villaIdNumber, seatNumber, ACTIVE);
        if (parkingLotOptional.isEmpty()) {
            throw new NotFoundException(ParkingLot.class, seatNumber);
        }

        // 주차 위치 정보로부터 뒤차가 있을 경우 해당 차의 출차시간에 맞춰 알람을 보낸다.
        int backNumber = parkingLotOptional.get().getBackNumber();
        if (backNumber != 0) {
            // 뒤차 정보 -> 뒤차의 자리 번호와 빌라 식별키로 해당 주차장 식별키를 알아내 주차장 히스토리에 현재 주차되어 있는 차를 찾음
            Optional<BackUserOutTimeDto> backLoginIdOptional = parkingHistoryRepository.findByParkingHistoryAndActive(villaIdNumber, backNumber, ACTIVE);
            
            if (backLoginIdOptional.isPresent()) {

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
    }
    
    // 유저에게 출차시간 알림 주기(15분전, 출차시간이 됐을 때)
    @Scheduled(cron = "0 0/1 * * * ?")
    public void notifyOutTimeToUser() {

//        // ======================test==============================
//        chatService.createSystemRoom(SystemChatRoomRequest.builder().userId("testuser2").build());
//        String outTimeStr = "2023-08-10 12:02";
//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
//        LocalDateTime outTime = LocalDateTime.parse(outTimeStr, formatter);
//        notificationService.createNotification(CreateNotificationRequest.builder()
//                .loginId("testuser2")
//                .notiTime(outTime)
//                .message(EXIT_TIME_REMINDER)
//                .build());
//        // ======================test==============================

        
        LocalDateTime localDateTime = LocalDateTime.now();
        String notiTime = localDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));

        Map<String, String> entries = redisUtils.getRedisHash(notiTime);

        System.out.println("entries = " + entries);

        for (String field : entries.keySet()) {
            String value = entries.get(field);
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
