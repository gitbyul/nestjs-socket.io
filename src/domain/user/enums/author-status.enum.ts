export enum AuthorStatus {
  NORMAL = 'NORMAL', // 정상(활동 중)
  PENDING = 'PENDING', // 대기(심사/승인 대기)
  HIDDEN = 'HIDDEN', // 숨김(비공개, 비활성)
  PREPARING = 'PREPARING', // 준비 중(프로필/정보 준비 등)
  REJECTED = 'REJECTED', // 거절(심사 탈락 등)
  PICKING = 'PICKING', // 선정(특정 이벤트/추천 등)
  DELETED = 'DELETED', // 삭제(탈퇴 등)
}
