package com.inet.juchamsi.domain.chat.dao;

import com.inet.juchamsi.domain.chat.entity.ChatPeople;
import com.inet.juchamsi.domain.chat.entity.Status;
import com.inet.juchamsi.global.common.Active;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ChatPeopleRepository extends JpaRepository<ChatPeople, Long> {
    // room_id, user_id를 사용해서 채팅방 식별키 가져오기
    @Query("select cp from ChatPeople cp left join cp.user u left join cp.chatRoom cr where u.loginId=:loginId and cr.roomId=:roomId and u.active=:active and cr.status=:status")
    Optional<ChatPeople> findIdByRoomIdAndUserId(@Param("loginId") String loginId, @Param("roomId") String roomId, @Param("active") Active active, @Param("status") Status status);

}
