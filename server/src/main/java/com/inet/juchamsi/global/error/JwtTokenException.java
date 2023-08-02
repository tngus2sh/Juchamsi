package com.inet.juchamsi.global.error;

import com.inet.juchamsi.global.util.MessageUtils;
import org.apache.commons.lang3.StringUtils;

public class JwtTokenException extends ServiceRuntimeException {

    static final String MESSAGE_KEY = "error.jwttoken";
    static final String MESSAGE_DETAILS = "error.jwttoken.details";

    public JwtTokenException(Class cls, Object... values) {
        this(cls.getSimpleName(), values);
    }

    public JwtTokenException(String targetName, Object... values) {
        super(MESSAGE_KEY, MESSAGE_DETAILS, new String[]{targetName, (values != null && values.length > 0) ? StringUtils.join(values, ",") : ""});
    }

    @Override
    public String getMessage() {
        return MessageUtils.getMessage(getDetailKey(), getParams());
    }

    @Override
    public String toString() {
        return MessageUtils.getMessage(getMessageKey());
    }
}
