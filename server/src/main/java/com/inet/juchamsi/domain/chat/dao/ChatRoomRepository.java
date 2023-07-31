package com.inet.juchamsi.domain.chat.dao;

import com.inet.juchamsi.domain.chat.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    // 채팅방 생성 순서 최근 순으로 반환
    @Query("select c from ChatRoom c order by c.createdDate desc")
    List<ChatRoom> findAllRooms();

    @Query("select c from ChatRoom c where c.id=:id")
    Optional<ChatRoom> findChatRoomById(@Param("id") String id);
}
