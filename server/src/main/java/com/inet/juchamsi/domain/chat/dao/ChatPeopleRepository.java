package com.inet.juchamsi.domain.chat.dao;

import com.inet.juchamsi.domain.chat.entity.ChatPeople;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatPeopleRepository extends JpaRepository<ChatPeople, Long> {
}
