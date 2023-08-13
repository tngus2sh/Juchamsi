package com.inet.juchamsi.domain.chat.dao;

import com.inet.juchamsi.domain.chat.dto.service.MessageChatRoomDto;
import com.inet.juchamsi.domain.chat.entity.Message;
import com.inet.juchamsi.domain.chat.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    // 해당 채팅방의 메세지 오래된 순으로 불러오기
    @Query("select new com.inet.juchamsi.domain.chat.dto.service.MessageChatRoomDto(u.loginId, u.carNumber, m.content, m.createdDate) from Message m left join m.chatPeople cp left join cp.chatRoom cr left join cp.user u where cr.roomId=:roomId and cr.status=:status order by m.createdDate asc ")
    List<MessageChatRoomDto> findAllByChatRoomIdAndStatus(@Param("roomId") String roomId, @Param("status") Status status);
}
