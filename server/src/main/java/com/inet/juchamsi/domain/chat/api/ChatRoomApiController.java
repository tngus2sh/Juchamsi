package com.inet.juchamsi.domain.chat.api;

import com.inet.juchamsi.domain.chat.application.ChatService;
import com.inet.juchamsi.domain.chat.dto.request.ChatRoomRequest;
import com.inet.juchamsi.domain.chat.dto.request.SystemChatRoomRequest;
import com.inet.juchamsi.domain.chat.dto.response.ChatRoomResponse;
import com.inet.juchamsi.global.api.ApiResult;
import com.inet.juchamsi.global.error.AlreadyExistException;
import com.inet.juchamsi.global.error.NotFoundException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.inet.juchamsi.domain.chat.entity.Type.GENERAL;
import static com.inet.juchamsi.global.api.ApiResult.ERROR;
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
    @GetMapping("/rooms/{userId}")
    public ApiResult<List<ChatRoomResponse>> showChatRoom(
            @ApiParam(value = "userId")
            @PathVariable(value = "userId") String userId
    ) {
        log.debug("# get showChatRoom={}", userId);
        return OK(chatService.showChatRoom(userId));
    }

    // 특정 채팅방 조회
    @ApiOperation(value = "특정 회원의 채팅방 조회", notes = "roomId에 해당하는 방 정보를 가져온다.")
    @GetMapping("/room/{roomId}")
    public ApiResult<ChatRoomResponse> roomInfo(
            @ApiParam("room-id")
            @PathVariable("roomId") String roomId
    ) {
        log.debug("# get roomInfo={}", roomId);
        try {
            ChatRoomResponse respone = chatService.showDetailChatRoom(roomId);
            return OK(respone);
        } catch (NotFoundException e) {
            return ERROR("채팅룸을 찾을 수가 없습니다.", HttpStatus.NO_CONTENT);
        }
    }

    /* 유저간 채팅방 */
    // 채팅방 생성
    @ApiOperation(value = "유저간 채팅방 생성", notes = "request에 담겨진 userIdOne과 userIdTwo에 해당하는 회원의 채팅방을 개설한다.")
    @PostMapping("/room")
    public ApiResult<ChatRoomResponse> createChatRoom(
            @ApiParam(value = "userIdOne, userIdTwo - 두 사용자")
            @RequestBody ChatRoomRequest request) {
        log.debug("# post createChatRoom={}", request);
        try {
            ChatRoomResponse room = chatService.createRoom(request);
            return OK(room);
        } catch (NotFoundException e) {
            return ERROR("해당하는 회원이 없습니다.", HttpStatus.NO_CONTENT);
        } catch (AlreadyExistException e) {
            return ERROR("이미 존재하는 채팅방 입니다.", HttpStatus.ALREADY_REPORTED);
        }
    }

    /* 시스템 채팅방 */
    // 시스템 채팅방 생성
    @ApiOperation(value = "시스템 채팅방 생성", notes = "request에 담겨진 userId에 해당하는 회원의 채팅방을 개설한다.")
    @PostMapping("/system/room")
    public ApiResult<ChatRoomResponse> createSystemChatRoom(
            @ApiParam(value = "userId")
            @RequestBody SystemChatRoomRequest request
    ) {
        log.debug("# post createSystemChatRoom");
        try {
            ChatRoomResponse systemRoom = chatService.createSystemRoom(request);
            return OK(systemRoom);
        } catch (NotFoundException e) {
            return ERROR("해당하는 회원이 없습니다.", HttpStatus.NO_CONTENT);
        }
    }
}
