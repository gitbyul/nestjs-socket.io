export enum ConnectionStatus {
  CONNECTING = 'connecting', // 연결 중
  CONNECTED = 'connected', // 연결됨
  DISCONNECTED = 'disconnected', // 연결 해제됨
  RECONNECTING = 'reconnecting', // 재연결 중
  AWAY = 'away', // 자리 비움
  INACTIVE = 'inactive', // 비활성
}
