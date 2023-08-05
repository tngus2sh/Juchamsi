package com.inet.juchamsi.domain.chat.dao;

import com.inet.juchamsi.domain.chat.dto.response.ChatRoomUserResponse;
import com.inet.juchamsi.domain.chat.entity.ChatRoom;
import com.inet.juchamsi.domain.chat.entity.Status;
import com.inet.juchamsi.domain.chat.entity.Type;
import com.inet.juchamsi.global.common.Active;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    // userIdOne과 userIdTwo에 해당하는 채팅룸이 있는지 확인
    @Query("select cr.id from ChatPeople cp left join cp.user u left join cp.chatRoom cr where u.loginId=:userIdOne or u.loginId=:userIdTwo and u.active=:active and cr.type=:type")
    Optional<Long> existChatRoomByUserId(@Param("userIdOne") String userIdOne, @Param("userIdTwo") String userIdTwo, @Param("active") Active active, @Param("type") Type type);

    // 채팅방 생성 순서 최근 순으로 반환
    @Query("select new com.inet.juchamsi.domain.chat.dto.response.ChatRoomUserResponse(u.carNumber, cr.roomId, cr.roomName) from ChatPeople cp left join cp.user u left join cp.chatRoom cr where u.loginId=:loginId and u.active=:active and cr.status=:status order by cr.createdDate desc")
    List<ChatRoomUserResponse> findAllRoomsByLoginIdAndStatus(@Param("loginId") String loginId, @Param("active") Active active, @Param("status") Status status);

    @Query("select new com.inet.juchamsi.domain.chat.dto.response.ChatRoomUserResponse(u.carNumber, cr.roomId, cr.roomName) from ChatPeople cp left join cp.user u left join cp.chatRoom cr where cr.roomId=:roomId and cr.status=:status")
    List<ChatRoomUserResponse> findChatRoomByIdAndLoginIdAndStatus(@Param("roomId") String roomId, @Param("status") Status status);
}