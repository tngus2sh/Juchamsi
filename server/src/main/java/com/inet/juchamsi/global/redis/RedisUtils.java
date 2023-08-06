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

    /**
     *
     * @param key "2023:08:04 12:34"
     * @param loginId "userId"
     * @param message "출차시간이 되었습니다."
     * @param ttl 만료시간
     */
    public void setRedisHash(String key, String loginId, String message, Long ttl) {
        HashOperations<String, String, String> hashOperations = stringRedisTemplate.opsForHash();
        hashOperations.put(key, loginId, message);
        stringRedisTemplate.expire(key, ttl, TimeUnit.SECONDS);
    }

    public <T> T getRedisValue(String key, Class<T> classType) throws JsonProcessingException {
        String redisValue = redisTemplate.opsForValue().get(key);

        return objectMapper.readValue(redisValue, classType);
    }

    /**
     *
     * @param key "2023:08:04 12:34"
     * @return loginId, message -> "userId", "출차시간이 되었습니다."
     */
    public Map<String, String> getRedisHash(String key) { // redis 디비 정보 가져오기
        HashOperations<String, String, String> hashOperations = stringRedisTemplate.opsForHash();
        return hashOperations.entries(key);
    }

    public void deleteRedisKey(String key, String loginId) {
        HashOperations<String, String, String> hashOperations = stringRedisTemplate.opsForHash();
        hashOperations.delete(key, loginId);
    }
}
