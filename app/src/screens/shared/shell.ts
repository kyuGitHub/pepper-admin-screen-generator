import type { LnbNodeSchema, ScreenSchema } from '../../schema/types';

/* Header and LNB shared by every Digital Admin screen. Each screen marks its own branch open and its page active. */

const L = (label: string, id?: string): LnbNodeSchema => (id ? { label, id } : { label });

export const MENU = ['회원', '여신', '수신', '고객지원', '마케팅', '설정', '리포트', '시스템'];

export function header(active: string, envLabel = '테스트(Staging)'): ScreenSchema['shell']['header'] {
  return { menu: MENU, active, userName: '절삼규', userPosition: '(280820)', lastLogin: '', shortcuts: ['바로가기'], history: ['메뉴이력'], envLabel };
}

/** Top-level tree with every section closed; callers replace the section they open. */
export const BASE_TREE: Record<string, LnbNodeSchema> = {
  회원: { label: '회원', children: [L('회원조회')] },
  여신: {
    label: '여신',
    children: [
      L('요약정보'),
      { label: '개인신용', children: [L('대출신청 목록')] },
      {
        label: '모기지',
        children: [
          { label: '간편한도조회', children: [L('간편한도조회 목록')] },
          {
            label: '대출신청',
            children: [
              L('대출신청 목록'),
              L('대출신청 상세정보'),
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
  수신: { label: '수신', children: [L('예금계좌조회')] },
  고객지원: { label: '고객지원', children: [L('상담이력')] },
  마케팅: {
    label: '마케팅',
    children: [
      { label: '알림 관리', children: [L('알림 설정 목록'), L('알림 발송 이력'), L('알림 템플릿 목록')] },
      { label: '캠페인/이벤트', children: [L('캠페인 목록')] },
      { label: '리워드 광고 관리', children: [L('리워드 광고 목록')] },
      { label: '금리우대 쿠폰', children: [L('쿠폰 목록')] },
      { label: '난수쿠폰', children: [L('난수쿠폰 목록')] },
      { label: '배너 관리', children: [L('배너팝업 목록')] },
      { label: '제휴적금', children: [L('제휴적금 목록')] },
      { label: '신용관리서비스', children: [L('신용관리 목록')] },
      { label: '한도구독서비스', children: [L('한도구독 목록')] },
    ],
  },
  설정: {
    label: '설정',
    children: [
      { label: '채널 관리', children: [L('채널 목록')] },
      { label: '상품 관리', children: [L('여신 상품 목록'), L('수신 상품 목록')] },
      { label: '업무 관리', children: [L('업무 설정')] },
      { label: '기초정보 관리', children: [L('코드 관리')] },
    ],
  },
  리포트: { label: '리포트', children: [L('일일보고서')] },
  시스템: { label: '시스템', children: [L('코드관리')] },
};

/**
 * Builds the LNB with one path opened: `path` lists labels from the top-level section down to the
 * active page, e.g. ['설정', '채널 관리', '채널 목록'].
 */
export function lnb(path: string[]): ScreenSchema['shell']['lnb'] {
  const activeId = 'active';
  const open = (node: LnbNodeSchema, depth: number): LnbNodeSchema => {
    if (node.label !== path[depth]) return node;
    if (depth === path.length - 1) return { ...node, id: activeId };
    return { ...node, open: true, children: node.children?.map((c) => open(c, depth + 1)) };
  };
  return { tabs: ['업무메뉴', '즐겨찾기'], tree: MENU.map((m) => open(BASE_TREE[m], 0)), activeId };
}

/** Column spec helper for grid blocks. */
export const col = <T extends object>(key: string, label: string, o: T = {} as T) => ({ key, label, ...o });

/** Builds table rows from compact arrays. */
export const rows = (cols: readonly string[], data: readonly (readonly string[])[]) => data.map((r) => Object.fromEntries(cols.map((c, i) => [c, r[i] ?? ''])));
