import {
  EventChatRoom,
  EventConnection,
  EventHeartBeat,
  EventMessage,
} from '../enums/chat-event-type.enum';

// 이벤트 -> 실패 이벤트 매핑
export type EventFailEventMap = {
  // 연결 관련
  [EventConnection.CONNECTION_ESTABLISHED]: EventConnection.CONNECTION_FAILED;

  // Heartbeat 관련
  [EventHeartBeat.HEARTBEAT]: EventHeartBeat.HEARTBEAT_FAILED;

  // 채팅방 관련
  [EventChatRoom.GET_CHAT_ROOMS]: EventChatRoom.GET_CHAT_ROOMS_FAILED;

  // 메시지 관련
  [EventMessage.SEND_MESSAGE]: EventMessage.SEND_MESSAGE_FAILED;
  [EventMessage.READ_MESSAGE]: EventMessage.READ_MESSAGE_FAILED;
};
