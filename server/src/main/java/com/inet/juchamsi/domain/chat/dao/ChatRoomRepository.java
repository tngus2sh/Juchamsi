package com.inet.juchamsi.domain.chat.dao;

import com.inet.juchamsi.domain.chat.dto.service.ChatRoomUserDto;
import com.inet.juchamsi.domain.chat.entity.ChatPeople;
import com.inet.juchamsi.domain.chat.entity.ChatRoom;
import com.inet.juchamsi.domain.chat.entity.Status;
import com.inet.juchamsi.domain.chat.entity.Type;
import com.inet.juchamsi.domain.user.entity.User;
import com.inet.juchamsi.global.common.Active;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    // userIdOne과 userIdTwo에 해당하는 채팅룸이 있는지 확인
    @Query("select cr.id from ChatPeople cp left join cp.user u left join cp.chatRoom cr where (u.loginId=:userIdOne or u.loginId=:userIdTwo) and u.active=:active and cr.type=:type")
    Optional<Long> existChatRoomByUserId(@Param("userIdOne") String userIdOne, @Param("userIdTwo") String userIdTwo, @Param("active") Active active, @Param("type") Type type);

    // 채팅방 생성 순서 최근 순으로 반환
    @Query("select new com.inet.juchamsi.domain.chat.dto.service.ChatRoomUserDto(u.carNumber, cr.roomId, cr.roomName) from ChatPeople cp left join cp.user u left join cp.chatRoom cr where u.loginId=:loginId and u.active=:active and cr.status=:status order by cr.createdDate desc")
    List<ChatRoomUserDto> findAllRoomsByLoginIdAndStatus(@Param("loginId") String loginId, @Param("active") Active active, @Param("status") Status status);

    @Query("select new com.inet.juchamsi.domain.chat.dto.service.ChatRoomUserDto(u.carNumber, cr.roomId, cr.roomName) from ChatPeople cp left join cp.user u left join cp.chatRoom cr where cr.roomId=:roomId and cr.status=:status")
    List<ChatRoomUserDto> findChatRoomByIdAndLoginIdAndStatus(@Param("roomId") String roomId, @Param("status") Status status);

    @Query("select cr.id from ChatPeople cp left join cp.user u left join cp.chatRoom cr where u.loginId=:loginId and u.active=:active and cr.status=:status and cr.type=:type")
    Optional<Long> findIdByloginIdAndActive(@Param("loginId") String loginId, @Param("active") Active active, @Param("status") Status status, @Param("type") Type type);

    // 사용자의 loginId와 채팅방 유형으로 roomId 반환
    @Query("select cr.roomId from ChatPeople cp left join cp.user u left  join cp.chatRoom cr where u.loginId=:loginId and cr.type=:type and cr.status=:status")
    Optional<String> findRoomIdByLoginIdAndType(@Param("loginId") String loginId, @Param("type") Type type, @Param("status") Status status);

    // roomId로 채팅방 사용자들 목록 가져오기
    @Query("select u from ChatPeople cp left join cp.user u left join cp.chatRoom cr where cr.roomId=:roomId and cr.status=:status")
    List<User> findChatPeopleByRoomIdAndStatus(@Param("roomId") String roomId, @Param("status") Status status);

    @Modifying(clearAutomatically = true)
    @Query("update ChatRoom cr set cr.status=:status where cr.id=:id and cr.type=:type")
    Optional<Void> updateStatus(@Param("id") Long id, @Param("status") Status status, @Param("type") Type type);

}