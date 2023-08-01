package com.inet.juchamsi.domain.chat.api;

import com.inet.juchamsi.domain.chat.dto.request.ChatMessageRequest;
import com.inet.juchamsi.global.api.ApiResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.RestController;

import static com.inet.juchamsi.global.api.ApiResult.OK;

@RestController
@RequiredArgsConstructor
@Api(tags = "메세지")
public class MessageApiController {
    
    private final SimpMessageSendingOperations sendingOperations;
    
    @ApiOperation(value = "메세지 전송")
    @MessageMapping("/chat/message")
    public ApiResult<Void> enter(
            @ApiParam(value = "ChatMessageRequest")
            ChatMessageRequest request
    ) {
        if (ChatMessageRequest.MessageType.ENTER.equals(request.getType())) {
            request.setMessage(request.getSender() + "님이 입장하셨습니다.");
        }
        // topic-1대다, queue-1대1
        sendingOperations.convertAndSend("/topic/chat/room/"+ request.getRoomId(),request);
        
        // TODO: 메세지 내용 저장

        
        return OK(null);
    }
}
