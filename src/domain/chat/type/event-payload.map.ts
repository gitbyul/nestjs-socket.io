import {
  EventChatRoom,
  EventConnection,
  EventHeartBeat,
  EventMessage,
} from '../enums/chat-event-type.enum';
import { ConnectionEstablishedResponseDto } from '../dto/response/connection-established.response';
import { ConnectionFailedResponseDto } from '../dto/response/connection-failed.response';
import { HeartbeatFailedResponseDto } from '../dto/response/heartbeat-failed.response';
import { HeartbeatSuccessResponseDto } from '../dto/response/heartbeat-success.response';
import { GetChatRoomsFailedResponseDto } from '../dto/response/get-chat-rooms-failed.response';
import { GetChatRoomsSuccessResponseDto } from '../dto/response/get-chat-rooms-success.response';
import { SendMessageRequestDto } from '../dto/request/send-message.request';
import { SendMessageSuccessResponseDto } from '../dto/response/send-message-success.response';
import { SendMessageFailedResponseDto } from '../dto/response/send-message-failed.response';
import { NewMessageResponseDto } from '../dto/response/new-message.response';
import { ReadMessageRequestDto } from '../dto/request/read-message.request';
import { ReadMessageSuccessResponseDto } from '../dto/response/read-message-success.response';
import { UnreadCountUpdatedResponseDto } from '../dto/response/unread-count-update.response';
import { UnreadCountSummaryResponseDto } from '../dto/response/unread-count-summary.response';
import { ReadMessageFailedResponseDto } from '../dto/response/read-message-failed.response';
import { UnreadCountSummaryFailedResponseDto } from '../dto/response/unread-count-summary-failed.response';

export type EventPayloadMap = {
  // 연결 관련
  [EventConnection.CONNECTION_ESTABLISHED]: ConnectionEstablishedResponseDto;
  [EventConnection.CONNECTION_FAILED]: ConnectionFailedResponseDto;
  [EventConnection.DISCONNECTED]: void;

  // Heartbeat 관련
  [EventHeartBeat.HEARTBEAT]: void;
  [EventHeartBeat.HEARTBEAT_SUCCESS]: HeartbeatSuccessResponseDto;
  [EventHeartBeat.HEARTBEAT_FAILED]: HeartbeatFailedResponseDto;

  // 채팅방 관련
  [EventChatRoom.GET_CHAT_ROOMS]: void;
  [EventChatRoom.GET_CHAT_ROOMS_SUCCESS]: GetChatRoomsSuccessResponseDto;
  [EventChatRoom.GET_CHAT_ROOMS_FAILED]: GetChatRoomsFailedResponseDto;

  // 메시지 관련
  [EventMessage.SEND_MESSAGE]: SendMessageRequestDto;
  [EventMessage.NEW_MESSAGE]: NewMessageResponseDto;
  [EventMessage.SEND_MESSAGE_SUCCESS]: SendMessageSuccessResponseDto;
  [EventMessage.SEND_MESSAGE_FAILED]: SendMessageFailedResponseDto;
  [EventMessage.READ_MESSAGE]: ReadMessageRequestDto;
  [EventMessage.READ_MESSAGE_SUCCESS]: ReadMessageSuccessResponseDto;
  [EventMessage.READ_MESSAGE_FAILED]: ReadMessageFailedResponseDto;
  [EventMessage.UNREAD_COUNT_UPDATED]: UnreadCountUpdatedResponseDto;
  [EventMessage.UNREAD_COUNT_SUMMARY]: void;
  [EventMessage.UNREAD_COUNT_SUMMARY_SUCCESS]: UnreadCountSummaryResponseDto;
  [EventMessage.UNREAD_COUNT_SUMMARY_FAILED]: UnreadCountSummaryFailedResponseDto;
};
