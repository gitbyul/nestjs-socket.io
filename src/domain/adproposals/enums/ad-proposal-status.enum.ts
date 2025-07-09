// 광고 제안 상태
/**
 * 계약 시나리오
 * 1. 광고주 제안(PROPOSED)
 * 2. 작가 수락(ACCEPTED_BY_AUTHOR)
 * 3. 광고주 수락(ACCEPTED_BY_ADVERTISER)
 * 4. 광고주 계약 완료(CONTRACT_COMPLETED_BY_ADVERTISER)
 * 5. 작가 계약 완료(CONTRACT_COMPLETED_BY_AUTHOR)
 *
 * 광고 현황 상태값
 * 1. 제안 대기(PROPOSED, ACCEPTED_BY_AUTHOR)
 * 2. 계약 대기(ACCEPTED_BY_ADVERTISER, CONTRACT_COMPLETED_BY_AUTHOR)
 * 3. 컨펌 대기(CONTRACT_COMPLETED_BY_ADVERTISER)
 * 4. 광고 집행(PUBLISHED)
 * 5. 제안 거절(CANCELED_BY_AUTHOR, CANCELED_BY_ADVERTISER)
 * 6. 거래 중단(CLOSED_ADVERTISER, CLOSED_AUTHOR)
 */
export enum AdProposalStatus {
  PROPOSED = 'PROPOSED', // 제안됨(Only 광고주)
  PUBLISHED = 'PUBLISHED', // 광고 게시됨(Only 작가)

  // 광고주, 작가
  REVISION_REQUESTED = 'REVISION_REQUESTED', // 제안서수청(광고주가 작가에게 제안서 수정 요청)
  ACCEPTED_BY_AUTHOR = 'ACCEPTED_BY_AUTHOR', // 작가 제안 수락(작가가 광고주의 제안을 수락)
  ACCEPTED_BY_ADVERTISER = 'ACCEPTED_BY_ADVERTISER', // 광고주 제안 수락(광고주가 작가의 제안을 수락)
  CONTRACT_COMPLETED_BY_AUTHOR = 'CONTRACT_COMPLETED_BY_AUTHOR', // 작가 계약 완료
  CONTRACT_COMPLETED_BY_ADVERTISER = 'CONTRACT_COMPLETED_BY_ADVERTISER', // 광고주 계약 완료
  CANCELED_BY_AUTHOR = 'CANCELED_BY_AUTHOR', // 작가 제안 거절/취소(작가가 광고주에게 제안서 거절/취소)
  CANCELED_BY_ADVERTISER = 'CANCELED_BY_ADVERTISER', // 광고주 제안 거절/취소(광고주가 작가에게 제안서 거절/취소)

  // 중재자 요청(광고주, 작가 공통)
  MEDIATION_REQUESTED = 'MEDIATION_REQUESTED', // 관리자(크로우) 중재요청 대기
  MEDIATION_COMPLETED = 'MEDIATION_COMPLETED', // 관리자(크로우) 중재요청 완료
  MEDIATION_CANCELED = 'MEDIATION_CANCELED', // 관리자(크로우) 중재요청 취소

  // 관리자만 선택가능
  CLOSED_AUTHOR = 'CLOSED_AUTHOR', // 계약 종료(작가)
  CLOSED_ADVERTISER = 'CLOSED_ADVERTISER', // 계약 종료(광고주)
}
