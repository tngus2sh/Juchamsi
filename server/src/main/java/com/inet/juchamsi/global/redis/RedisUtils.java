package com.inet.juchamsi.global.redis;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisUtils {

    private final RedisTemplate<String, String> redisTemplate;
    private final StringRedisTemplate stringRedisTemplate;
    private final ObjectMapper objectMapper;

    public void setRedisValue(String key, Object o, Long ttl) throws JsonProcessingException {
        redisTemplate.opsForValue().set(key, objectMapper.writeValueAsString(o),  ttl, TimeUnit.SECONDS);
    }

    public void setRedisHash(String key, String loginId, String message, Long ttl) {
        HashOperations<String, String, String> hashOperations = stringRedisTemplate.opsForHash();
        hashOperations.put(key, loginId, message);
        stringRedisTemplate.expire(key, ttl, TimeUnit.SECONDS);
    }

    public <T> T getRedisValue(String key, Class<T> classType) throws JsonProcessingException {
        String redisValue = redisTemplate.opsForValue().get(key);

        return objectMapper.readValue(redisValue, classType);
    }

    public Map<String, String> getRedisHash(String key) {
        HashOperations<String, String, String> hashOperations = stringRedisTemplate.opsForHash();
        return hashOperations.entries(key);
    }
}
