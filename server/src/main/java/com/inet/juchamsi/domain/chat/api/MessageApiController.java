package com.inet.juchamsi.domain.chat.api;

import com.inet.juchamsi.domain.chat.application.ChatService;
import com.inet.juchamsi.domain.chat.dto.request.ChatMessageRequest;
import com.inet.juchamsi.global.api.ApiResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.RestController;

import static com.inet.juchamsi.global.api.ApiResult.OK;

@RestController
@RequiredArgsConstructor
@Api(tags = "메세지")
public class MessageApiController {
    
    private final SimpMessageSendingOperations sendingOperations;
    private final ChatService chatService;

    @MessageMapping("/chat/message/{roomId}")
    public ApiResult<Void> enter(@DestinationVariable String roomId,  ChatMessageRequest request) { // @PathVariable이 아닌 @DestinationVariable로 roomId를 받아서 가져와야한다.
        if (ChatMessageRequest.MessageType.ENTER.equals(request.getType())) {
            request.setMessage(request.getSender() + "님이 입장하셨습니다.");
        }
        // topic-1대다, queue-1대1
        sendingOperations.convertAndSend("/topic/chat/room/"+ roomId,request);
        
        // 메세지 내용 저장
        chatService.createChat(roomId, request);
        
        return OK(null);
    }
}
