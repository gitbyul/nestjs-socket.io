import { ChatRooms } from '../entity/ChatRooms.entity';
import { EventErrorCode } from '../enums/chat-error-code.enum';
import {
  EventChatRoom,
  EventConnection,
  EventHeartBeat,
  EventMessage,
} from '../enums/chat-event-type.enum';
import { ChatMessageType } from '../enums/chat-message-type.enum';
import { ConnectionStatus } from '../enums/connection-state.enum';

export type EventPayloadMap = {
  // 연결 관련
  [EventConnection.CONNECTION_ESTABLISHED]: {
    userId: string;
    status: ConnectionStatus.CONNECTED;
    timestamp: Date;
  };
  [EventConnection.CONNECTION_FAILED]: void;
  [EventConnection.DISCONNECTED]: void;

  // Heartbeat 관련
  [EventHeartBeat.HEARTBEAT]: void;
  [EventHeartBeat.HEARTBEAT_SUCCESS]: {
    userId: string;
    socketId: string;
    timestamp: Date;
  };
  [EventHeartBeat.HEARTBEAT_FAILED]: {
    code: EventErrorCode;
    message: string;
    timestamp: Date;
  };

  // 채팅방 관련
  [EventChatRoom.GET_CHAT_ROOMS]: void;
  [EventChatRoom.GET_CHAT_ROOMS_SUCCESS]: {
    chatRooms: ChatRooms[];
    timestamp: Date;
  };
  [EventChatRoom.GET_CHAT_ROOMS_FAILED]: void;

  // 메시지 관련
  [EventMessage.SEND_MESSAGE]: void;
  [EventMessage.NEW_MESSAGE]: void;
  [EventMessage.MESSAGE_SENT]: {
    chatRoomId: string;
    messageId: string;
    message: string;
    type: ChatMessageType;
    createdAt: Date;
  };
  [EventMessage.MESSAGE_FAILED]: void;
};
