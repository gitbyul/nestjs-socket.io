INSERT INTO instatoon_dev.chat_templates (id,code,`type`,action_type,title,content,url,is_link,is_file,`order`,created_at,updated_at) VALUES
	 ('b3c81571-5c9a-11f0-8921-06ee63b8f1b4','ADVERTISER_AD_PROPOSAL_MESSAGE','TEMPLATE','','[광고명]','[회사명]님이 제안서를 전송했어요.
제안서는 아래 버튼을 누르거나 제안 메뉴에서 확인할 수 있어요.',NULL,0,0,0,'2025-07-09 16:59:55','2025-07-09 16:59:55'),
	 ('b3c83592-5c9a-11f0-8921-06ee63b8f1b4','ADVERTISER_AD_PROPOSAL_MESSAGE','NOTICE','NOTICE','','제안서의 내용은 작가님과 회사 모두 수정할 수 있어요.
수정하고 싶은 내용이 있다면 충분한 협의 후 수정해주세요!',NULL,0,0,0,'2025-07-09 16:59:55','2025-07-09 16:59:55'),
	 ('b3c837c6-5c9a-11f0-8921-06ee63b8f1b4','ADVERTISER_AD_PROPOSAL_UPDATE_MESSAGE','TEMPLATE','','제안을 수정했어요.','[회사명]님이 제안서를 수정했어요.
제안서는 아래 버튼을 누르거나 제안 메뉴에서 확인할 수 있어요.',NULL,0,0,0,'2025-07-09 16:59:55','2025-07-09 16:59:55'),
	 ('b3c838a0-5c9a-11f0-8921-06ee63b8f1b4','ADVERTISER_AD_PROPOSAL_UPDATE_MESSAGE','NOTICE','NOTICE','','제안서의 내용은 작가님과 회사 모두 수정할 수 있어요.
수정하고 싶은 내용이 있다면 충분한 협의 후 수정해주세요!',NULL,0,0,0,'2025-07-09 16:59:55','2025-07-09 16:59:55'),
	 ('b3c83929-5c9a-11f0-8921-06ee63b8f1b4','AUTHOR_AD_PROPOSAL_ACCEPT_MESSAGE','TEMPLATE','','제안을 수락했어요','[작가명]님이 제안을 수락했습니다.
최종 제안서를 검토하신 후 이상이 없다면 제안 수락 버튼을 눌러주세요!',NULL,0,0,0,'2025-07-09 16:59:55','2025-07-09 16:59:55'),
	 ('b3c839bd-5c9a-11f0-8921-06ee63b8f1b4','AUTHOR_AD_PROPOSAL_ACCEPT_MESSAGE','NOTICE','WARNING','','제안을 수락하면 더이상 수정할 수 없습니다.',NULL,0,0,0,'2025-07-09 16:59:55','2025-07-09 16:59:55'),
	 ('b3c83a9f-5c9a-11f0-8921-06ee63b8f1b4','ADVERTISER_AD_PROPOSAL_ACCEPTED_MESSAGE','TEMPLATE','','제안을 수락했어요','[회사명]님이 제안서를 수정했습니다.
영업일 1~2일 이내로 등록한 이메일을 통해 계약서가 발송됩니다.',NULL,0,0,0,'2025-07-09 16:59:55','2025-07-09 16:59:55'),
	 ('b3c83b1d-5c9a-11f0-8921-06ee63b8f1b4','ADVERTISER_AD_PROPOSAL_ACCEPTED_MESSAGE','NOTICE','ALERT','','계약은 회사→작가 순으로 수락이 진행됩니다.',NULL,0,0,0,'2025-07-09 16:59:55','2025-07-09 16:59:55'),
	 ('b3c83b91-5c9a-11f0-8921-06ee63b8f1b4','ADVERTISER_AD_PROPOSAL_REJECTED_MESSAGE','TEMPLATE','','제안을 거절했어요','[회사명]님이 제안을 거절했습니다.
제안을 재개하고 싶으시다면, 협업 작가 리스트에서 새로운 제안을
보내주세요!',NULL,0,0,0,'2025-07-09 16:59:55','2025-07-09 16:59:55'),
	 ('b3c83c2b-5c9a-11f0-8921-06ee63b8f1b4','ADVERTISER_AD_PROPOSAL_REJECTED_MESSAGE','NOTICE','NOTICE','','**제안 거절 상태의 채팅방에 조치가 있다면 추가(ex. 7일후 채팅 비활성화)',NULL,0,0,0,'2025-07-09 16:59:55','2025-07-09 16:59:55');
INSERT INTO instatoon_dev.chat_templates (id,code,`type`,action_type,title,content,url,is_link,is_file,`order`,created_at,updated_at) VALUES
	 ('b3c83c94-5c9a-11f0-8921-06ee63b8f1b4','ADVERTISER_AD_CONTRACT_REQUEST_COMPLETE_MESSAGE','TEMPLATE','','[회사명]님, 계약을 완료해주세요!','이메일로 계약서를 전송했어요.
계약 내용을 확인하신 후, 아래 버튼이나 진행내역을 통해 계약을 진행하세요.',NULL,0,0,0,'2025-07-09 16:59:55','2025-07-09 16:59:55'),
	 ('b3c83d3c-5c9a-11f0-8921-06ee63b8f1b4','ADVERTISER_AD_CONTRACT_REQUEST_COMPLETE_MESSAGE','NOTICE','ALERT','','계약은 회사->작가 순으로 수락이 진행됩니다.',NULL,0,0,0,'2025-07-09 16:59:55','2025-07-09 16:59:55'),
	 ('b3c83db5-5c9a-11f0-8921-06ee63b8f1b4','ADVERTISER_AD_CONTRACT_COMPLETE_MESSAGE','TEMPLATE','','[회사명]님이 계약에 동의하였습니다.','[작가명]님이 계약에 동의하시면 최종 계약이 완료됩니다.',NULL,0,0,0,'2025-07-09 16:59:55','2025-07-09 16:59:55'),
	 ('b3c83e1f-5c9a-11f0-8921-06ee63b8f1b4','AUTHOR_AD_CONTRACT_REQUEST_COMPLETE_MESSAGE','TEMPLATE','','[작가명]님 계약을 완료해주세요!','이메일로 계약서를 전송했어요
계약 내용을 확인하신 후, 아래 버튼이나 진행내역을 통해 계약을 진행하세요.',NULL,0,0,0,'2025-07-09 16:59:55','2025-07-09 16:59:55'),
	 ('b3c83e89-5c9a-11f0-8921-06ee63b8f1b4','AUTHOR_AD_CONTRACT_COMPLETE_MESSAGE','TEMPLATE','','[작가명]님이 계약에 동의하였습니다.','계약이 완료되었습니다
계약서에 기재된 기한에 맞춰 작업이 진행됩니다.',NULL,0,0,0,'2025-07-09 16:59:55','2025-07-09 16:59:55'),
	 ('b3c83efc-5c9a-11f0-8921-06ee63b8f1b4','AUTHOR_AD_CONTRACT_COMPLETE_MESSAGE','NOTICE','NOTICE','','작업 진행 과정에서 툰어스의 중재가 필요한 경우 하단의 중재요청 버튼을 눌러주세요.',NULL,0,0,0,'2025-07-09 16:59:55','2025-07-09 16:59:55'),
	 ('b3c83f65-5c9a-11f0-8921-06ee63b8f1b4','AUTHOR_AD_CONTRACT_COMPLETE_MESSAGE','BUTTON','FULL','','계약서 보기','[URL 작성 필요]',0,0,0,'2025-07-09 16:59:55','2025-07-09 16:59:55'),
	 ('b3c83fc7-5c9a-11f0-8921-06ee63b8f1b4','AUTHOR_AD_CONTRACT_COMPLETE_MESSAGE','BUTTON','FULL','','AI로 레퍼런스 콘티 전달하기','[URL 작성 필요]',0,0,1,'2025-07-09 16:59:55','2025-07-09 16:59:55'),
	 ('b3c84054-5c9a-11f0-8921-06ee63b8f1b4','AUTHOR_AD_CONTI_WORK_START_NOTICE','TEMPLATE','','[작가명]님 콘티이 콘티 작업을 시작하였습니다.','',NULL,0,1,0,'2025-07-09 16:59:55','2025-07-09 16:59:55'),
	 ('b3c840bf-5c9a-11f0-8921-06ee63b8f1b4','AUTHOR_AD_CONTI_WORK_START_NOTICE','NOTICE','NOTICE','','원하는 콘티가 있다면 <콘티 생성 AI>를 이용해보세요!
자료가 구체적일 수록 작업물의 만족도도 높아질 거에요.',NULL,0,0,0,'2025-07-09 16:59:55','2025-07-09 16:59:55');
INSERT INTO instatoon_dev.chat_templates (id,code,`type`,action_type,title,content,url,is_link,is_file,`order`,created_at,updated_at) VALUES
	 ('b3c8411e-5c9a-11f0-8921-06ee63b8f1b4','AUTHOR_AD_CONTI_WORK_START_NOTICE','BUTTON','FULL','','콘티 생성 AI 사용하기','[URL 작성 필요]',0,0,0,'2025-07-09 16:59:55','2025-07-09 16:59:55'),
	 ('b3c84165-5c9a-11f0-8921-06ee63b8f1b4','AUTHOR_AD_CONTI_WORK_CONFIRM_REQUEST','TEMPLATE','','[회사명]님 콘티를 확인해주세요!','수정사항이 있으시다면 수정 요청하기 버튼을 눌러주세요.
이상이 없다면 컨펌하기 버튼을 눌러 다음 작업을 진행하세요.',NULL,0,1,0,'2025-07-09 16:59:55','2025-07-09 16:59:55'),
	 ('b3c841b1-5c9a-11f0-8921-06ee63b8f1b4','AUTHOR_AD_CONTI_WORK_CONFIRM_REQUEST','BUTTON','LEFT','','수정 요청하기','[URL 작성 필요]',0,0,0,'2025-07-09 16:59:55','2025-07-09 16:59:55'),
	 ('b3c841f6-5c9a-11f0-8921-06ee63b8f1b4','AUTHOR_AD_CONTI_WORK_CONFIRM_REQUEST','BUTTON','RIGHT','','컨펌하기','[URL 작성 필요]',0,0,0,'2025-07-09 16:59:55','2025-07-09 16:59:55'),
	 ('b3c8423c-5c9a-11f0-8921-06ee63b8f1b4','ADVERTISER_AD_CONTI_UPDATE_REQUEST','TEMPLATE','','[회사명]님이 수정을 요청했습니다.','[작가명]님이 수정한 파일을 전달하시거나, 오른쪽 작업 내역에서 컨펌하기를 통해 작업을 다시 진행 할 수 있습니다.',NULL,0,0,0,'2025-07-09 16:59:55','2025-07-09 16:59:55'),
	 ('b3c84283-5c9a-11f0-8921-06ee63b8f1b4','ADVERTISER_AD_CONTI_CONFIRM_COMPLETE','TEMPLATE','','[회사명]님이 콘티 컨펌을 완료하였습니다.','콘티 컨펌이 완료되면 본 작업이 진행 됩니다.',NULL,0,0,0,'2025-07-09 16:59:55','2025-07-09 16:59:55'),
	 ('b3c842cb-5c9a-11f0-8921-06ee63b8f1b4','ADVERTISER_AD_CONTI_CONFIRM_COMPLETE','NOTICE','ALERT','','작가님께서 작업을 시작하시면,알림을 통해 안내드릴 예정입니다.',NULL,0,0,0,'2025-07-09 16:59:55','2025-07-09 16:59:55'),
	 ('b3c84316-5c9a-11f0-8921-06ee63b8f1b4','AUTHOR_AD_WORK_START_NOTICE','TEMPLATE','','[작가명]님이 작업을 시작하였습니다.','',NULL,0,0,0,'2025-07-09 16:59:55','2025-07-09 16:59:55'),
	 ('b3c8435c-5c9a-11f0-8921-06ee63b8f1b4','AUTHOR_AD_WORK_START_NOTICE','NOTICE','NOTICE','','작업이 완료되면 파일 전달과 함께 최종 컨펌이 진행됩니다.',NULL,0,0,0,'2025-07-09 16:59:55','2025-07-09 16:59:55'),
	 ('b3c843a5-5c9a-11f0-8921-06ee63b8f1b4','AUTHOR_AD_WORK_CONFIRM_REQUEST','TEMPLATE','','[회사명]님 작업물을 확인해주세요!','수정사항이 있으시다면 수정 요청하기 버튼을 눌러주세요.
이상이 없다면 컨펌하기 버튼을 눌러 다음 작업을 진행하세요.',NULL,0,1,0,'2025-07-09 16:59:55','2025-07-09 16:59:55');
INSERT INTO instatoon_dev.chat_templates (id,code,`type`,action_type,title,content,url,is_link,is_file,`order`,created_at,updated_at) VALUES
	 ('b3c84418-5c9a-11f0-8921-06ee63b8f1b4','AUTHOR_AD_WORK_CONFIRM_REQUEST','NOTICE','WARNING','','최종 컨펌 이후에는 수정이 어려울 수 있으므로, 신중한 검토 부탁드립니다.',NULL,0,0,0,'2025-07-09 16:59:55','2025-07-09 16:59:55'),
	 ('b3c84475-5c9a-11f0-8921-06ee63b8f1b4','AUTHOR_AD_WORK_CONFIRM_REQUEST','BUTTON','LEFT','','수정 요청하기','[URL 작성 필요]',0,0,0,'2025-07-09 16:59:55','2025-07-09 16:59:55'),
	 ('b3c844ba-5c9a-11f0-8921-06ee63b8f1b4','AUTHOR_AD_WORK_CONFIRM_REQUEST','BUTTON','RIGHT','','최종 컨펌하기','[URL 작성 필요]',0,0,0,'2025-07-09 16:59:55','2025-07-09 16:59:55'),
	 ('b3c844fb-5c9a-11f0-8921-06ee63b8f1b4','ADVERTISER_AD_WORK_UPDATE_REQUEST','TEMPLATE','','[회사명]님이 수정을 요청했습니다.','[작가명]님이 수정한 파일을 전달하시거나, 오른쪽 작업 내역에서 컨펌하기를 통해 작업을 다시 진행 할 수 있습니다.',NULL,0,0,0,'2025-07-09 16:59:55','2025-07-09 16:59:55'),
	 ('b3c84544-5c9a-11f0-8921-06ee63b8f1b4','ADVERTISER_AD_WORK_CONFIRM_COMPLETE','TEMPLATE','','[회사명]님이 작업물 컨펌을 완료하였습니다.','작업물 컨펌이 완료되면 본 작업이 진행 됩니다.',NULL,0,0,0,'2025-07-09 16:59:55','2025-07-09 16:59:55'),
	 ('b3c8458a-5c9a-11f0-8921-06ee63b8f1b4','ADVERTISER_AD_WORK_CONFIRM_COMPLETE','NOTICE','ALERT','','작가님께서 작업을 시작하시면,알림을 통해 안내드릴 예정입니다.',NULL,0,0,0,'2025-07-09 16:59:55','2025-07-09 16:59:55'),
	 ('b3c845ee-5c9a-11f0-8921-06ee63b8f1b4','AUTHOR_AD_EXECUTION_COMPLETE','TEMPLATE','','[작가명]님이 광고 집행을 시작하였습니다.','완성된 작업물이 공개되었습니다. 광고의 성과는 상단 메뉴의 대시보드 또는 아래 버튼을 통해 열람할 수 있습니다.',NULL,1,0,0,'2025-07-09 16:59:55','2025-07-09 16:59:55'),
	 ('b3c84682-5c9a-11f0-8921-06ee63b8f1b4','AUTHOR_AD_EXECUTION_COMPLETE','BUTTON','LEFT','','대시보드로 이동','[URL 작성 필요]',0,0,0,'2025-07-09 16:59:55','2025-07-09 16:59:55'),
	 ('b3c846c7-5c9a-11f0-8921-06ee63b8f1b4','AUTHOR_AD_EXECUTION_COMPLETE','BUTTON','RIGHT','','광고 확인하기','[URL 작성 필요]',0,0,0,'2025-07-09 16:59:55','2025-07-09 16:59:55');
