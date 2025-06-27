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
  //
  //   [ChatEventType.CONNECTION_ESTABLISHED]: {
  //     userId: string;
  //     status: ConnectionStatus.CONNECTED;
  //     timestamp: Date;
  //   };
  //   [ChatEventType.CONNECTION_FAILED]: void;
  //   [ChatEventType.DISCONNECTED]: void;
  //
  //   [ChatEventType.HEARTBEAT]: void;
  //   [ChatEventType.HEARTBEAT_SUCCESS]: {
  //     userId: string;
  //     socketId: string;
  //     timestamp: Date;
  //   };
  //   [ChatEventType.HEARTBEAT_FAILED]: {
  //     code: EventErrorCode;
  //     message: string;
  //     timestamp: Date;
  //   };
  //   // 채팅방 관련
  //   [ChatEventType.GET_CHAT_ROOMS]: void;
  //   [ChatEventType.GET_CHAT_ROOMS_SUCCESS]: {
  //     chatRooms: ChatRooms[];
  //   };
  //   //   [ChatEventType.JOIN_CHAT_ROOM]: void; // 클라이언트 → 서버: 채팅방 참여 요청
  //   //   [ChatEventType.LEAVE_CHAT_ROOM]: void; // 클라이언트 → 서버: 채팅방 퇴장 요청
  //   //   [ChatEventType.CHAT_ROOM_JOINED]: void; // 서버 → 클라이언트: 채팅방 참여 완료 알림
  //   //   [ChatEventType.CHAT_ROOM_LEFT]: void; // 서버 → 클라이언트: 채팅방 퇴장 완료 알림
  //   // 메시지 관련
  //   [ChatEventType.NEW_MESSAGE]: {
  //     messageId: string;
  //     chatRoomId: string;
  //     senderId: string;
  //     senderType: string;
  //     message: string;
  //     type: string;
  //     createdAt: Date;
  //   };
  //   [ChatEventType.SEND_MESSAGE]: { chatRoomId: string; message: string }; // 클라이언트 → 서버: 메시지 전송 요청
  //   [ChatEventType.MESSAGE_SENT]: {
  //     chatRoomId: string;
  //     messageId: string;
  //     message: string;
  //     type: string;
  //     createdAt: Date;
  //   }; // 서버 → 클라이언트: 메시지 전송 완료 알림
  //   [ChatEventType.MESSAGE_FAILED]: {
  //     code: EventErrorCode;
  //     message: string;
  //     timestamp: Date;
  //   };
  //   // 읽음 관련
  //   [ChatEventType.MARK_AS_READ]: { messageId: string };
  //   [ChatEventType.MESSAGE_READ]: void;
  //   // 상태 관련
  //   [ChatEventType.USER_ONLINE]: { userId: string };
  //   [ChatEventType.USER_OFFLINE]: { userId: string };
};
