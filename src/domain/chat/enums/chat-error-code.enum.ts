export enum EventErrorCode {
  // 인증 관련
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED', // 인증 실패

  // 사용자 관련
  USER_NOT_FOUND = 'USER_NOT_FOUND', // 유저 조회 실패

  // 채팅방 관련
  CHAT_ROOM_NOT_FOUND = 'CHAT_ROOM_NOT_FOUND', // 채팅방 조회 실패
  CHAT_ROOM_NOT_ALIVE = 'CHAT_ROOM_NOT_ALIVE', // 채팅방 비활성화

  // 메시지 관련
  CHAT_MESSAGE_NOT_FOUND = 'CHAT_MESSAGE_NOT_FOUND', // 메시지 조회 실패

  // 채팅방 멤버 관련
  CHAT_ROOM_MEMBER_NOT_FOUND = 'CHAT_ROOM_MEMBER_NOT_FOUND', // 채팅방 멤버 조회 실패
  CHAT_ROOM_MEMBER_READ_MESSAGE_ORDER_INVALID = 'CHAT_ROOM_MEMBER_READ_MESSAGE_ORDER_INVALID', // 저장되어 있던 과거 메세지가 입력받은 메세지보다 신규 메세지 인 경우 예외 발생
  CHAT_ROOM_MEMBER_READ_MESSAGE_SAME_ID = 'CHAT_ROOM_MEMBER_READ_MESSAGE_SAME_ID', // 입력받은 메세지가 기존 메세지와 동일한 경우 예외 발생

  // 유효성 검사 관련
  VALIDATION_FAILED = 'VALIDATION_FAILED', // 유효성 검사 실패

  // 시스템 관련
  INTERNAL_ERROR = 'INTERNAL_ERROR', // 시스템 오류
}
