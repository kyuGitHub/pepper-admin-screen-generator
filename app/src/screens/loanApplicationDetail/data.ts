import type { HistoryEntry, TableRow } from '../../schema/types';

// Sample data from the v3 design. Customer-identifying values (names, numbers, addresses,
// account numbers, e-mails) are intentionally blank, as requested during the design review.

const provider1: Record<string, string> = {
  pName: '', pType: '개인', pStatus: '정상', pNo: '', pPhone: '', pBirth: '', pRegAt: '2022-08-18 15:10:42', pOs: 'Android', pLastAt: '2022-08-24 11:20:01',
  pRel: '배우자', pOwnType: '공동소유', pReqAt: '2022-08-18 15:02:11',
  pHome: '', pHomeTel: '', pRegAddr: '', pJob: '회사원', pJobKind: '사무직', pEmail: '', pMail: '현재거주지주소', pConsent: 'Y / Y / N / Y',
  pPurpose: '담보제공', pFund: '근로소득', pFee: 'N', pOwner: 'Y',
  pStage: '전자약정완료', pSavedAt: '2022-08-24 14:55:12', pSignAt: '2022-08-24 14:54:05', pSignBy: '간편바이오(지문)',
  pIdAt1: '2022-08-24 11:20:54', pIdOk1: '성공', pIdErr1: '0', pIdAt2: '2022-08-24 11:21:23', pIdOk2: '성공', pIdErr2: '0', pIdAt3: '2022-08-24 11:21:23', pIdOk3: '성공', pIdErr3: '0',
};

// 담보제공자 2: same shape as provider 1 (keys suffixed `_2`) with these differences.
const provider2: Record<string, string> = {
  ...Object.fromEntries(Object.entries(provider1).map(([k, v]) => [`${k}_2`, v])),
  pRel_2: '자녀', pOwnType_2: '공동소유', pReqAt_2: '2022-08-18 15:04:37', pRegAt_2: '2022-08-19 09:12:05', pOs_2: 'iOS', pLastAt_2: '2022-08-24 13:02:44',
  pJob_2: '학생', pJobKind_2: '기타', pConsent_2: 'Y / Y / Y / Y', pFund_2: '기타', pStage_2: '본인확인완료', pSavedAt_2: '2022-08-24 13:05:10',
  pSignAt_2: '', pSignBy_2: '', pIdAt1_2: '2022-08-24 13:01:12', pIdAt2_2: '2022-08-24 13:02:03', pIdErr2_2: '1', pIdAt3_2: '2022-08-24 13:02:40',
};

export const values: Record<string, string> = {
  // 회원정보 / 신청현황
  name: '', memberType: '개인', memberStatus: '정상', memberNo: '', phone: '', birth: '',
  regAt: '2022-08-20 13:11:02', os: 'iOS', lastAt: '2026-10-02 09:41:27', special: 'N', specialAt: '2026-08-30', specialBy: '심사역(280415)',
  channel: '토스', applyNo: 'MG2026082400073', applyAt: '2026-08-24 10:12:45', applyStatus: '실행완료', stage: '기표송금', savedAt: '2026-09-01 11:03:52',
  // 신청정보
  product: '페퍼스 사업자담보대출', loanType: '신규/기고객/갱신', reqAmt: '26,000,000', apprAmt: '26,000,000', maxLimit: '26,000,000',
  setAmt: '31,200,000 (120%)', repay: '만기일시상환', period: '36 / 0', rateType: '변동금리', rateCycle: '3', earlyFee: '36개월 이내 2.0%',
  loanDate: '2026-09-01', dueDate: '2029-09-01', payDay: '1일',
  // 고객정보
  home: '', homeTel: '', regAddr: '', job: '개인사업자(자영업)', jobKind: '판매 관련 관리자', email: '', mailTo: '현재거주지주소', consent: 'Y / Y / Y / N',
  purpose: '사업상 거래', fund: '대출(차입)', feeNotice: 'N', kfcResult: '적합 / -', kfcNo: '', owner: 'Y',
  // 사업장 정보
  bizName: '', bizNo: '', closed: 'N', bizAddr: '', bizTel: '',
  industry: '통신 · 방송장비 및 부품 도매업', expRate: '90.00', continuity: 'N', openDate: '2014-06-12', bizRegDate: '2014-06-12', opPeriod: '11년 4',
  taxType: '일반', salesMethod: '부가가치세 과세표준증명원', sales: '106,062,209', joint: 'Y', partners: '', shareDate: '2014-06-12', share: '70',
  // 소득정보 / 인지세 / 전자약정 / 본인확인
  incomeType: '신고소득', incomeMethod: '매출액추정소득', income: '155,119,538',
  stampTax: '대상', bond: '대상',
  signAt: '2022-08-24 14:54:05', signBy: '간편바이오(지문)', cmsBy: '사설인증서인증',
  idAt1: '2022-08-24 11:20:54', idOk1: '성공', idErr1: '0', idAt2: '2022-08-24 11:24:10', idOk2: '성공', idErr2: '0', idAt3: '2022-08-24 11:22:31', idOk3: '성공', idErr3: '0',
  // 한도산출정보 / 금리정보 / 확인정보
  cssApprove: '승인', cssReject: '', grade: '06 / 07 / 05 / 07 / 04', reviewType: '', cutoff: '승인 / 정상 / 간편 / 정상', finalReview: '',
  ltv: '89.78 / 90', dti: '39.33 / 0', lti: '3470.28', ltiReq: 'N',
  baseRate: '2.38', addRate: '5.95', finalRate: '8.33', prefRate: '0.00', extraRate: '0.00', adjRate: '',
  checker: '박페퍼',
  // 담보제공자
  ...provider1,
  ...provider2,
  // 담보정보
  kIfis: '19551234567890', kIfisDate: '2022-08-18', kUid: '19551234567890', kType: '아파트', kArea: '84.85', kAddr: '', kReg: 'Y', kAcq: '2021-04-30', kLandRatio: '34.28',
  kRooms: '3', kUnits: '1026 / 7', kFloor: '2 / 12', kGrade: '1등급', kZone: '그외지방', kPrior: '25,000,000', kInfr: 'N', kInfrHist: 'N', kCase: 'Y',
  kOrg: 'KB시세', kValue: '137,500,000', kEvalDate: '2022-08-05',
  tName: '', tStart: '', tEnd: '', tRank: '', tKind: '', tRight: '', tJeonse: '', tJeonseDate: '', tDeposit: '', tFixed: '', tFixedDate: '', tRent: '', tLease: '', tLeaseDate: '',
  // 실행정보 — 권원보험
  tiRegType: '전자등기', tiDeed: '', tiLeaseSurvey: '',
  tiReqAt: '2022-08-11 17:49:34', tiStep: '종료', tiStatus: '진행중', tiLastAt: '2022-08-17 10:25:16', tiErr: '', tiCertDate: '2022-08-17',
  tiPolicy: 'LH0000000A00000', tiAmt: '55,200,000', tiInfr: 'N', tiCase: 'N', tiEreg: 'Y', tiRegAbn: 'N', tiMoveAbn: 'N',
  // 실행정보 — 계좌 / 송금 / 비용
  cCmsBank: 'SC은행', cCmsAcct: '', cCmsName: '', cSendBank: 'SC은행', cSendAcct: '', cSendName: '', cMethod: '계좌이체', cSendType: '대출금 송금',
  cbStamp: '0', cbTitle: '98,946', cbLegal: '96,880', cbReg: '62,400', cbEdu: '12,480', cbSeal: '10,000', cbTrans: '0', cbSurvey: '12,000', cbEtc: '0',
  ccStamp: '0', ccFees: '34,231', ccBond: '34,231', ccAddr: '0', ccEtc: '0',
};

const rows = <K extends string>(cols: readonly K[], data: string[][]): TableRow[] => data.map((r) => Object.fromEntries(cols.map((c, i) => [c, r[i] ?? ''])));

export const tables: Record<string, TableRow[]> = {
  loans: rows(['name', 'status', 'bal', 'bs', 'date', 'rate', 'fund'], [
    ['[주택]페퍼홈론(원리금균등)', '실행', '28,000,000', '01', '2023-02-05', '7.28', '가계'],
    ['[주택]페퍼비즈니스론(만기일시)', '완제(해지)', '0', '02', '2025-05-03', '11.05', '기업운전'],
  ]),
  cautions: rows(['reg', 'reason', 'release', 'yn'], [
    ['2026-09-01', '새출발기금매각', '-', 'N'],
    ['2026-01-05', '자산건전성요주의이하', '2026-05-02', 'Y'],
  ]),
  owners: rows(['no', 'name', 'type', 'share'], [['1', '○○○', '본인 단독 소유', '100']]),
  liens: rows(['no', 'org', 'date', 'amt', 'bal', 'cancel', 'debtor', 'refi', 'addDel'], [
    ['1', '주식회사하나은행', '2021-04-30', '90,200,000', '-', 'N', '○○○', 'B', 'B'],
  ]),
  prices: rows(['no', 'org', 'date', 'low', 'mid', 'high'], [
    ['1', 'KB시세', '2022-08-10', '137,500,000', '-', '-'],
    ['2', '정식감정', '2026-09-09', '-', '150,000,000', '-'],
  ]),
  tiMsgs: rows(['no', 'code', 'kind', 'step', 'at', 'ok', 'resend'], [
    ['1', 'FTC_0400800', '상환결과', '종료', '2022-09-01 14:20:03', 'Y', 'N'],
    ['2', 'FTC_0400800', '상환결과', '종료', '2022-09-01 14:20:01', 'Y', 'N'],
    ['3', 'FTC_0200700', '실행통지', '실행통지', '2022-08-17 13:23:41', 'Y', 'N'],
    ['4', 'FTC_0400500', '확인서', '종료', '2022-08-17 10:26:18', 'Y', 'N'],
    ['5', 'FTC_0400400', '비용내역', '비용발급완료', '2022-08-17 10:25:32', 'Y', 'N'],
    ['6', 'FTC_0400300', '전입조사결과', '전입조사완료', '2022-08-17 10:25:16', 'Y', 'N'],
    ['7', 'FTC_0400200', '등기부조사결과', '등기부조사완료', '2022-08-11 17:53:37', 'Y', 'N'],
    ['8', 'FTC_0400200', '등기부조사결과', '등기부조사완료', '2022-08-11 17:53:36', 'Y', 'N'],
    ['9', 'FTC_0200100', '청약의뢰', '청약의뢰', '2022-08-11 17:49:36', 'Y', 'Y'],
  ]),
  remits: rows(['no', 'type', 'bank', 'acct', 'holder', 'at', 'amt', 'done'], [
    ['1', '법무사(제비용)', 'SC은행', '1172-****-777', '○○법무사사무소', '2022-08-18 11:17:36', '34,231', 'Y'],
    ['2', '법무사(법무비용)', 'SC은행', '1172-****-777', '○○법무사사무소', '2022-08-18 11:17:34', '96,880', 'Y'],
    ['3', '권원', 'SC은행', '1002-****-413', '○○권원보험', '2022-08-18 11:17:32', '98,946', 'Y'],
  ]),
};

export const seedHistory: HistoryEntry[] = [
  { at: '2026-08-30 16:21:07', section: '사업장 정보', item: '연매출금액', before: '98,500,000', after: '106,062,209', by: '박책임(270115)' },
  { at: '2026-08-28 10:02:44', section: '고객정보', item: '우편물수령지', before: '직장주소', after: '현재거주지주소', by: '김상담(281102)' },
  { at: '2026-08-27 14:40:13', section: '신청정보', item: '신청금액', before: '30,000,000', after: '26,000,000', by: '박책임(270115)' },
  { at: '2026-08-25 09:15:30', section: '소득정보', item: '소득산정방법', before: '증빙소득', after: '매출액추정소득', by: '박책임(270115)' },
];
