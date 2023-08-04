package com.inet.juchamsi.domain.notification.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.RedisKeyValueAdapter;
import org.springframework.data.redis.core.TimeToLive;
import org.springframework.data.redis.core.index.Indexed;

import javax.persistence.Id;
import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

//@AllArgsConstructor
@NoArgsConstructor
@Data
@RedisHash(value = "UpdateNotification")
public class UpdateNotification {

    @Id
    private String id;

    @Indexed
    private LocalDateTime outTime;

    @TimeToLive(unit = TimeUnit.SECONDS)
    private Long timeToLive;


    @Builder
    public UpdateNotification(String id, LocalDateTime outTime, Long timeToLive) {
        this.id = id;
        this.outTime = outTime;
        this.timeToLive = timeToLive;
    }
}
