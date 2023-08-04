package com.inet.juchamsi.domain.notification.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;
import org.springframework.data.redis.core.index.Indexed;

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

    private String message;

    @TimeToLive(unit = TimeUnit.SECONDS)
    private Long timeToLive;


    public  TimeNotification() {}

    @Builder
    public TimeNotification(String loginId, LocalDateTime outTime, String message, Long timeToLive) {
        this.loginId = loginId;
        this.outTime = outTime;
        this.message = message;
        this.timeToLive = timeToLive;
    }
}
