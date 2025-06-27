import {
  EventChatRoom,
  EventHeartBeat,
  EventMessage,
} from '../enums/chat-event-type.enum';

// 핸들러 -> 이벤트 매핑
export type HandlerEventMap = {
  // Heartbeat 관련
  heartbeat: EventHeartBeat.HEARTBEAT;

  // 채팅방 관련
  getChatRooms: EventChatRoom.GET_CHAT_ROOMS;

  // 메시지 관련
  sendMessage: EventMessage.SEND_MESSAGE;
  readMessage: EventMessage.READ_MESSAGE;
};
