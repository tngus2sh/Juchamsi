package com.inet.juchamsi.domain.chat.api;

import com.inet.juchamsi.domain.chat.application.ChatService;
import com.inet.juchamsi.domain.chat.dto.request.ChatMessageRequest;
import com.inet.juchamsi.domain.chat.dto.request.SystemMessageRequest;
import com.inet.juchamsi.global.api.ApiResult;
import com.inet.juchamsi.global.error.NotFoundException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.RestController;

import static com.inet.juchamsi.global.api.ApiResult.ERROR;
import static com.inet.juchamsi.global.api.ApiResult.OK;

@RestController
@RequiredArgsConstructor
@Log4j2
@Api(tags = "메세지")
public class MessageApiController {
    
    private final SimpMessageSendingOperations sendingOperations;
    private final ChatService chatService;

    @MessageMapping("/chat/message")
    public ApiResult<Void> enter(ChatMessageRequest request) {
        String roomId = request.getRoomId();
        if (ChatMessageRequest.MessageType.ENTER.equals(request.getType())) {
            request.setMessage(request.getSenderId() + "님이 입장하셨습니다.");
        } else {
            // 메세지 내용 저장
            try {
                chatService.createChat(request);
                log.debug("createChat={}", request);
            } catch (NotFoundException e) {
                ERROR("사용자를 찾을 수 없습니다.", HttpStatus.BAD_REQUEST);
            }
        }
        // topic-1대다, queue-1대1
        sendingOperations.convertAndSend("/topic/chat/room/" + roomId, request);
        return OK(null);
    }
}
