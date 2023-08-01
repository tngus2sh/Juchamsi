package com.inet.juchamsi.domain.chat.api;

import com.inet.juchamsi.domain.chat.application.ChatService;
import com.inet.juchamsi.domain.chat.dto.request.ChatRoomRequest;
import com.inet.juchamsi.domain.chat.dto.request.SystemChatRoomRequest;
import com.inet.juchamsi.domain.chat.dto.response.ChatRoomResponse;
import com.inet.juchamsi.global.api.ApiResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.inet.juchamsi.domain.chat.entity.Type.GENERAL;
import static com.inet.juchamsi.global.api.ApiResult.OK;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/chat")
@Log4j2
@Api(tags = "채팅방")
public class ChatRoomApiController {

    private final ChatService chatService;

    // 모든 채팅리스트 목록 반환
    @ApiOperation(value = "모든 채팅리스트 목록 반환", notes = "loginId에 해당하는 회원의 채팅 목록을 반환한다.")
    @GetMapping("/rooms/{loginId}")
    public ApiResult<List<ChatRoomResponse>> showChatRoom(
            @ApiParam(value = "loginId")
            @PathVariable(value = "loginId") String loginId
    ) {
        log.debug("# get showChatRoom={}", loginId);
        return OK(chatService.showChatRoom(loginId));
    }

    /* 유저간 채팅방 */
    // 채팅방 생성
    // TODO: 채팅방 생성시 상대방과 현재 유저를 연결시켜야 함
    // TODO: 채팅방 이름이 상대방 이름이 되도록 해야함
    @PostMapping("/room")
    public ApiResult<ChatRoomResponse> createChatRoom(@RequestBody ChatRoomRequest request) {
        log.debug("# post createChatRoom={}", request);
        return OK(chatService.createRoom(request.getRoomName()));
    }

    // 특정 채팅방 조회
    @ApiOperation(value = "특정 회원의 채팅방 조회", notes = "roomId에 해당하는 방 정보를 가져온다.")
    @GetMapping("/room/{roomId}")
    public ApiResult<ChatRoomResponse> roomInfo(
            @ApiParam("room-id")
            @PathVariable("roomId") String roomId
    ) {
        log.debug("# get roomInfo={}", roomId);
        return OK(chatService.showDetailChatRoom(roomId));
    }

    /* 시스템 채팅방 */
    // 시스템 채팅방 생성
    // TODO: 시스템 채팅방 생성시에는 상대방 유저가 시스템이므로 상대방 설정을 어떻게 해야할지 생각할 것!
    // TODO: 시스템 채팅방 생성시기 정하기
    @ApiOperation(value = "시스템 채팅방 생성", notes = "request에 담겨진 userId에 해당하는 회원의 채팅방을 개설한다.")
    @PostMapping("/system/room")
    public ApiResult<ChatRoomResponse> createSystemChatRoom(
            @ApiParam(value = "userId")
            @RequestBody SystemChatRoomRequest request
    ) {
        log.debug("# post createSystemChatRoom");
        return OK(chatService.createSystemRoom(request));
    }
}
