/* 화면 스키마 작성 규칙 (요약). Claude에 보내는 프롬프트와 [사용 안내]의 내려받기에 쓰인다. 서버 함수(api/)도 읽으므로 Vite 전용 ?raw 대신 문자열 모듈로 둔다. */

export const schemaGuide = `# 화면 스키마 작성 규칙 (요약)

출력은 \`ScreenSchema\` JSON **하나**입니다. 설명문 없이 \`\`\`json 코드블록 하나만 출력합니다. 함수·주석·React 코드는 넣지 않습니다.

## 최상위 구조
\`\`\`
{
  "id": "영문-케밥-케이스",            // 화면 식별자
  "title": "화면명",
  "shell": { "header": {...}, "lnb": {...} },   // 참고 화면의 shell을 복사하고 active(상단 메뉴)와 LNB 열린 경로·activeId만 바꿈
  "favorite": true | false,             // 제목 옆 별. 생략하면 없음
  "toolbar": { "search": { "placeholder": "...", "submitLabel": "조회" }, "actions": [액션...] },   // search는 상세 화면에서만
  "summary": [패널...],                 // 탭 위 2열 패널 (상세 화면: 회원정보·신청현황 같은 요약)
  "body": [블록...],                    // 탭 없이 전체 폭 블록. 목록 화면은 body = [searchBar, grid]
  "tabs": [ { "label": "탭명", "layout": { "heightMode": "max", "height": "calc(100vh - 120px)", "align": "start", "columns": [ { "items": [패널 또는 반복그룹...] }, { "items": [...] } ] } } ],
  "modals": [ { "id": "modalId", "title": "팝업 제목", "width": 1000, "blockGap": 10, "blocks": [블록...], "footer": { "right": [액션...] } } ],
  "data": { "values": { "키": "값" }, "tables": { "테이블명": [ { "열키": "값" } ] } },
  "currentUser": "홍*동(280123)",
  "masked": true,                       // 개인정보 필드를 기본 마스킹
  "seedHistory": []                     // 정보변경이력 초기 건 (선택)
}
\`\`\`
- 목록 화면: \`tabs: []\`, \`summary: []\`, \`body: [searchBar, grid]\`, 편집 팝업은 \`modals\`.
- 상세 화면: \`summary\`(요약 패널 1~2개) + \`tabs\`(각 탭 2열 레이아웃).

## 패널
\`\`\`
{ "kind": "panel", "id": "영문id", "title": "패널명", "meta": "({rows:loans}건)", "historySection": "신청정보",
  "actions": [액션...], "blockGap": 6, "blocks": [블록...] }
\`\`\`
반복 그룹(담보제공자 1, 2 처럼 같은 패널 묶음 반복):
\`\`\`
{ "kind": "repeat", "id": "guarantors", "title": "담보제공자", "countText": "{n}명", "itemTitle": "담보제공자 {no}",
  "summaryKeys": ["gName", "gRelation"], "instances": [{ "keySuffix": "" }, { "keySuffix": "_2" }], "panels": [패널...] }
\`\`\`
반복 그룹의 필드 키는 인스턴스마다 접미사가 붙습니다 (\`gName\`, \`gName_2\`). \`data.values\`에 둘 다 넣습니다.

## 액션(버튼)
| type | 의미 | 필수 |
| --- | --- | --- |
| \`button\` | 동작 없는 목업 버튼 | \`label\`, \`variant\`(primary/outline/danger) |
| \`edit\` | 패널 수정 모드 (버튼이 취소/저장으로 바뀜) | \`label\` 선택 |
| \`history\` | 정보변경이력 팝업 | \`label\` 선택 |
| \`modal\` | 팝업 열기 | \`label\`, \`modal\`(modals[].id) |
| \`formSave\` | 셀렉트 변경 저장 | \`label\` 선택 |
| \`detailToggle\` | searchBar 안에서 상세검색 펼침 | \`label\` 선택 |

## 블록
- \`fields\` 항목 표: \`{ "type": "fields", "columns": 3, "labelWidth": "110px", "editable": false, "rows": [[셀, 셀, 셀], ...] }\`
  - 셀 = 필드 \`{ "label": "항목명", "key": "데이터키", "unit": "원", "span": 2, "mask": "name|phone|email|address", "control": {...}, "readOnly": true, "button": { "label": "체크리스트" } }\`
  - 빈 칸 \`{ "blank": 1 }\`, 안내문 \`{ "note": "...", "span": 2 }\`, 버튼 칸 \`{ "buttons": [액션...], "span": 1, "align": "right" }\`
  - 한 행의 칸 수 합(\`span\` 합 + blank)은 \`columns\`와 같게 맞춥니다.
  - \`control\`: \`{ "type": "select", "options": ["선택", "A", "B"] }\` · \`{ "type": "text", "placeholder": "..." }\` · \`{ "type": "date" }\` · \`{ "type": "time" }\` · \`{ "type": "textarea", "rows": 3 }\` · \`{ "type": "file" }\` · \`{ "type": "color" }\`
  - 읽기 전용 상세 패널은 \`control\` 없이, 편집 팝업은 \`"editable": true\`로 모든 필드를 입력창으로.
- \`searchBar\` 검색 조건: \`{ "type": "searchBar", "rows": [[조건...]], "detailRows": [[조건...]], "actions": [조회 버튼, {"type":"detailToggle"}, 초기화], "rightActions": [등록 버튼] }\`
  - 조건: \`{ "type": "select", "options": ["조건명", "전체", "A"] }\`(첫 옵션이 조건명) · \`{ "type": "dateRange" }\` · \`{ "type": "text", "placeholder": "검색어", "width": 260 }\` · \`{ "type": "checkbox", "label": "..." }\`
- \`grid\` 목록: \`{ "type": "grid", "table": "테이블명", "height": 640, "columns": [ { "key": "no", "label": "No.", "width": 50, "kind": "no" }, { "key": "name", "label": "채널명", "width": 320, "kind": "link", "modal": "modalId" }, { "key": "detail", "label": "", "width": 70, "kind": "button", "buttonLabel": "상세", "modal": "modalId" } ], "pagination": { "pageSize": 20, "pageSizes": [10, 20, 50], "totalPages": 6 } }\`
- \`table\` 패널 안의 작은 표: \`{ "type": "table", "table": "loans", "columns": [ { "key": "...", "label": "...", "align": "right", "editable": true } ], "footer": { "label": "합계", "labelSpan": 2, "sumColumn": "balance" } }\`
- \`heading\` 소제목 \`{ "type": "heading", "text": "당행기대출정보 ({rows:loans}건)", "meta": "기준일자 ..." }\` · \`divider\` \`{ "type": "divider" }\` · \`section\` \`{ "type": "section", "blocks": [...] }\`
- \`collapsible\` 접기 \`{ "type": "collapsible", "title": "수수료 관련정보", "open": true, "blocks": [...] }\` · \`tabs\` 블록 내 탭 \`{ "type": "tabs", "items": [{ "label": "...", "blocks": [...] }] }\`
- \`checklist\` \`{ "type": "checklist", "id": "precheck", "items": ["...", "..."] }\` · \`actionRow\` \`{ "type": "actionRow", "items": [액션...], "align": "right" }\` · \`editor\` 리치텍스트 \`{ "type": "editor", "height": 300 }\` · \`text\` \`{ "type": "text", "text": "...", "tone": "muted" }\` · \`empty\` \`{ "type": "empty", "text": "조회된 데이터가 없습니다." }\`

## 텍스트 템플릿
\`{rows:테이블}\` 행 수 · \`{rowsWhere:테이블.열=값}\` · \`{sumCol:테이블.열}\` · \`{sum:키1,키2}\` · \`{checked:체크리스트id}\` / \`{items:체크리스트id}\`

## 데이터 규칙
- 모든 필드 \`key\`는 화면 안에서 유일하게, \`data.values\`에 값을 넣습니다. 금액은 \`"26,000,000"\`처럼 콤마 문자열, 날짜는 \`2026-10-01\`, 일시는 \`2026-10-01 10:23:45\`.
- \`grid\`/\`table\`의 \`table\`마다 \`data.tables\`에 행 배열을 넣습니다 (목록은 페이지 크기만큼, 보통 20행).
- 실제 고객 정보는 절대 넣지 않습니다. 사람 이름·전화·주소는 가짜로, 직원명은 \`정**(280123)\` 형식.
- 라벨은 한글, 기존 어드민 용어를 그대로 (조회·초기화·신규 등록·상세·정보변경이력·저장·취소·닫기).
- \`modal\` 액션과 그리드 열의 \`modal\`은 반드시 \`modals[].id\` 중 하나를 가리킵니다.
`;
