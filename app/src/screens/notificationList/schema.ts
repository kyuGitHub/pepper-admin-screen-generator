import type { BlockSchema, ModalSchema, ScreenSchema } from '../../schema/types';
import { blank, f, note, ro, sel } from '../shared/fields';
import { col, header, lnb, rows } from '../shared/shell';

/** 마케팅 > 알림 관리 > 알림 설정 목록 + 알림 설정 modal. */

const T = '2022-02-11 10:56:54';
const notificationRows = rows(
  ['code', 'biz', 'attr', 'name', 'channel', 'ums', 'omni', 'writtenAt', 'writtenBy', 'inUse'],
  [
    [
      'NT10DP0052',
      '수신계좌개설',
      '마케팅활용동의',
      '[페퍼스 펫적금 with 핏펫] 이탈자 적금개설 독려',
      'Push',
      '2348',
      'N',
      '2024-05-27 15:36:03',
      '이****',
      'Y',
    ],
    ['NT10LN0001', '여신대출신청', '금융', '대환대출 정보의 ADMIN 확인 완료', 'Push', '1006', 'N', T, '', 'Y'],
    ['NT10LN0002', '여신대출신청', '금융', '대환대출 정보의 ADMIN 확인 완료 후 취소 건 안내', 'Push', '1007', 'N', T, '', 'Y'],
    ['NT10LN0003', '여신대출신청', '금융', '특수관계인 여부 확인 완료', 'Push', '1008', 'N', T, '', 'Y'],
    ['NT10LN0004', '여신대출신청', '금융', '특수관계인 여부 확인 실패', 'Push', '1009', 'N', T, '', 'Y'],
    ['NT10LN0006', '여신대출신청', '필수', '적합성 판단 부결', 'Push', '1012', 'N', '2025-05-30 13:53:25', '휴**', 'Y'],
    ['NT10LN0007', '여신대출신청', '금융', '대출신청 과정 중 수기제출 서류 요청', 'Push', '1013', 'N', T, '', 'Y'],
    ['NT10LN0008', '여신대출신청', '금융', '대출신청 과정 중 수기제출 서류의 재 제출 요청', 'Push', '1014', 'N', T, '', 'Y'],
    ['NT10LN0009', '여신대출신청', '금융', '대출신청 과정 중 수기제출 서류의 제출 지연', 'Push', '1015', 'N', T, '', 'Y'],
    ['NT10LN0010', '여신대출신청', '금융', '대출신청 과정 중 수기제출 서류의 ADMIN 확인 완료', 'Push', '1016', 'N', T, '', 'Y'],
    ['NT10LN0011', '여신대출신청', '금융', '대출신청 과정 중 수기제출 서류의 ADMIN 확인 완료(건강보험공단WEBFAX)', 'Push', '1017', 'N', T, '', 'Y'],
    ['NT10LN0012', '여신대출신청', '금융', '정밀심사 완료', 'Push', '1018', 'N', T, '', 'Y'],
    ['NT10LN0013', '여신대출신청', '금융', '정밀심사 실패', 'Push', '1024', 'N', T, '', 'Y'],
    ['NT10LN0014', '여신대출신청', '필수', '테스트1', '문자', '2590', 'N', '2026-09-08 14:24:11', '욱**', 'N'],
    ['NT10LN0023', '여신대출신청', '금융', '권원 보험 처리 실패', 'Push', '1034', 'N', '2022-02-11 10:56:55', '', 'Y'],
    ['NT10LN0033', '여신대출신청', '금융', '전자등기 처리 완료', 'Push', '1044', 'N', '2022-02-11 10:56:55', '', 'Y'],
    ['NT10LN0040', '여신대출신청', '금융', '자금용도 증빙 지 요청', 'Push', '1051', 'N', '2022-02-11 10:56:55', '', 'Y'],
    ['NT10LN0041', '여신대출신청', '금융', '자금용도 증빙 완료', 'Push', '1052', 'N', '2022-02-11 10:56:55', '', 'Y'],
    ['NT10LN0042', '여신대출신청', '금융', '예적금담보대출(종합통장대출) 신청', 'Push', '1053', 'N', '2023-10-13 17:44:32', '남**', 'Y'],
    ['NT10LN0043', '여신대출신청', '금융', '예적금담보대출(종합통장대출) 신청승인', 'Push', '1054', 'N', '2022-02-11 10:56:55', '', 'Y'],
  ],
);

const body: BlockSchema[] = [
  {
    type: 'searchBar',
    rows: [
      [
        { type: 'select', options: ['작성일자', '수정일자'], width: 130 },
        { type: 'dateRange' },
        { type: 'select', options: ['기간', '오늘', '1주일', '1개월', '3개월'], width: 120 },
        { type: 'select', options: ['업무구분', '여신대출신청', '수신계좌개설', '회원'] },
        { type: 'select', options: ['알림속성', '금융', '필수', '마케팅활용동의'] },
        { type: 'select', options: ['발송수단', 'Push', '문자', '이메일', '알림톡'] },
      ],
    ],
    detailRows: [
      [
        { type: 'text', placeholder: '알림메시지명/메시지코드', width: 270 },
        { type: 'text', placeholder: 'UMS이케어번호', width: 130 },
        { type: 'select', options: ['옴니설정여부', 'Y', 'N'], width: 130 },
        { type: 'select', options: ['발송결과', '성공', '실패'], width: 130 },
        { type: 'select', options: ['사용여부', 'Y', 'N'], width: 130 },
      ],
    ],
    actions: [
      { type: 'button', label: '조회', variant: 'primary' },
      { type: 'button', label: 'Excel', variant: 'outline' },
      { type: 'button', label: '초기화', variant: 'outline' },
      { type: 'detailToggle' },
    ],
    rightActions: [{ type: 'button', label: '신규 등록', variant: 'danger' }],
  },
  {
    type: 'grid',
    table: 'notifications',
    height: 700,
    pagination: { pageSize: 20, pageSizes: [10, 20, 50], totalPages: 10, page: 8 },
    columns: [
      col('no', 'No', { kind: 'no', width: 50 }),
      col('code', '알림메시지코드', { width: 120 }),
      col('biz', '업무구분', { width: 110 }),
      col('attr', '알림속성', { width: 110 }),
      col('name', '알림메시지명', { kind: 'link', modal: 'notificationEdit', width: 420 }),
      col('channel', '발송수단', { width: 80 }),
      col('ums', 'UMS이케어번호', { width: 110 }),
      col('omni', '옴니설정여부', { width: 100 }),
      col('writtenAt', '작성일시', { width: 160 }),
      col('writtenBy', '작성자', { width: 80 }),
      col('inUse', '사용여부', { width: 80 }),
      col('omniBtn', '', { kind: 'button', buttonLabel: '옴니설정', width: 90 }),
    ],
  },
];

const notificationEdit: ModalSchema = {
  id: 'notificationEdit',
  title: '알림 설정',
  width: 1000,
  blockGap: 12,
  blocks: [
    {
      type: 'fields',
      columns: 3,
      labelAlign: 'right',
      editable: true,
      rows: [
        [f('알림메시지코드', 'nt_code', ro), f('작성일시', 'nt_writtenAt', ro), f('작성자', 'nt_writtenBy', ro)],
        [f('알림메시지명', 'nt_name', { span: 3 })],
        [
          f('업무구분', 'nt_biz', sel(['수신계좌개설', '여신대출신청', '회원'])),
          f('알림속성', 'nt_attr', sel(['마케팅활용동의', '금융', '필수'])),
          f('알림함저장여부', 'nt_store', sel(['저장', '미저장'])),
        ],
      ],
    },
    { type: 'divider', tight: true },
    {
      type: 'fields',
      columns: 3,
      labelAlign: 'right',
      editable: true,
      rows: [
        [
          f('발송수단', 'nt_channel', sel(['Push', '문자', '이메일', '알림톡'])),
          f('UMS이케어번호', 'nt_ums', ro),
          f('발송유형', 'nt_sendType', sel(['스케줄', '즉시'])),
        ],
        [f('알림템플릿', 'nt_template', { span: 3, ...sel(['기본 템플릿', '마케팅 템플릿']) })],
        [f('제목', 'nt_subject', { span: 3, counter: { max: 100 } })],
        [f('메일유형', 'nt_mailType', sel(['HTML', 'TEXT'])), f('메일시도회수', 'nt_mailRetry'), blank()],
      ],
    },
    {
      type: 'tabs',
      items: [
        {
          label: '본문내용',
          blocks: [
            {
              type: 'editor',
              height: 240,
              content: [
                '(광고) 기본금리 연 5%(세전) 페퍼스 펫적금 with 핏펫 가입 완료하고, 최대 2만원 혜택 받아가요. 지금이어하기▶ / 수신거부: MY페퍼 → 알림설정',
              ],
            },
          ],
        },
        { label: '첨부내용', blocks: [{ type: 'editor', height: 240, content: [] }] },
      ],
    },
    {
      type: 'fields',
      columns: 3,
      labelAlign: 'right',
      editable: true,
      rows: [
        [f('PUSH링크URL', 'nt_url', { span: 3 })],
        [f('심의번호', 'nt_reviewNo'), f('사용여부', 'nt_inUse', sel(['사용', '미사용'])), note('192 / 2000 byte')],
        [
          { label: '', key: 'nt_testMember', span: 2, control: { type: 'text', placeholder: '테스트 발송하려는 회원의 회원번호를 입력하세요' } },
          { buttons: [{ type: 'button', label: '테스트 발송', variant: 'primary' }] },
        ],
      ],
    },
  ],
  footer: {
    left: [{ type: 'button', label: '미리보기', variant: 'primary' }],
    right: [
      { type: 'button', label: '확인', variant: 'danger' },
      { type: 'button', label: '닫기', variant: 'outline' },
    ],
  },
};

export const notificationListScreen: ScreenSchema = {
  id: 'marketing-notification-list',
  title: '알림 설정 목록',
  favorite: true,
  shell: { header: header('마케팅'), lnb: lnb(['마케팅', '알림 관리', '알림 설정 목록']) },
  toolbar: { actions: [] },
  summary: [],
  body,
  tabs: [],
  modals: [notificationEdit],
  data: {
    values: {
      nt_code: 'NT10DP0052',
      nt_writtenAt: '2024-05-27 15:36:03',
      nt_writtenBy: '이****',
      nt_name: '[페퍼스 펫적금 with 핏펫] 이탈자 적금개설 독려',
      nt_biz: '수신계좌개설',
      nt_attr: '마케팅활용동의',
      nt_store: '저장',
      nt_channel: 'Push',
      nt_ums: '2348',
      nt_sendType: '스케줄',
      nt_template: '',
      nt_subject: '가입중인 펫적금이 있어요!',
      nt_mailType: '',
      nt_mailRetry: '',
      nt_url: '/app/pd/is/MPDIS11300.view',
      nt_reviewNo: '000',
      nt_inUse: '사용',
      nt_testMember: '',
      nt_testSend: '',
    },
    tables: { notifications: notificationRows },
  },
  currentUser: '절삼규(280820)',
};
