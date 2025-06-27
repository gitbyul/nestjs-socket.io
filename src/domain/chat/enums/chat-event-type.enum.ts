export type EventType =
  | EventConnection
  | EventHeartBeat
  | EventChatRoom
  | EventMessage;

export enum EventConnection {
  CONNECTION_ESTABLISHED = 'connection_established', // 연결 성공
  CONNECTION_FAILED = 'connection_failed', // 연결 실패
  DISCONNECTED = 'disconnected', // 연결 해제
}

export enum EventHeartBeat {
  HEARTBEAT = 'heartbeat', // 하트비트
  HEARTBEAT_SUCCESS = 'heartbeat_success', // 하트비트 성공
  HEARTBEAT_FAILED = 'heartbeat_failed', // 하트비트 실패
}

export enum EventChatRoom {
  GET_CHAT_ROOMS = 'get_chat_rooms', // 채팅방 목록 조회
  GET_CHAT_ROOMS_SUCCESS = 'get_chat_rooms_success', // 채팅방 목록 조회 성공
  GET_CHAT_ROOMS_FAILED = 'get_chat_rooms_failed', // 채팅방 목록 조회 실패
}

export enum EventMessage {
  SEND_MESSAGE = 'send_message', // 메시지 전송
  MESSAGE_SENT = 'message_sent', // 메시지 전송 성공
  MESSAGE_FAILED = 'message_failed', // 메시지 전송 실패
  NEW_MESSAGE = 'new_message', // 새 메시지 수신
}
