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
  HEARTBEAT = 'heartbeat', // 하트비트 [ 클라이언트 -> 서버 ]
  HEARTBEAT_SUCCESS = 'heartbeat_success', // 하트비트 성공 [ 서버 -> 클라이언트 ]
  HEARTBEAT_FAILED = 'heartbeat_failed', // 하트비트 실패 [ 서버 -> 클라이언트 ]
}

export enum EventChatRoom {
  GET_CHAT_ROOMS = 'get_chat_rooms', // 채팅방 목록 조회 [ 클라이언트 -> 서버 ]
  GET_CHAT_ROOMS_SUCCESS = 'get_chat_rooms_success', // 채팅방 목록 조회 성공 [ 서버 -> 클라이언트 ]
  GET_CHAT_ROOMS_FAILED = 'get_chat_rooms_failed', // 채팅방 목록 조회 실패 [ 서버 -> 클라이언트 ]
}

export enum EventMessage {
  SEND_MESSAGE = 'send_message', // 메시지 전송 [ 클라이언트 -> 서버 ]
  SEND_MESSAGE_SUCCESS = 'send_message_success', // 메시지 전송 성공 [ 서버 -> 클라이언트 ]
  SEND_MESSAGE_FAILED = 'send_message_failed', // 메시지 전송 실패 [ 서버 -> 클라이언트 ]
  NEW_MESSAGE = 'new_message', // 새 메시지 수신 [ 서버 -> 클라이언트 ]
  READ_MESSAGE = 'read_message', // 메시지 읽음 처리 [ 클라이언트 -> 서버 ]
  READ_MESSAGE_SUCCESS = 'read_message_success', // 메시지 읽음 처리 성공 [ 서버 -> 클라이언트 ]
  READ_MESSAGE_FAILED = 'read_message_failed', // 메시지 읽음 처리 실패 [ 서버 -> 클라이언트 ]
  UNREAD_COUNT_UPDATED = 'unread_count_updated', // 읽지 않은 메시지 수 업데이트 [ 서버 -> 클라이언트 ]
  UNREAD_COUNT_SUMMARY = 'unread_count_summary', // 읽지 않은 메시지 수 요약 (연결 시 전체 요약)[ 서버 -> 클라이언트 ]
}
