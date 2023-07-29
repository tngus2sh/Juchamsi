package com.inet.juchamsi.global.util;

import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class ValidationUtil {

    // 문자 인증번호 생성 : 랜덤 숫자 6자리
    public String createCode() {
        Random rand = new Random();
        String numStr = "";

        for (int i = 0; i < 6; i++) {
            String ran = Integer.toString(rand.nextInt(10));
            numStr += ran;
        }

        return numStr;
    }
}
