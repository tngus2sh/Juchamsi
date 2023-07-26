package com.inet.juchamsi.domain.chat.api;

import com.inet.juchamsi.domain.chat.dto.response.ChatResponse;
import com.inet.juchamsi.domain.chat.dto.response.ChatRoomResponse;
import com.inet.juchamsi.global.api.ApiResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chat")
@Slf4j
@RequiredArgsConstructor
@Api(tags = {"채팅 설정"})
public class ChatApiController {

    // 시스템 메세지 채팅룸 생성
    @ApiOperation(value = "시스템 채팅룸 생성", notes = "시스템 메세지를 보내는 채팅룸을 생성합니다.")
    @GetMapping("/room/{id}")
    public ApiResult<Void> createSystemChatRoom(
            @ApiParam(value = "tenant-id")
            @PathVariable(value = "id") String tenantId
    ) {
        return null;
    } 

    // 채팅룸 생성
    @ApiOperation(value = "채팅룸 생성", notes = "채팅룸을 생성합니다.")
    @GetMapping("/room/{id1}/{id2}")
    public ApiResult<Void> createChatRoom(
            @ApiParam(value = "tenant-id-1")
            @PathVariable(value = "id1") String tenantIdOne,
            @ApiParam(value = "tenant-id-2")
            @PathVariable(value = "id2") String tenantIdTwo
    ) {
        return null;
    }


    // 채팅룸 조회
    @ApiOperation(value = "채팅룸 조회", notes = "userId의 채팅방 전체 목록을 출력합니다.")
    @GetMapping("/{id}")
    public ApiResult<ChatRoomResponse> showChatRoom(
            @ApiParam(value = "tenant-id")
            @PathVariable(value = "id") String tenantId
    ) {
        return null;
    }

    // 채팅룸 상세 조회, 채팅 메세지 조회
    @ApiOperation(value = "채팅룸 상세 조회", notes = "userId의 채팅룸 상세 정보와 메세지들을 출력합니다.")
    @GetMapping("/{tenantId}/{chatId}")
    public ApiResult<ChatResponse> showDetailChatRoom(
            @ApiParam(value = "tenant-id")
            @PathVariable(value = "tenantId") String tenantId,
            @ApiParam(value = "chat-id")
            @PathVariable(value = "chatId") String chatId
    ) {
        return null;
    }

    // 채팅룸 삭제
    @ApiOperation(value = "채팅룸 삭제", notes = "chatId에 해당하는 채팅룸을 삭제합니다.")
    @DeleteMapping("/{id}")
    public ApiResult<Void> removeChatRoom(
            @ApiParam(value = "chat-id")
            @PathVariable(value = "chatId") String chatId
    ) {
        return null;
    }

    // 채팅 메세지 보내기

    // 채팅 메세지 저장
}
