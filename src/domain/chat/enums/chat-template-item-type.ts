// 채팅 템플릿 타입
export enum ChatTemplateType {
  TEMPLATE = 'TEMPLATE',
  BUTTON = 'BUTTON',
  NOTICE = 'NOTICE',
}

// 채팅 템플릿 알림/경고/경고문 타입
export type ChatTemplateNoticeType = 'NOTICE' | 'WARNING' | 'ALERT';
export enum ChatTemplateNoticeEnum {
  NOTICE = 'NOTICE', // 공지 (회색)
  WARNING = 'WARNING', // 경고 (빨강)
  ALERT = 'ALERT', // 알림 (파랑)
}

// 채팅 템플릿 버튼 위치 타입
export type ChatTemplateButtonLocationType = 'LEFT' | 'RIGHT' | 'FULL';
export enum ChatTemplateButtonLocationEnum {
  LEFT = 'LEFT', // 왼쪽
  RIGHT = 'RIGHT', // 오른쪽
  FULL = 'FULL', // 전체
}
