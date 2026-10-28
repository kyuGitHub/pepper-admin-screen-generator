import type { ScreenSchema } from '../schema/types';
import guide from './schemaGuide.md?raw';

/* 인테이크 질문지 → Claude에 붙여넣을 프롬프트. The generator app itself never calls an AI; the PM pastes this
   into Claude (Max), gets a ScreenSchema JSON back and uploads it with [새 화면 올리기]. */

export interface IntakeForm {
  title: string;
  area: string;
  pattern: string;
  menuPath: string;
  purpose: string;
  items: string;
  listSpec: string;
  buttons: string;
  modals: string;
  cases: string;
  notes: string;
  includeReference: boolean;
}

export const EMPTY_INTAKE: IntakeForm = {
  title: '',
  area: '여신',
  pattern: '상세',
  menuPath: '',
  purpose: '',
  items: '',
  listSpec: '',
  buttons: '',
  modals: '',
  cases: '',
  notes: '',
  includeReference: true,
};

export const INTAKE_FIELDS: { key: keyof IntakeForm; label: string; hint: string; rows?: number; required?: boolean; listOnly?: boolean }[] = [
  { key: 'title', label: '화면명', hint: '예: 대출신청 서류접수 목록', required: true },
  { key: 'menuPath', label: '메뉴 경로', hint: '예: 여신 > 모기지 > 대출신청 > 대출신청 서류접수 목록', required: true },
  {
    key: 'purpose',
    label: '화면 목적 · 사용자',
    hint: '누가 언제 무엇을 하는 화면인지 1~2문장. 예: 심사역이 접수된 서류를 확인하고 보완 요청을 보낸다',
    rows: 2,
    required: true,
  },
  {
    key: 'items',
    label: '항목 목록 (패널별)',
    hint: '패널 제목은 "## 패널명", 항목은 한 줄에 하나. "항목명 | 입력형태 | 단위 | 비고" 순서로 쓰면 정확합니다.\n예:\n## 접수정보\n접수번호\n접수일시\n접수채널 | 선택: 토스/카카오/자사앱\n신청금액 | 숫자 | 원\n## 서류정보\n서류종류 | 선택: 신분증/소득증빙/재직증명\n제출여부 | Y/N\n보완요청사유 | 여러 줄',
    rows: 10,
    required: true,
  },
  {
    key: 'listSpec',
    label: '검색 조건 · 목록 열 (목록 화면일 때)',
    hint: '검색 조건과 목록 열을 각각 한 줄에 하나. 예:\n검색: 접수일자(기간), 접수채널(선택), 상태(선택: 전체/접수/보완요청/완료), 고객명/접수번호(텍스트, 상세검색)\n열: No, 접수번호(링크→접수 상세 팝업), 고객명, 접수채널, 신청금액, 상태, 접수일시, 처리자, [상세] 버튼',
    rows: 5,
    listOnly: true,
  },
  {
    key: 'buttons',
    label: '버튼과 동작',
    hint: '한 줄에 하나 "버튼명 - 동작". 예:\n보완요청 - 보완요청 팝업 열기\n접수정보 수정 - 패널 수정 모드\n정보변경이력 - 이력 팝업',
    rows: 4,
  },
  {
    key: 'modals',
    label: '팝업',
    hint: '팝업마다 제목과 들어갈 항목·하단 버튼. 예:\n보완요청 팝업: 요청사유(선택), 상세내용(여러 줄), 발송채널(알림톡/SMS 체크) / [취소][발송]',
    rows: 4,
  },
  {
    key: 'cases',
    label: '케이스 · 상태별 차이',
    hint: '예: 상태가 완료면 수정 버튼 숨김 / 법인 고객이면 사업장 정보 패널 추가. 케이스별 화면이 따로 필요하면 적어 주세요 (복제로 만듭니다)',
    rows: 3,
  },
  { key: 'notes', label: '특이사항', hint: '마스킹 항목, 권한, 금액 합계·건수 표시, 참고할 기존 화면·캡처, 금지사항 등', rows: 3 },
];

const AREA_MENU: Record<string, string> = {
  여신: '여신',
  수신: '수신',
  홈뱅킹: '회원',
  회원: '회원',
  고객지원: '고객지원',
  마케팅: '마케팅',
  설정: '설정',
  리포트: '리포트',
  시스템: '시스템',
};

export function buildPrompt(form: IntakeForm, reference?: { title: string; schema: ScreenSchema }): string {
  const lines: string[] = [];
  const section = (label: string, text: string) => {
    if (text.trim()) lines.push(`### ${label}`, text.trim(), '');
  };
  lines.push(
    '당신은 페퍼저축은행 디지털어드민(Digital Admin) 화면 제너레이터의 스키마 작성자입니다.',
    '아래 요청서대로 어드민 화면 하나를 `ScreenSchema` JSON으로 작성하세요. 설명 없이 ```json 코드블록 하나만 출력합니다.',
    '요청서에 없는 세부는 기존 어드민 관행(참고 화면)을 따르고, 애매한 항목은 가장 흔한 형태로 정한 뒤 JSON 안에 넣지 말고 출력 마지막에 "가정:" 목록으로 3줄 이내로 적습니다.',
    '',
    '## 요청서',
    `- 화면명: ${form.title.trim() || '(미정)'}`,
    `- 영역 / 패턴: ${form.area} / ${form.pattern}`,
    `- 메뉴 경로: ${form.menuPath.trim() || `${AREA_MENU[form.area] ?? form.area} > … > ${form.title.trim()}`}  (shell.header.active와 LNB 열린 경로·activeId에 반영)`,
    '',
  );
  section('화면 목적 · 사용자', form.purpose);
  section('항목 목록 (패널별)', form.items);
  if (form.pattern === '목록') section('검색 조건 · 목록 열', form.listSpec);
  section('버튼과 동작', form.buttons);
  section('팝업', form.modals);
  section('케이스 · 상태별 차이', form.cases);
  section('특이사항', form.notes);
  lines.push(
    '### 공통 요구',
    '- 패턴이 "목록"이면 body = [searchBar, grid] + 편집 팝업, "상세"면 summary 패널 + tabs(2열)로 구성합니다.',
    '- 모든 필드에 그럴듯한 샘플 값을 `data.values`에, 목록에는 20행의 샘플 행을 `data.tables`에 넣습니다. 실제 고객 정보는 금지입니다.',
    '- 라벨·버튼명은 요청서의 표현을 그대로 씁니다. 요청서에 없는 버튼은 만들지 않습니다.',
    '',
    '## 스키마 작성 규칙',
    guide.replace(/^# .*\n/, '').trim(),
    '',
  );
  if (reference) {
    lines.push(`## 참고 화면 스키마 — "${reference.title}" (같은 형식·같은 shell로 작성)`, '```json', JSON.stringify(reference.schema, null, 1), '```', '');
  }
  return lines.join('\n');
}

/** The questionnaire as Markdown, for PMs who prefer to fill it in a doc first. */
export function intakeMarkdown(): string {
  const out = ['# 화면 요청서 (인테이크 질문지)', '', '화면 제너레이터의 [요청서 만들기]와 같은 항목입니다. 채운 뒤 그대로 붙여넣으면 됩니다.', ''];
  for (const f of INTAKE_FIELDS) {
    out.push(`## ${f.label}${f.required ? ' *' : ''}${f.listOnly ? ' (목록 화면)' : ''}`, '', `> ${f.hint.replace(/\n/g, '\n> ')}`, '', '(여기에 작성)', '');
  }
  return out.join('\n');
}
