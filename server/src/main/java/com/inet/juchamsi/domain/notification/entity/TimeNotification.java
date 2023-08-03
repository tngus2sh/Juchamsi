package com.inet.juchamsi.domain.notification.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;
import org.springframework.data.redis.core.index.Indexed;

import javax.persistence.Id;
import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

@AllArgsConstructor
@NoArgsConstructor
@Data
@RedisHash(value = "TimeNotification")
public class TimeNotification {

    @Id
    private String id;

    @Indexed
    private String loginId;

    @Indexed
    private LocalDateTime outTime;

    @TimeToLive(unit = TimeUnit.SECONDS)
    private Long timeToLive;
}
