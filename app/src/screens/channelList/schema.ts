import type { BlockSchema, FieldTableCellSchema, ModalSchema, ScreenSchema } from '../../schema/types';
import { col, header, lnb, rows } from '../shared/shell';

/** 설정 > 채널 관리 > 채널 목록 — list screen + 채널 설정 edit modal (from the 2026-10-27 screenshots). */

const f = (label: string, key: string, o: Omit<Extract<FieldTableCellSchema, { key: string }>, 'label' | 'key'> = {}) => ({ label, key, ...o });
const blank = (n = 1): FieldTableCellSchema => ({ blank: n });
const sel = (options: string[]) => ({ control: { type: 'select' as const, options } });
const date = { control: { type: 'date' as const } };

const channelRows = rows(
  ['media', 'format', 'route', 'product', 'code', 'name', 'contract', 'operation', 'processedAt', 'processedBy', 'inUse'],
  [
    ['알다', '전문연계', '전문', '개인신용', 'ALD01LCR', '알다 전문연계 (개인신용)', '2022-05-23 ~ 2022-05-22', '', '2025-11-25 13:23:41', 'SYSTEM', 'Y'],
    ['알다', '배너연계', 'Mobile', '개인신용', 'ALD02MCR', '알다 배너연계 (Mobile/개인신용)', '', '', '2025-11-25 13:23:41', 'SYSTEM', 'Y'],
    ['알다', '제휴광고', 'Mobile', '주택담보', 'ALD14MMO', '알다 제휴광고 (Mobile/주택담보)', '', '', '2025-11-25 13:23:41', 'SYSTEM', 'Y'],
    ['담비', '전문연계', '전문', '주택담보', 'BFD01LMQ', '담비 전문연계 (주택담보)', '2022-05-23 ~ 2022-05-22', '', '2025-11-25 13:23:41', 'SYSTEM', 'Y'],
    ['뱅크샐러드', '전문연계', '전문', '개인신용', 'BKS01LCR', '뱅크샐러드 전문연계 (개인신용)', '', '', '2025-11-25 13:23:41', 'SYSTEM', 'Y'],
    ['뱅크샐러드', '제휴광고', 'Mobile', '개인신용', 'BKS14MCR', '뱅크샐러드 제휴광고 (Mobile/개인신용)', '', '', '2025-11-25 13:23:41', 'SYSTEM', 'Y'],
    ['뱅크샐러드', '제휴광고', 'Mobile', '주택담보', 'BKS14MMO', '뱅크샐러드 제휴광고 (Mobile/주택담보)', '', '', '2025-11-25 13:23:41', 'SYSTEM', 'Y'],
    ['밴드', '배너광고', 'APP', '개인신용', 'BND13ACR', '밴드 배너광고 (App/개인신용)', '', '', '2025-11-25 13:23:41', 'SYSTEM', 'Y'],
    ['밴드', '배너광고', 'Mobile', '개인신용', 'BND13MCR', '밴드 배너광고 (Mobile/개인신용)', '', '', '2025-11-25 13:23:41', 'SYSTEM', 'Y'],
    ['BNK캐피탈', '배너연계', 'Mobile', '개인신용', 'BNK02MCR', 'BNK캐피탈 배너연계 (Mobile/개인신용)', '', '', '2025-11-25 13:23:41', 'SYSTEM', 'Y'],
    ['캠페인', '문자광고', 'APP', '입출금', 'CAM16ACH', '캠페인 문자광고 (APP/입출금)', '', '', '2025-11-25 13:23:41', 'SYSTEM', 'Y'],
    ['캠페인', '문자광고', 'APP', '개인신용', 'CAM16ACR', '캠페인 문자광고 (APP/개인신용)', '', '', '2025-11-25 13:23:41', 'SYSTEM', 'Y'],
    ['캠페인', '문자광고', 'APP', '기타', 'CAM16AET', '캠페인 문자광고 (APP/기타)', '', '', '2025-11-25 13:23:41', 'SYSTEM', 'Y'],
    ['캠페인', '문자광고', 'APP', '예금', 'CAM16AIS', '캠페인 문자광고 (APP/예금)', '', '', '2025-11-25 13:23:41', 'SYSTEM', 'Y'],
    ['캠페인', '문자광고', 'Mobile', '입출금', 'CAM16MCH', '연계대출 파킹통장 개설유도 (Mobile/입출금)', '', '', '2025-11-25 13:23:41', 'SYSTEM', 'Y'],
    ['캠페인', '문자광고', 'Mobile', '기타', 'CAM16MET', '캠페인 문자광고 (Mobile/기타)', '', '', '2025-11-25 13:23:41', 'SYSTEM', 'Y'],
    ['캠페인', '앱푸시', 'APP', '입출금', 'CAM31ACH', '캠페인 앱푸시 (APP/입출금)', '', '', '2025-11-25 13:23:41', 'SYSTEM', 'Y'],
    ['캠페인', '앱푸시', 'APP', '개인신용', 'CAM31ACR', '캠페인 앱푸시 (APP/개인신용)', '', '', '2025-11-25 13:23:41', 'SYSTEM', 'Y'],
    ['캠페인', '앱푸시', 'APP', '기타', 'CAM31AET', '캠페인 앱푸시 (APP/기타)', '', '', '2025-11-25 13:23:41', 'SYSTEM', 'Y'],
    ['캠페인', '앱푸시', 'APP', '예금', 'CAM31AIS', '캠페인 앱푸시 (APP/예금)', '', '', '2025-11-25 13:23:41', 'SYSTEM', 'Y'],
  ],
);

const body: BlockSchema[] = [
  {
    type: 'searchBar',
    rows: [
      [
        { type: 'select', options: ['운영일자', '등록일자'], width: 130 },
        { type: 'dateRange' },
        { type: 'select', options: ['기간', '오늘', '1주일', '1개월', '3개월'], width: 120 },
        { type: 'select', options: ['매체', '알다', '담비', '뱅크샐러드', '밴드', '캠페인'] },
        { type: 'select', options: ['게재형식', '전문연계', '배너연계', '제휴광고', '배너광고', '문자광고', '앱푸시'] },
        { type: 'select', options: ['채널경로구분', '전문', 'Mobile', 'APP'] },
        { type: 'select', options: ['상품구분', '개인신용', '주택담보', '입출금', '예금', '기타'] },
      ],
    ],
    detailRows: [
      [
        { type: 'text', placeholder: '채널명/채널코드', width: 270 },
        { type: 'select', options: ['Y', 'N'], width: 130 },
        { type: 'select', options: ['정산설정여부', 'Y', 'N'], width: 130 },
      ],
    ],
    actions: [
      { type: 'button', label: '조회', variant: 'primary' },
      { type: 'button', label: 'Excel ▾', variant: 'outline' },
      { type: 'detailToggle' },
      { type: 'button', label: '초기화', variant: 'outline' },
    ],
    rightActions: [
      { type: 'button', label: '매체 설정', variant: 'danger' },
      { type: 'button', label: '신규 등록', variant: 'danger' },
    ],
  },
  {
    type: 'grid',
    table: 'channels',
    minWidth: 1900,
    height: 700,
    pagination: { pageSize: 20, pageSizes: [10, 20, 50], totalPages: 6 },
    columns: [
      col('no', 'No.', { kind: 'no', width: 50 }),
      col('media', '매체', { width: 110 }),
      col('format', '게재형식', { width: 100 }),
      col('route', '채널경로구분', { width: 110 }),
      col('product', '상품구분', { width: 100 }),
      col('code', '채널코드', { width: 110 }),
      col('name', '채널명', { kind: 'link', modal: 'channelEdit', width: 320 }),
      col('contract', '계약기간', { width: 200 }),
      col('operation', '운영기간', { width: 200 }),
      col('processedAt', '처리일시', { width: 160 }),
      col('processedBy', '처리자', { width: 90 }),
      col('inUse', '사용여부', { width: 80 }),
      col('detail', '', { kind: 'button', buttonLabel: '상세', modal: 'channelEdit', width: 70 }),
    ],
  },
];

const channelEdit: ModalSchema = {
  id: 'channelEdit',
  title: '채널 설정',
  width: 1000,
  blockGap: 12,
  blocks: [
    {
      type: 'fields',
      columns: 3,
      labelAlign: 'right',
      editable: true,
      rows: [
        [f('채널코드', 'ch_code', { readOnly: true }), f('등록일시', 'ch_regAt', { readOnly: true }), f('등록자', 'ch_regBy', { readOnly: true })],
        [
          f('매체', 'ch_media', sel(['핀다', '알다', '담비', '뱅크샐러드', '캠페인'])),
          f('게재형식', 'ch_format', sel(['전문연계', '배너연계', '제휴광고', '배너광고', '문자광고', '앱푸시'])),
          f('채널경로구분', 'ch_route', sel(['전문', 'Mobile', 'APP'])),
        ],
        [
          f('상품구분', 'ch_product', sel(['개인신용', '주택담보', '입출금', '예금', '기타'])),
          f('연계구분', 'ch_link', sel(['일반연계', '직접연계'])),
          blank(),
        ],
        [f('채널명', 'ch_name', { span: 3 })],
        [f('랜딩URL', 'ch_url', { span: 3 })],
        [f('계약시작일자', 'ch_contractStart', date), f('계약종료일자', 'ch_contractEnd', date), blank()],
        [f('운영시작일자', 'ch_opStart', date), f('운영종료일자', 'ch_opEnd', date), f('사용여부', 'ch_inUse', sel(['사용', '미사용']))],
      ],
    },
    {
      type: 'collapsible',
      title: '수수료 관련정보',
      blocks: [
        {
          type: 'fields',
          columns: 3,
          labelAlign: 'right',
          editable: true,
          rows: [
            [f('VAT', 'fee_vat', sel(['미포함', '포함'])), f('수수료지급일', 'fee_payDay', sel(['25일', '말일', '10일'])), f('지급계좌', 'fee_account')],
            [f('수수료상한선', 'fee_capType', sel(['비대상', '대상'])), blank(2)],
            [
              f('전체수수료비율', 'fee_capRate', { unit: '%' }),
              f('실행금액비율', 'fee_capExecRate', { unit: '%' }),
              f('실행건당금액', 'fee_capPerCase', { unit: '원' }),
            ],
            [f('수수료하한선', 'fee_floorType', sel(['비대상', '대상'])), blank(2)],
            [
              f('전체수수료비율', 'fee_floorRate', { unit: '%' }),
              f('실행금액비율', 'fee_floorExecRate', { unit: '%' }),
              f('실행건당금액', 'fee_floorPerCase', { unit: '원' }),
            ],
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      title: '환수 관련정보',
      blocks: [
        {
          type: 'fields',
          columns: 3,
          labelAlign: 'right',
          editable: true,
          rows: [
            [f('환수규정', 'rc_rule', sel(['대상', '비대상'])), blank(2)],
            [
              f('기준시점', 'rc_base', sel(['실행일', '신청일'])),
              f('기준일수', 'rc_dayType', sel(['캘린더기준', '영업일기준'])),
              f('', 'rc_days', { unit: '일' }),
            ],
            [f('계좌상태', 'rc_acctStatus', sel(['철회/완제', '철회', '완제'])), f('환수형태', 'rc_type', sel(['당월 지급대상 제외', '익월 차감'])), blank()],
          ],
        },
      ],
    },
  ],
  footer: {
    right: [
      { type: 'button', label: '확인', variant: 'danger' },
      { type: 'button', label: '닫기', variant: 'outline' },
    ],
  },
};

export const channelListScreen: ScreenSchema = {
  id: 'settings-channel-list',
  title: '채널 목록',
  favorite: true,
  shell: { header: header('설정'), lnb: lnb(['설정', '채널 관리', '채널 목록']) },
  toolbar: { actions: [] },
  summary: [],
  body,
  tabs: [],
  modals: [channelEdit],
  data: {
    values: {
      ch_code: 'FND01LCR',
      ch_regAt: '2025-11-25 13:23:41',
      ch_regBy: 'SYSTEM',
      ch_media: '핀다',
      ch_format: '전문연계',
      ch_route: '전문',
      ch_product: '개인신용',
      ch_link: '일반연계',
      ch_name: '핀다 전문연계 (개인신용)',
      ch_url: 'https://digital.pepperbank.kr/app/landing.view?chnlCd=FND01LCR',
      ch_contractStart: '2021-09-24',
      ch_contractEnd: '2022-09-23',
      ch_opStart: '',
      ch_opEnd: '',
      ch_inUse: '사용',
      fee_vat: '미포함',
      fee_payDay: '25일',
      fee_account: '',
      fee_capType: '비대상',
      fee_capRate: '',
      fee_capExecRate: '',
      fee_capPerCase: '',
      fee_floorType: '비대상',
      fee_floorRate: '',
      fee_floorExecRate: '',
      fee_floorPerCase: '',
      rc_rule: '대상',
      rc_base: '실행일',
      rc_dayType: '캘린더기준',
      rc_days: '14',
      rc_acctStatus: '철회/완제',
      rc_type: '당월 지급대상 제외',
    },
    tables: { channels: channelRows },
  },
  currentUser: '절삼규(280820)',
};
