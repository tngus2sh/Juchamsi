package com.inet.juchamsi.domain.chat.dao;

import com.inet.juchamsi.domain.chat.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {

}
