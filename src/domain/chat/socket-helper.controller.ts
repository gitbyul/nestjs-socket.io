import { Body, Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseEntity } from 'src/config/entity/Response.entity';
import { ConnectionEstablishedResponseDto } from './dto/response/connection-established.response';
import { ConnectionFailedResponseDto } from './dto/response/connection-failed.response';
import { UnreadCountSummaryResponseDto } from './dto/response/unread-count-summary.response';
import { HeartbeatSuccessResponseDto } from './dto/response/heartbeat-success.response';
import { HeartbeatFailedResponseDto } from './dto/response/heartbeat-failed.response';
import { GetChatRoomsSuccessResponseDto } from './dto/response/get-chat-rooms-success.response';
import { GetChatRoomsFailedResponseDto } from './dto/response/get-chat-rooms-failed.response';
import { SendMessageRequestDto } from './dto/request/send-message.request';
import { SendMessageSuccessResponseDto } from './dto/response/send-message-success.response';
import { SendMessageFailedResponseDto } from './dto/response/send-message-failed.response';
import { NewMessageResponseDto } from './dto/response/new-message.response';
import { UnreadCountUpdatedResponseDto } from './dto/response/unread-count-update.response';
import { ReadMessageRequestDto } from './dto/request/read-message.request';
import { ReadMessageSuccessResponseDto } from './dto/response/read-message-success.response';
import { ReadMessageFailedResponseDto } from './dto/response/read-message-failed.response';
import { UnreadCountSummaryFailedResponseDto } from './dto/response/unread-count-summary-failed.response';
import { GetMessageSuccessResponseDto } from './dto/response/get-message-success.response';
import { GetMessageFailedResponseDto } from './dto/response/get-message-failed.response';

@Controller('socket-helper')
@ApiTags('SocketHelper')
export class SocketHelperController {
  @Get('/connection_helper')
  @ApiOperation({
    summary: '소켓 연결 방법',
    description: `
    Websocket 서버 연결 방법
    1. 소켓 연결 방법
    - query 파라미터 방식
      - wss://localhost:3000?token=Bearer <token>
    - header 파라미터 방식
      - Authorization: Bearer <token>
    - auth 파라미터 방식
      - const socket = io({ auth: { token: <token> }});
    `,
  })
  connectionHelper() {
    return ResponseEntity.success({
      message: 'Connection helper',
    });
  }

  @Get('/connection_established')
  @ApiOperation({
    summary: '소켓 연결 성공',
    description: `
    Websocket 서버 연결시 자동 호출 이벤트
    [성공 처리]
    - @websocketListener connection_established 소켓 연결 성공
    - @websocketListener get_chat_rooms_success 채팅방 목록 조회 성공
    - @websocketListener unread_count_summary_success 읽지 않은 메시지 수 요약
    [실패 처리]
    - @websocketListener connection_failed 소켓 연결 실패
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'connection_established (소켓 연결 성공) 이벤트 발송',
    type: ConnectionEstablishedResponseDto,
  })
  @ApiResponse({
    status: 201,
    description: 'get_chat_rooms_success (채팅방 목록 조회 성공) 이벤트 발송',
    type: Array<GetChatRoomsSuccessResponseDto>,
  })
  @ApiResponse({
    status: 202,
    description:
      'unread_count_summary_success (읽지 않은 메시지 수 요약) 이벤트 발송',
    type: UnreadCountSummaryResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'connection_failed (소켓 연결 실패) 이벤트 발송',
    type: ConnectionFailedResponseDto,
  })
  connectionEstablished() {
    return ResponseEntity.success({
      message: 'Connection established',
    });
  }

  @Get('/disconnected')
  @ApiOperation({
    summary: '소켓 연결 해제',
    description: `
    Websocket 서버 연결 해제시 자동 호출 이벤트
    [성공 처리]
    - @websocketListener disconnected 소켓 연결 해제
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'disconnected (소켓 연결 해제) 이벤트 발송',
    type: void 0,
  })
  disconnected() {
    return ResponseEntity.success({
      message: 'Disconnected',
    });
  }

  @Get('/heartbeat')
  @ApiOperation({
    summary: '하트비트',
    description: `
    Websocket 서버 하트비트 이벤트
    [성공 처리]
    - @websocketListener heartbeat_success 하트비트 성공
    [실패 처리]
    - @websocketListener heartbeat_failed 하트비트 실패
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'heartbeat_success (하트비트 성공) 이벤트 발송',
    type: HeartbeatSuccessResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'heartbeat_failed (하트비트 실패) 이벤트 발송',
    type: HeartbeatFailedResponseDto,
  })
  heartbeat() {
    return ResponseEntity.success({
      message: 'Heartbeat',
    });
  }

  @Get('/get_chat_rooms')
  @ApiOperation({
    summary: '채팅방 목록 조회',
    description: `
    Websocket 서버 채팅방 목록 조회 이벤트
    [성공 처리]
    - @websocketListener get_chat_rooms_success 채팅방 목록 조회 성공
    [실패 처리]
    - @websocketListener get_chat_rooms_failed 채팅방 목록 조회 실패
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'get_chat_rooms_success (채팅방 목록 조회 성공) 이벤트 발송',
    type: GetChatRoomsSuccessResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'get_chat_rooms_failed (채팅방 목록 조회 실패) 이벤트 발송',
    type: GetChatRoomsFailedResponseDto,
  })
  getChatRooms() {
    return ResponseEntity.success({
      message: 'Get chat rooms',
    });
  }

  @Get('/get_chat_message_list')
  @ApiOperation({
    summary: '채팅방 메시지 목록 조회',
    description: `
    Websocket 서버 채팅방 메시지 목록 조회 이벤트
    `,
  })
  @ApiResponse({
    status: 200,
    description:
      'get_chat_message_list_success (채팅방 메시지 목록 조회 성공) 이벤트 발송',
    type: GetMessageSuccessResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'get_chat_message_list_failed (채팅방 메시지 목록 조회 실패) 이벤트 발송',
    type: GetMessageFailedResponseDto,
  })
  getChatMessageList() {
    return ResponseEntity.success({
      message: 'Get chat message list',
    });
  }

  @Get('/send_message')
  @ApiOperation({
    summary: '메시지 전송',
    description: `
    Websocket 서버 메시지 전송 이벤트
    [성공 처리]
    - @websocketListener send_message_success 메시지 전송 성공
    - @websocketListener new_message 새 메시지 수신
    - @websocketListener unread_count_updated 읽지 않은 메시지 수 업데이트
    [실패 처리]
    - @websocketListener send_message_failed 메시지 전송 실패
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'send_message_success (메시지 전송 성공) 이벤트 발송',
    type: SendMessageSuccessResponseDto,
  })
  @ApiResponse({
    status: 201,
    description: 'new_message (새 메시지 수신) 이벤트 발송',
    type: NewMessageResponseDto,
  })
  @ApiResponse({
    status: 202,
    description:
      'unread_count_updated (읽지 않은 메시지 수 업데이트) 이벤트 발송',
    type: UnreadCountUpdatedResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: `send_message_failed (메시지 전송 실패) 이벤트 발송
    \n- USER_NOT_FOUND [유저 조회 실패]
    \n- CHAT_ROOM_NOT_FOUND [채팅방 조회 실패]
    \n- CHAT_MESSAGE_NOT_FOUND [메시지 조회 실패]
    `,
    type: SendMessageFailedResponseDto,
  })
  sendMessage(@Body() body: SendMessageRequestDto) {
    return ResponseEntity.success({
      message: 'Send message',
      body,
    });
  }

  @Get('/read_message')
  @ApiOperation({
    summary: '메시지 읽음 처리',
    description: `
    Websocket 서버 메시지 읽음 처리 이벤트
    [성공 처리]
    - @websocketListener read_message_success 메시지 읽음 처리 성공
    [실패 처리]
    - @websocketListener read_message_failed 메시지 읽음 처리 실패
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'read_message_success (메시지 읽음 처리 성공) 이벤트 발송',
    type: ReadMessageSuccessResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: `read_message_failed (메시지 읽음 처리 실패) 이벤트 발송
   \n- USER_NOT_FOUND [유저 조회 실패] 
   \n- CHAT_ROOM_NOT_FOUND [채팅방 조회 실패]
   \n- CHAT_MESSAGE_NOT_FOUND [메시지 조회 실패]
   \n- CHAT_ROOM_MEMBER_READ_MESSAGE_SAME_ID [메시지 읽음 처리 실패]
   \n- CHAT_ROOM_MEMBER_READ_MESSAGE_ORDER_INVALID [메시지 읽음 처리 실패]
    `,
    type: ReadMessageFailedResponseDto,
  })
  readMessage(@Body() body: ReadMessageRequestDto) {
    return ResponseEntity.success({
      message: 'Read message',
      body,
    });
  }

  @Get('/unread_count_summary')
  @ApiOperation({
    summary: '읽지 않은 메시지 수 요약 조회',
    description: `
    Websocket 서버 읽지 않은 메시지 수 요약 조회 이벤트
    [성공 처리]
    - @websocketListener unread_count_summary 읽지 않은 메시지 수 요약
    `,
  })
  @ApiResponse({
    status: 200,
    description:
      'unread_count_summary_success (읽지 않은 메시지 수 요약) 이벤트 발송',
    type: UnreadCountSummaryResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'unread_count_summary_failed (읽지 않은 메시지 수 요약 조회 실패) 이벤트 발송',
    type: UnreadCountSummaryFailedResponseDto,
  })
  getUnreadCountSummary() {
    return ResponseEntity.success({
      message: 'Get unread count summary',
    });
  }
}
