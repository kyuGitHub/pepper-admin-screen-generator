import type {
  ActionSchema,
  BlockSchema,
  FieldCellSchema,
  FieldTableCellSchema,
  LnbNodeSchema,
  PanelSchema,
  ScreenSchema,
  TableColumnSchema,
} from '../../schema/types';
import { seedHistory, tables, values } from './data';

/**
 * 모기지 대출신청 상세정보 (v3) — implemented from
 * `project/대출신청 상세정보 v3.dc.html` in the Claude Design handoff bundle.
 *
 * The helpers below only shorten the definition; their output is plain schema data.
 */

const f = (label: string, key: string, o: Omit<FieldCellSchema, 'label' | 'key'> = {}): FieldCellSchema => ({ label, key, ...o });
const blank = (n = 1): FieldTableCellSchema => ({ blank: n });
const note = (text: string): FieldTableCellSchema => ({ note: text });
const fields = (rows: FieldTableCellSchema[][], columns = 3): BlockSchema => ({ type: 'fields', columns, rows });
const btn = (label: string): ActionSchema => ({ type: 'button', label });
const panel = (id: string, title: string, blocks: BlockSchema[], o: Partial<PanelSchema> = {}): PanelSchema => ({ kind: 'panel', id, title, blocks, ...o });
const col = (key: string, label: string, o: Omit<TableColumnSchema, 'key' | 'label'> = {}): TableColumnSchema => ({ key, label, ...o });

const editWithHistory = (editLabel: string): ActionSchema[] => [
  { type: 'edit', label: editLabel },
  { type: 'history', label: '변경이력조회' },
];
const ID_BUTTONS = [btn('신분증 이미지'), btn('본인확인이력'), btn('안면인식이미지')];
const CONSENT_NOTE = '(SMS / 알림톡 / 이메일 / PUSH)';

/* ------------------------------------------------------------------ 상단 */

const summary: PanelSchema[] = [
  panel('member', '회원정보', [
    fields([
      [f('고객명', 'name', { mask: 'name' }), f('회원구분', 'memberType'), f('회원상태', 'memberStatus')],
      [f('회원번호', 'memberNo'), f('휴대폰', 'phone', { mask: 'phone' }), f('생년월일', 'birth')],
      [f('등록일시', 'regAt'), f('모바일OS', 'os'), f('최종접속일시', 'lastAt')],
      [f('특수관계대상', 'special'), f('특수관계확인일', 'specialAt'), f('특수관계확인자', 'specialBy')],
    ]),
  ]),
  panel(
    'apply',
    '신청현황',
    [
      fields([
        [f('유입채널', 'channel'), f('신청번호', 'applyNo'), f('신청일시', 'applyAt')],
        [f('신청상태', 'applyStatus'), f('최종진행단계', 'stage'), f('최종저장일시', 'savedAt')],
      ]),
    ],
    { actions: [btn('약관동의내역')] },
  ),
];

/* ------------------------------------------------------------------ 상세정보 탭 */

const detailLeft: PanelSchema[] = [
  panel(
    'loan',
    '신청정보',
    [
      fields([
        [f('상품명', 'product', { span: 2 }), f('대출구분', 'loanType')],
        [f('신청금액', 'reqAmt', { unit: '원' }), f('승인금액', 'apprAmt', { unit: '원' }), f('최종승인한도', 'maxLimit', { unit: '원' })],
        [f('설정금액', 'setAmt', { unit: '원' }), f('상환방식', 'repay'), f('대출/거치기간', 'period', { unit: '개월' })],
        [f('금리변동구분', 'rateType'), f('금리변동주기', 'rateCycle', { unit: '개월' }), f('중도상환수수료율', 'earlyFee', { align: 'right' })],
        [f('대출실행일', 'loanDate', { align: 'right' }), f('대출만기일', 'dueDate', { align: 'right' }), f('결제일', 'payDay', { align: 'right' })],
      ]),
    ],
    { actions: editWithHistory('신청정보 수정') },
  ),
  panel(
    'customer',
    '고객정보',
    [
      fields([
        [f('자택주소', 'home', { span: 2, mask: 'address' }), f('자택전화번호', 'homeTel')],
        [f('등본주소', 'regAddr', { span: 2, mask: 'address' }), blank()],
        [f('직업구분', 'job'), f('직종', 'jobKind'), f('이메일', 'email', { mask: 'email' })],
        [f('우편물수령지', 'mailTo'), f('수신동의여부', 'consent'), note(CONSENT_NOTE)],
        [f('거래목적', 'purpose', { mask: 'default' }), f('거래자금원천', 'fund'), f('불법수수료안내', 'feeNotice')],
        [f('금소법결과', 'kfcResult', { mask: 'default' }), f('금소법관리번호', 'kfcNo'), f('실소유자여부', 'owner')],
      ]),
    ],
    { actions: editWithHistory('고객정보 수정') },
  ),
  panel(
    'biz',
    '사업장 정보',
    [
      fields([
        [f('사업장명', 'bizName'), f('사업자번호', 'bizNo'), f('휴폐업여부', 'closed')],
        [f('사업장주소', 'bizAddr', { span: 2, mask: 'address' }), f('사업장전화번호', 'bizTel', { mask: 'default' })],
        [f('업종', 'industry'), f('단순경비율', 'expRate', { unit: '%' }), f('사업연속성인정', 'continuity')],
        [f('개업일자', 'openDate'), f('사업자등록일', 'bizRegDate'), f('운영기간', 'opPeriod', { unit: '개월' })],
        [f('과세구분', 'taxType'), f('매출확인방법', 'salesMethod'), f('연매출금액', 'sales', { unit: '원' })],
        [f('공동사업자여부', 'joint'), f('공동사업자', 'partners'), f('사업지분율', 'share', { unit: '%' })],
        [f('지분취득일', 'shareDate'), blank(2)],
      ]),
    ],
    { actions: editWithHistory('사업장정보 수정') },
  ),
  panel('income', '소득정보', [fields([[f('소득종류', 'incomeType'), f('소득산정방법', 'incomeMethod'), f('연소득금액', 'income', { unit: '원' })]])], {
    actions: [btn('소득계산')],
  }),
  panel('tax', '인지세 면제 대상 여부 / 국민주택채권 매입 면제대상 여부', [
    {
      type: 'fields',
      columns: 2,
      labelWidth: '22%',
      valueWidth: '28%',
      rows: [
        [
          f('인지세 면제 대상 여부', 'stampTax', { button: { label: '체크리스트' } }),
          f('국민주택채권 매입 면제 대상 여부', 'bond', { button: { label: '체크리스트' } }),
        ],
      ],
    },
  ]),
  panel('contract', '전자약정', [fields([[f('약정완료일시', 'signAt'), f('약정서명수단', 'signBy'), f('CMS서명수단', 'cmsBy')]])], {
    actions: [btn('전자약정조회'), btn('확인서조회')],
  }),
  panel(
    'identity',
    '본인확인',
    [1, 2, 3].flatMap((n, i): BlockSchema[] => [
      ...(i ? [{ type: 'divider' } as const] : []),
      { type: 'select', options: [['신분증진위확인', '신분증OCR'], ['타행계좌인증', '휴대폰본인확인'], ['안면인식']][i] },
      fields([
        [
          f('인증요청일시', `idAt${n}`),
          f('성공여부', `idOk${n}`),
          f('누적오류횟수', `idErr${n}`, { align: 'right', button: { label: '초기화', variant: 'danger' } }),
        ],
      ]),
    ]),
    { actions: ID_BUTTONS },
  ),
];

const detailRight: PanelSchema[] = [
  panel(
    'limit',
    '한도산출정보',
    [
      fields([
        [f('CSS승인구분', 'cssApprove'), f('CSS거절사유', 'cssReject', { span: 2 })],
        [f('등급', 'grade'), note('(NICE / KCB / AS / ExML / 통합RISK)'), f('심사구분', 'reviewType')],
        [f('CUTOFF', 'cutoff'), note('(CUTOFF / CFS / 상품 / 거절)'), f('최종심사구분', 'finalReview')],
        [f('LTV/최대LTV', 'ltv', { unit: '%' }), f('DTI/최대DTI', 'dti', { unit: '%' }), f('LTI', 'lti', { unit: '%' })],
        [f('LTI필수대상', 'ltiReq'), blank(2)],
      ]),
    ],
    { actions: [btn('한도산출 상세')] },
  ),
  panel(
    'rate',
    '금리정보',
    [
      fields([
        [f('기준금리', 'baseRate', { unit: '%' }), f('가산금리', 'addRate', { unit: '%' }), f('최종적용금리', 'finalRate', { unit: '%' })],
        [f('우대금리', 'prefRate', { unit: '%' }), f('추가금리', 'extraRate', { unit: '%' }), f('조정금리', 'adjRate', { unit: '%' })],
      ]),
    ],
    { actions: [btn('금리산출')] },
  ),
  panel(
    'confirm',
    '확인정보',
    [
      {
        type: 'section',
        separated: false,
        blocks: [
          { type: 'heading', text: '당행기대출정보 ({rows:loans}건)', meta: '기준일자 2026-09-05 15:40:15' },
          {
            type: 'table',
            table: 'loans',
            columns: [
              col('name', '상품명(코드)'),
              col('status', '계좌상태', { align: 'center', bold: true, tones: { '완제(해지)': '#707070', '*': '#303030' } }),
              col('bal', '잔액(원)', { align: 'right' }),
              col('bs', 'BS', { align: 'center' }),
              col('date', '신규일자', { align: 'center' }),
              col('rate', '적용금리', { align: 'right' }),
              col('fund', '자금구분', { align: 'center' }),
            ],
          },
          {
            type: 'totals',
            items: [
              { label: '당행 기대출잔액', value: '28,000,000 원' },
              { label: '당행 기대출잔액(가계)', value: '28,000,000 원' },
            ],
          },
        ],
      },
      {
        type: 'section',
        blocks: [
          { type: 'heading', text: '사전조사 책임자 확인내용 ({checked:precheck}/{items:precheck})' },
          {
            type: 'checklist',
            id: 'precheck',
            items: [
              '대환계좌 잔액변동 차이가 일정금액 이상',
              '신청 3개월 이내 전액 상환한 주담대가 존재',
              '담보물 취득일자와 대환(이) 설정일자가 3개월 이내',
              '사업장 개업일 이전 발생 대출의 대환인 경우',
            ],
          },
          fields([[f('책임자', 'checker'), blank()]], 2),
        ],
      },
      {
        type: 'section',
        blocks: [
          {
            type: 'heading',
            text: { when: 'rowsWhere:cautions.yn=N', then: '유의고객 (미해제 {rowsWhere:cautions.yn=N}건)', else: '유의고객 ({rows:cautions}건)' },
          },
          {
            type: 'table',
            table: 'cautions',
            columns: [
              col('reg', '등록일', { align: 'center', width: '18%' }),
              col('reason', '사유'),
              col('release', '해제일', { align: 'center', width: '18%' }),
              col('yn', '해제여부', { align: 'center', width: '14%', bold: true, tones: { N: 'var(--bs-danger, #dc3545)', '*': '#707070' } }),
            ],
          },
        ],
      },
    ],
    { blockGap: 0 },
  ),
];

/* ------------------------------------------------------------------ 담보정보 탭 */

const providerPanels: PanelSchema[] = [
  panel('pMember', '담보제공자정보', [
    fields([
      [f('성명', 'pName', { mask: 'name' }), f('회원구분', 'pType'), f('회원상태', 'pStatus')],
      [f('회원번호', 'pNo'), f('휴대폰', 'pPhone', { mask: 'phone' }), f('생년월일', 'pBirth')],
      [f('등록일시', 'pRegAt'), f('모바일OS', 'pOs'), f('최종접속일시', 'pLastAt')],
      [f('관계', 'pRel'), f('소유형태', 'pOwnType'), f('담보제공요청일시', 'pReqAt')],
    ]),
  ]),
  panel(
    'pCustomer',
    '고객정보',
    [
      fields([
        [f('자택주소', 'pHome', { span: 2, mask: 'address' }), f('자택전화번호', 'pHomeTel')],
        [f('등본주소', 'pRegAddr', { span: 2, mask: 'address' }), blank()],
        [f('직업구분', 'pJob'), f('직종', 'pJobKind'), f('이메일', 'pEmail', { mask: 'email' })],
        [f('우편물수령지', 'pMail'), f('수신동의여부', 'pConsent'), note(CONSENT_NOTE)],
        [f('거래목적', 'pPurpose'), f('거래자금원천', 'pFund'), f('불법수수료안내', 'pFee')],
        [f('실소유자여부', 'pOwner'), blank(2)],
      ]),
    ],
    { historySection: '담보제공자{no} 고객정보', actions: editWithHistory('고객정보 수정') },
  ),
  panel('pStatus', '담보제공자처리현황', [fields([[f('최종진행단계', 'pStage'), f('최종저장일시', 'pSavedAt'), blank()]])], { actions: [btn('약관동의내역')] }),
  panel('pContract', '전자약정', [fields([[f('약정완료일시', 'pSignAt'), f('전자서명수단', 'pSignBy'), blank()]])], {
    actions: [btn('전자약정조회'), btn('확인서조회')],
  }),
  panel(
    'pIdentity',
    '본인확인',
    ['신분증진위확인', '타행계좌인증', '안면인식인증'].flatMap((t, i): BlockSchema[] => [
      ...(i ? [{ type: 'divider', tight: true } as const] : []),
      { type: 'select', options: [t] },
      fields([
        [
          f('인증요청일시', `pIdAt${i + 1}`),
          f('성공여부', `pIdOk${i + 1}`),
          f('누적오류횟수', `pIdErr${i + 1}`, { align: 'right', button: { label: '초기화', variant: 'danger' } }),
        ],
      ]),
    ]),
    { actions: ID_BUTTONS },
  ),
];

const collateralRight: PanelSchema[] = [
  panel(
    'col',
    '담보정보',
    [
      fields([
        [f('IFIS 담보번호', 'kIfis'), blank(), f('조회일', 'kIfisDate')],
        [f('부동산고유번호', 'kUid'), f('담보종류', 'kType'), f('등기부면적', 'kArea', { unit: '㎡' })],
        [f('소재지주소', 'kAddr', { span: 3, mask: 'address' })],
        [f('등기여부', 'kReg'), f('취득일자', 'kAcq'), f('대지권소유비율', 'kLandRatio', { unit: '%' })],
        [f('총방수', 'kRooms', { align: 'right' }), f('세대수/총동수', 'kUnits', { align: 'right' }), f('거주층/총층', 'kFloor', { align: 'right' })],
        [f('담보등급', 'kGrade'), f('규제별지역', 'kZone'), f('최우선변제', 'kPrior', { unit: '원' })],
        [f('권리침해여부', 'kInfr'), f('침해해지이력', 'kInfrHist'), f('신청사건처리중', 'kCase')],
        [f('감정기관', 'kOrg'), f('담보가액', 'kValue', { unit: '원' }), f('담보평가일자', 'kEvalDate')],
      ]),
    ],
    { actions: [btn('등기부등본 조회'), btn('IFIS 담보번호조회'), { type: 'edit' }] },
  ),
  panel('owners', '소유자정보', [
    {
      type: 'table',
      table: 'owners',
      columns: [
        col('no', 'No.', { align: 'center', width: 50 }),
        col('name', '소유자'),
        col('type', '소유형태'),
        col('share', '소유지분율(%)', { align: 'right' }),
      ],
    },
  ]),
  panel(
    'lien',
    '담보설정정보',
    [
      {
        type: 'table',
        table: 'liens',
        density: 'compact',
        columns: [
          col('no', 'No.', { align: 'center', width: 40 }),
          col('org', '설정기관'),
          col('date', '설정일자', { align: 'center' }),
          col('amt', '설정금액(원)', { align: 'right', editable: true, historyLabel: '설정금액' }),
          col('bal', '대출잔액(원)', { align: 'right', editable: true, historyLabel: '대출잔액' }),
          col('cancel', '말소', { align: 'center', kind: 'checkbox', editable: true }),
          col('debtor', '채무자', { align: 'center' }),
          col('refi', '대환', { align: 'center' }),
          col('addDel', '추가/삭제', { align: 'center' }),
        ],
      },
    ],
    { actions: [{ type: 'edit', label: '+' }] },
  ),
  panel(
    'tenant',
    '임차인정보',
    [
      fields([
        [f('임차인명', 'tName', { mask: 'name' }), f('임차시작일', 'tStart'), f('임차만료일', 'tEnd')],
        [f('임차인 선/후순위', 'tRank'), f('전/월세', 'tKind'), f('권리구분', 'tRight')],
        [f('전세권 설정유무', 'tJeonse'), f('전세권설정일', 'tJeonseDate'), f('임차보증금', 'tDeposit', { unit: '원' })],
        [f('임대차 확정유무', 'tFixed'), f('임대차확정일', 'tFixedDate'), f('월세', 'tRent', { unit: '원' })],
        [f('임차권 설정여부', 'tLease'), f('임차권설정일', 'tLeaseDate'), blank()],
      ]),
    ],
    { actions: [btn('임차인 추가')] },
  ),
  panel(
    'prices',
    '담보시세정보',
    [
      {
        type: 'table',
        table: 'prices',
        columns: [
          col('no', 'No.', { align: 'center', width: 50 }),
          col('org', '감정기관'),
          col('date', '시세업데이트일자', { align: 'center' }),
          col('low', '하위평균가(원)', { align: 'right' }),
          col('mid', '일반평균가(원)', { align: 'right', bold: true }),
          col('high', '상위평균가(원)', { align: 'right' }),
        ],
      },
    ],
    { actions: [{ type: 'modal', label: 'KB시세상세열람', modal: 'kb' }, btn('시세변경이력'), btn('시세조회')] },
  ),
];

/* ------------------------------------------------------------------ 실행정보 탭 */

const executionLeft: PanelSchema[] = [
  panel(
    'tiOpt',
    '권원보험 설정 정보',
    [
      fields([
        [
          f('등기유형', 'tiRegType', { control: { type: 'select', options: ['오프라인등기', '전자등기'] } }),
          f('등기권리증 유무', 'tiDeed', { control: { type: 'select', options: ['확인서면', '구권리증', '신권리증'] } }),
          f('임대차현장조사', 'tiLeaseSurvey', { control: { type: 'select', options: ['현장조사진행', '현장조사 미진행', '비대면조사'] } }),
        ],
      ]),
      { type: 'dirtyNotice', text: '* 변경된 항목이 있습니다. [저장]을 눌러 반영하세요.' },
    ],
    { actions: [btn('권원보험 요청'), { type: 'formSave' }] },
  ),
  panel('tiDetail', '권원보험 설정상세', [
    fields([
      [f('청약일시', 'tiReqAt'), f('권원보험단계', 'tiStep'), f('진행상태', 'tiStatus')],
      [f('최종전문처리일시', 'tiLastAt'), f('오류내용', 'tiErr'), f('확인서발행일', 'tiCertDate')],
      [f('보험증권번호', 'tiPolicy'), blank(), f('보험가입금액', 'tiAmt', { unit: '원' })],
    ]),
    { type: 'divider' },
    { type: 'heading', text: '등기부조사결과' },
    fields([
      [f('권리침해여부', 'tiInfr'), f('신청사건처리중', 'tiCase'), f('전자등기가능여부', 'tiEreg')],
      [f('이상여부', 'tiRegAbn'), blank(2)],
    ]),
    { type: 'divider' },
    { type: 'heading', text: '전입세대조사결과' },
    fields([[f('이상여부', 'tiMoveAbn'), blank(2)]]),
    { type: 'divider' },
    {
      type: 'controls',
      items: [
        {
          type: 'radio',
          name: 'tiAction',
          defaultValue: 'offline',
          options: [
            { label: '신청취소', value: 'cancel' },
            { label: '오프라인이관', value: 'offline' },
          ],
        },
        { type: 'select', options: ['선택하세요', '고객요청', '심사부결', '서류미비', '기타'] },
        { type: 'button', label: '확인', variant: 'danger' },
      ],
    },
  ]),
  panel('tiMsgs', '권원보험 전문이력', [
    {
      type: 'table',
      table: 'tiMsgs',
      density: 'dense',
      columns: [
        col('no', 'No.', { align: 'center', width: 36 }),
        col('code', '전문코드', { kind: 'link' }),
        col('kind', '전문종류'),
        col('step', '권원보험단계'),
        col('at', '전문처리일시', { align: 'center' }),
        col('ok', '전문성공여부', { align: 'center' }),
        col('resend', '', { align: 'center', width: 84, kind: 'button', buttonLabel: '전문재전송' }),
      ],
    },
  ]),
];

const COST_BANK = ['cbStamp', 'cbTitle', 'cbLegal', 'cbReg', 'cbEdu', 'cbSeal', 'cbTrans', 'cbSurvey', 'cbEtc'];
// 제비용합계(ccFees) is itself a subtotal, so it is left out of the customer total.
const COST_CUSTOMER = ['ccStamp', 'ccBond', 'ccAddr', 'ccEtc'];

const executionRight: PanelSchema[] = [
  panel('cAcct', '계좌정보', [
    fields([
      [f('CMS은행', 'cCmsBank'), f('CMS계좌번호', 'cCmsAcct', { mask: 'default' }), f('CMS수취인명', 'cCmsName', { mask: 'default' })],
      [f('대출송금은행', 'cSendBank'), f('송금계좌번호', 'cSendAcct', { mask: 'default' }), f('송금수취인명', 'cSendName', { mask: 'default' })],
    ]),
  ]),
  panel('cSend', '송금정보', [fields([[f('송금방법', 'cMethod'), f('송금구분', 'cSendType'), blank()]])], { actions: [{ type: 'edit' }] }),
  panel(
    'cost',
    '비용상세',
    [
      { type: 'heading', text: '은행부담비용', meta: `합계 {sum:${COST_BANK.join(',')}}원` },
      fields([
        [f('인지세', 'cbStamp', { unit: '원' }), f('권원보험료', 'cbTitle', { unit: '원' }), f('법무비용합계', 'cbLegal', { unit: '원' })],
        [f('등록세', 'cbReg', { unit: '원' }), f('교육세', 'cbEdu', { unit: '원' }), f('증지', 'cbSeal', { unit: '원' })],
        [f('교통비', 'cbTrans', { unit: '원' }), f('전입조사비', 'cbSurvey', { unit: '원' }), f('기타', 'cbEtc', { unit: '원' })],
      ]),
      { type: 'divider' },
      { type: 'heading', text: '고객부담비용', meta: `합계 {sum:${COST_CUSTOMER.join(',')}}원` },
      fields([
        [f('인지세', 'ccStamp', { unit: '원' }), f('제비용합계', 'ccFees', { unit: '원' }), f('채권비', 'ccBond', { unit: '원' })],
        [f('주소변경', 'ccAddr', { unit: '원' }), f('기타', 'ccEtc', { unit: '원' }), blank()],
      ]),
    ],
    { actions: [{ type: 'edit' }] },
  ),
  panel(
    'remits',
    '송금내역',
    [
      {
        type: 'table',
        table: 'remits',
        density: 'compact',
        footer: { label: '합계', labelSpan: 6, sumColumn: 'amt' },
        columns: [
          col('no', 'No.', { align: 'center', width: 36 }),
          col('type', '송금구분'),
          col('bank', '은행명'),
          col('acct', '계좌번호'),
          col('holder', '예금주'),
          col('at', '송금일시', { align: 'center' }),
          col('amt', '송금액(원)', { align: 'right', bold: true }),
          col('done', '완료여부', { align: 'center' }),
        ],
      },
    ],
    { meta: '{rows:remits}건' },
  ),
];

/* ------------------------------------------------------------------ shell */

const L = (label: string, id?: string): LnbNodeSchema => (id ? { label, id } : { label });

const lnbTree: LnbNodeSchema[] = [
  { label: '회원', children: [L('회원조회')] },
  {
    label: '여신',
    open: true,
    children: [
      L('요약정보'),
      { label: '개인신용', children: [L('대출신청 목록')] },
      {
        label: '모기지',
        open: true,
        children: [
          { label: '간편한도조회', children: [L('간편한도조회 목록')] },
          {
            label: '대출신청',
            open: true,
            children: [
              L('대출신청 목록', 'list'),
              L('대출신청 상세정보', 'detail'),
              L('대출신청 서류접수 목록'),
              L('정밀심사 대상 목록'),
              L('대출실행 대상 목록'),
              L('대출실행 목록'),
            ],
          },
          L('모기지 이관 목록'),
        ],
      },
      { label: '오토', children: [L('대출신청 목록')] },
      { label: '예적금 담보대출', children: [L('대출신청 목록')] },
      { label: '사후관리', children: [L('연체관리')] },
    ],
  },
  { label: '수신', children: [L('예금계좌조회')] },
  { label: '고객지원', children: [L('상담이력')] },
  { label: '마케팅', children: [L('캠페인')] },
  { label: '설정', children: [L('권한관리')] },
  { label: '리포트', children: [L('일일보고서')] },
  { label: '시스템', children: [L('코드관리')] },
];

const SPLIT_HEIGHT = 'max(420px, calc(100vh - 440px))';

export const loanApplicationDetailScreen: ScreenSchema = {
  id: 'mortgage-loan-application-detail',
  title: '대출신청 상세정보',
  shell: {
    header: {
      menu: ['회원', '여신', '수신', '고객지원', '마케팅', '설정', '리포트', '시스템'],
      active: '여신',
      userName: '절삼규',
      userPosition: '(280820)',
      lastLogin: '',
      shortcuts: ['바로가기'],
      history: ['메뉴이력'],
    },
    lnb: { tabs: ['업무메뉴', '즐겨찾기'], tree: lnbTree, activeId: 'detail' },
  },
  toolbar: {
    search: { placeholder: '조회하려는 고객의 신청번호를 입력하세요.', submitLabel: '조회' },
    actions: [
      { type: 'history', label: '정보변경이력' },
      { type: 'button', label: '진행단계변경', variant: 'danger' },
    ],
  },
  summary,
  tabs: [
    {
      label: '상세정보',
      layout: { heightMode: 'max', height: 'calc(100vh - 120px)', align: 'start', columns: [{ items: detailLeft }, { items: detailRight }] },
    },
    {
      label: '담보정보',
      layout: {
        heightMode: 'fixed',
        height: SPLIT_HEIGHT,
        align: 'start',
        columns: [
          {
            items: [
              {
                kind: 'repeat',
                id: 'providers',
                title: '담보제공자',
                countText: '({n}명)',
                itemTitle: '담보제공자정보 {no}',
                summaryKeys: ['pRel', 'pOwnType', 'pStage'],
                instances: [{ keySuffix: '' }, { keySuffix: '_2' }],
                panels: providerPanels,
              },
            ],
          },
          { items: collateralRight },
        ],
      },
    },
    { label: '한도조회이력' },
    { label: '서류제출' },
    { label: '신용정보' },
    { label: '채무현황' },
    { label: 'CSS정보' },
    {
      label: '실행정보',
      layout: { heightMode: 'fixed', height: SPLIT_HEIGHT, align: 'stretch', columns: [{ items: executionLeft }, { items: executionRight, paddingLeft: 4 }] },
    },
    { label: '이력조회' },
  ],
  modals: [
    {
      id: 'kb',
      title: 'KB시세 상세열람',
      width: 900,
      blocks: [
        { type: 'text', tone: 'muted', text: '조회일시 2026-09-22 09:33:27 · 조회요청자 210083' },
        {
          type: 'kvStrip',
          items: [
            { label: '기준일자', value: '2026-09-18' },
            { label: 'KB시세ID', value: 'KBA029225_2' },
            { label: '물건식별자', value: 'KBA029225' },
            { label: '평형일련번호', value: '2' },
          ],
        },
        {
          type: 'kvTable',
          rows: [
            ['단지명', '', '도로기본주소', ''],
            ['공급면적', '112.24', '도로명건물부번', 'Y'],
            ['평형구분', 'B', '도로상세주소', ''],
            ['전용면적', '84.9', '우편번호', ''],
            ['기타전용면적', '', '시도명', '경기도'],
            ['매매하한가', '420,000,000', '시군구명', '김포시'],
            ['매매일반거래가', '445,000,000', '구명', ''],
            ['매매상한가', '455,000,000', '읍면동명', ''],
            ['총세대수', '439', '리명', ''],
            ['총동수', '7', '번지', ''],
            ['단지최고층', '21', '기타번지', ''],
            ['방수', '3', '평형 세대수', '262'],
          ],
        },
      ],
    },
  ],
  data: { values, tables },
  currentUser: '절삼규(280820)',
  masked: true,
  seedHistory,
};
