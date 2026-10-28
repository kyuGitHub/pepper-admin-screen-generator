# Digital Admin 화면 렌더러 (Screen Generator 기반)

`project/대출신청 상세정보 v3.dc.html`(Claude Design 핸드오프)을 React + TypeScript + Vite로 구현했습니다.
화면은 **JSON 직렬화 가능한 스키마**로 정의되고, 렌더러가 페퍼 디지털어드민 디자인시스템 컴포넌트로 그립니다.
향후 "화면 제너레이터"는 이 스키마를 만들어 주는 편집 UI만 추가하면 됩니다.

```bash
npm install
cp .env.example .env   # Supabase URL·anon 키 입력. 비워 두면 로그인 없는 데모 모드(샘플 화면만)
npm run dev            # http://localhost:5173
npm run build          # 타입체크 + dist/ 빌드
```

## 제너레이터 (스프린트 0)
- `/login` — Supabase 이메일/비밀번호 로그인. 계정은 Supabase 대시보드에서 초대 메일로 발급하고, 초대 링크를 열면 `/set-password`에서 비밀번호를 정합니다.
- `/` — 화면 목록: 썸네일 카드, 제목·영역·패턴·작성자 검색, [요청서 만들기] [사용 안내] [AI로 화면 만들기] [새 화면 올리기]
- `/screens/:id` — 저장된 스키마를 렌더러로 표시, [편집](`?edit=1`로 바로 편집), [복제], [내보내기 ▾], 삭제. 편집 모드에 [AI 수정]
- DB·스토리지 정의는 `../supabase/schema.sql` (Supabase SQL Editor에서 실행)

## AI로 화면 만들기 (앱 안에서 생성)
목록의 [AI로 화면 만들기](`/generate`)에서 요구사항 텍스트(+ 캡처 이미지 최대 4장)를 넣으면 Vercel 서버 함수(`api/generate.ts`)가 Claude API를 호출해 화면 스키마를 만들고, 검증 → 샘플 데이터 채움 → 저장 → 편집 모드로 엽니다. 편집 모드의 [AI 수정]은 "신청정보 패널에 상환방식 추가" 같은 문장을 변경 명령으로 받아 초안에 적용합니다(실행취소 가능).

| 항목 | 내용 |
| --- | --- |
| 모델 | 기본 Sonnet 5.5 (`claude-sonnet-5-5`), 선택 Opus 5.5. 화면당 약 350~650원(Sonnet) |
| 프롬프트 | 시스템: 스키마 작성 규칙(캐시) · 사용자: 참고 화면 JSON(캐시) + 이미지 + 요구사항 |
| 검증 | 결과 JSON을 `validateScreenSchema`로 검사, 실패 시 오류를 돌려줘 1회 자동 재시도 |
| 보안 | API 키는 Vercel 환경변수 `ANTHROPIC_API_KEY`에만(브라우저로 나가지 않음). Supabase 로그인 토큰이 있어야 호출됨 |
| 한도·기록 | 사용자별 24시간 `AI_DAILY_LIMIT`회(기본 30). 호출마다 `ai_runs` 테이블에 토큰·비용·소요시간 기록 (`../supabase/schema.sql` 4절) |
| 실행 시간 | 보통 1~3분, 진행 상황 스트리밍. `vercel.json`의 `maxDuration: 300` |

설정 순서:
1. [Anthropic Console](https://console.anthropic.com) → API Keys → 키 발급 (Billing에서 선불 충전과 월 한도 설정 권장).
2. Vercel → 프로젝트 → Settings → Environment Variables → `ANTHROPIC_API_KEY` 등록(값은 키 그대로, 접두사 없음) → Redeploy.
3. Supabase SQL Editor에서 `../supabase/schema.sql`의 4절(ai_runs)을 실행. 실행 전에도 생성은 되지만 한도와 기록이 동작하지 않습니다.
4. 로컬: `.env`에 `ANTHROPIC_API_KEY`를 넣으면 `npm run dev`에서 `/api/generate`가 같은 코드로 동작합니다(`vite.config.ts`의 dev 플러그인). 키 없이 UI만 볼 때는 `AI_MOCK=1`.

## 요청서 → Claude → 화면 (인테이크)
AI 생성은 Claude(Max 계정)에서, 앱은 요청서와 프롬프트만 만듭니다(API 비용 없음).

- `/intake` **요청서 만들기** — 화면명·메뉴 경로·목적·항목(패널별)·검색 조건/목록 열·버튼과 동작·팝업·케이스·특이사항을 적으면 오른쪽에 Claude용 프롬프트가 만들어집니다. [AI로 바로 생성]을 누르면 같은 내용으로 앱 안에서 생성합니다. 프롬프트에는 스키마 작성 규칙(`src/lib/schemaGuide.md`)과 참고 화면(내장 샘플 또는 저장된 화면)의 JSON이 포함되어 같은 형식으로 나옵니다. 입력은 브라우저에 자동 저장됩니다.
- `/guide` **사용 안내** — 6단계 흐름, 요령, PM 파일럿 체크리스트, 인테이크 질문지·스키마 규칙 .md 내려받기.
- 데모 모드: `?intake=1`, `?guide=1`, `?kit=1`(컴포넌트 갤러리).

## 샘플 데이터 자동 생성
`src/lib/sampleData.ts`가 라벨·데이터 키·단위로 값을 추정합니다 (금액→콤마 숫자, 일시→`2026-10-01 10:23:45`, 여부→Y/N, 처리자→`이름(사번)`, 셀렉트→옵션 중 하나 …). 같은 키는 항상 같은 값이 나오며 실제 고객 정보는 쓰지 않습니다.

- [새 화면 올리기]의 "빈 값·빈 목록은 샘플 데이터로 채우기"(기본 켬)
- 편집기에서 화면 제목 클릭 → 샘플 데이터 [빈 값 채우기] / [전체 다시 생성]

## 내보내기와 복제
화면 보기의 [내보내기 ▾] 메뉴. 모두 브라우저 안에서 스키마로부터 만들어지며 서버로 보내는 것은 없습니다.

| 메뉴 | 결과 | 용도 |
| --- | --- | --- |
| URL 복사 | 현재 화면 주소 | 로그인한 PM·개발자에게 공유 (1순위 산출물) |
| 화면정의서 열기 (HTML) | 새 탭의 인쇄용 문서 (인쇄 → PDF 저장, 표 드래그 복사) | 개발자 전달용 화면정의서 |
| 화면정의서 내려받기 (Markdown) | `<화면명> 화면정의서.md` | Confluence·Notion에 붙여넣기 |
| 단일 HTML 내려받기 | `<화면명>.html` (약 1.8MB, 폰트·이미지 포함) | 오프라인에서 더블클릭으로 열어 시연 |
| PNG 내려받기 | `<화면명>.png` (1860×1100, 첫 탭) | PPT·메신저 첨부 |
| JSON 내려받기 | 스키마 원본 | Claude에 다시 넣어 수정, 다른 화면의 바탕 |
| 썸네일 갱신 | 목록 카드 이미지 재생성 | 흰 썸네일이 보일 때 |

화면정의서(`src/lib/spec.ts`)는 1. 화면 개요(메뉴 경로·URL·작성자) 2. 화면 구성(툴바·탭·팝업 수) 3. 패널별 항목 정의(항목명·데이터 키·입력 형태·단위·마스킹·비고, 패널 버튼, 표/목록 열, 검색 조건) 4. 팝업 정의 5. 버튼 동작 정리(동작 미정의 버튼 표시)로 구성됩니다.

- **복제**: 화면 보기와 목록 카드의 [복제]는 "<화면명> (복제)" 화면을 새로 만들고 원본을 `source_id`로 기록합니다. 케이스(정상/오류/권한별 화면)를 만들 때 복제 후 편집하세요.
- 단일 HTML은 `public/viewer-template.html`(빌드 시 `scripts/build-viewer.mjs`가 생성, git 제외)에 스키마를 심어 만듭니다. `npm run dev`와 `npm run build`가 자동으로 만듭니다.
- 데모 모드에서는 `?screen=<key>&tools=1`로 내보내기 메뉴를 써 볼 수 있습니다.

## 클릭 편집기
화면 보기에서 [편집]을 누르면 미리보기가 편집 모드로 바뀝니다. 미리보기에서 요소를 클릭하면 오른쪽 속성 패널에서 바로 고칠 수 있고, 결과는 즉시 미리보기에 반영됩니다.

| 클릭하는 곳 | 고칠 수 있는 것 |
| --- | --- |
| 화면 제목 | 제목, 즐겨찾기 별, 환경 표시, 툴바 버튼, 탭·상단 패널·팝업 추가 |
| 패널 제목 영역 | 제목, 보조 문구, 패널 버튼, 필드·소제목·구분선 추가, 패널 추가·삭제·순서 |
| 필드 라벨/값 | 라벨, 값, 데이터 키, 단위, 칸 수, 마스킹, 입력 형태(셀렉트·텍스트·날짜 …), 옆 버튼, 필드 추가·삭제·순서, 행 추가·삭제, 필드 표의 열 수·라벨 정렬 |
| 버튼 | 버튼명, 동작(수정 모드·이력·팝업 열기 …), 스타일, 추가·삭제·순서 |
| 탭 | 탭 이름, 열에 패널 추가, 탭 추가·삭제·순서 |
| 그리드 열 제목 | 열 제목, 데이터 키, 너비, 정렬, 표시 형태(번호·링크·버튼), 샘플 값(앞 3행), 추가·삭제·순서 |
| 검색 조건 | 종류(셀렉트·기간·텍스트·체크박스)와 항목, 추가·삭제·순서 |
| 팝업 제목(열어 둔 상태) | 제목, 너비, 필드·소제목 추가, 하단 버튼, 삭제 |

- 툴바: [실행취소](Ctrl+Z, 최근 50단계) · [취소](편집 종료) · [저장](Supabase에 스키마 저장 + 썸네일 다시 생성)
- Esc 키 또는 빈 곳 클릭으로 선택을 해제합니다. 편집 중에도 탭 전환·팝업 열기 등 목업 동작은 그대로 됩니다.
- 데모 모드(Supabase 미설정)에서는 `?screen=<key>&edit=1`로 열리고, [저장] 대신 [JSON 내려받기]가 됩니다. `?screen=<key>&thumb=1`은 썸네일 캡처 결과를 보여 줍니다(디버깅용).
- 구현: `src/editor/` (`EditorContext` 선택·초안·되돌리기, `PropertyPanel` 속성 폼, `EditorFrame` 편집 화면 틀, `paths` 스키마 경로 수정 도우미). 렌더러는 편집 컨텍스트가 있을 때만 요소를 `Selectable`로 감쌉니다.

## 두 개의 디자인시스템
| 영역 | 디자인시스템 | 코드 |
| --- | --- | --- |
| 렌더러가 그리는 **어드민 화면** (캔버스 안, 내보낸 HTML·PNG·썸네일) | Pepper Digital Admin (`--pp-*`, NanumSquare, 네이비·페퍼 레드, 밀도 우선) | `src/design-system/` |
| **제너레이터 UI** (로그인, 화면 목록, 업로드, 툴바·메뉴, 편집기 속성 패널, AI 생성, 요청서, 안내) | Generator (`--gen-*`, IBM Plex Sans KR·Mono, 다크 작업공간, 에디터 블루) | `src/generator/tokens.css`, `src/generator/ui.tsx` |

Generator 디자인시스템은 Claude Design의 "화면 제너레이터 — UI kit"(2026-10-28)에서 가져왔습니다. 어드민 화면은 제너레이터 안에서 1860×1100 프레임(`GenCanvas`)에 놓이며, 스키마의 `100vh` 높이는 프레임 높이를 따릅니다(`--screen-vh`). 데모 모드 `?kit=1`에서 컴포넌트 갤러리를 볼 수 있습니다.

## 구조

| 경로 | 내용 |
| --- | --- |
| `src/design-system/` | Digital Admin 디자인시스템 포팅(어드민 화면 전용): Button, Input, Select, Checkbox/Radio, InputGroup, Panel, FieldTable, Tabs, Modal, AppHeader, Lnb + 토큰/폰트/이미지 |
| `src/generator/` | Generator 디자인시스템(제너레이터 UI 전용): 토큰, GenButton·GenInput·GenSelect·GenTextarea·GenCheckbox·GenCodeArea·GenToolbar·GenMenu·GenDialog·GenScreenCard·GenCanvas·GenPropertyPanel 등 27종, 내보내기 메뉴 |
| `src/schema/types.ts` | 화면 스키마 정의 (탭 → 열 → 패널/반복그룹 → 블록·필드·액션) |
| `src/renderer/` | 스키마 렌더러와 목업 런타임 (수정→저장/취소, 정보변경이력, 마스킹, 접기/펼치기, 모달, 합계 계산) |
| `src/editor/` | 클릭 편집기 (요소 선택, 속성 패널, 추가·삭제·순서, 실행취소, 저장) |
| `src/lib/spec.ts`, `src/lib/export.ts` | 화면정의서 생성(Markdown·HTML), 단일 HTML·PNG·JSON 내보내기 |
| `src/lib/intake.ts`, `src/lib/schemaGuide.ts`, `src/lib/sampleData.ts` | 요청서 → Claude 프롬프트, 스키마 작성 규칙, 샘플 데이터 생성 |
| `api/generate.ts`, `src/server/ai.ts`, `src/lib/ai.ts` | AI 생성 서버 함수(인증·한도·스트리밍), 프롬프트·변경 명령 적용, 브라우저 호출 |
| `scripts/` | 단일 파일 빌드 (`build-single.mjs` 데모 전체, `build-viewer.mjs` 내보내기용 뷰어 템플릿) |
| `src/screens/loanApplicationDetail/` | v3 화면 스키마(`schema.ts`)와 샘플 데이터(`data.ts`) |

## 스키마 주요 요소
- **패널 액션**: `button`(동작 없음) · `edit`(패널 수정 모드) · `history`(해당 구분으로 필터된 정보변경이력) · `modal` · `formSave`(셀렉트 저장, 변경 시에만 활성)
- **블록**: `fields`, `table`(편집 가능 컬럼·체크박스·링크·버튼·합계 행), `heading`, `section`, `divider`, `checklist`, `controls`, `totals`, `kvStrip`, `kvTable`, `dirtyNotice` …
- **반복 그룹**: 담보제공자처럼 동일 패널 묶음을 인스턴스별(키 접미사)로 반복하고 접기/펼치기 제공
- **텍스트 템플릿**: `{rows:loans}`, `{rowsWhere:cautions.yn=N}`, `{sum:a,b}`, `{checked:precheck}` 등으로 건수·합계를 상태에서 계산

모든 변경은 메모리에만 저장되며 새로고침하면 초기화됩니다.

## 내장 샘플 화면
`src/screens/index.ts`에 등록된 샘플은 데모 모드에서 `?screen=<key>`로 열 수 있고, [새 화면 올리기]의 샘플 선택에도 나옵니다.

| key | 화면 | 패턴 |
| --- | --- | --- |
| `loanApplicationDetail` | 대출신청 상세정보 v3 | 상세 |
| `channelList` | 채널 목록 + 채널 설정 | 목록 + 편집 모달 |
| `loanProductList` | 여신 상품 목록 + 여신 상품안내 설정 | 목록 + 편집 모달 |
| `notificationList` | 알림 설정 목록 + 알림 설정 | 목록 + 편집 모달 |
| `bannerPopupList` | 배너팝업 목록 + 배너 팝업 설정 | 목록 + 편집 모달 |

목록 화면은 `body` 블록(`searchBar` + `grid`)으로, 편집 모달은 `modals[].blocks`의 `fields(editable)`·`collapsible`·`tabs`·`editor`로 정의합니다. 전체 블록 목록은 `src/schema/types.ts`를 보세요.

## 단일 HTML로 보기
`npm run build:single`을 실행하면 `preview/대출신청 상세정보 v3.html`이 다시 만들어집니다. 폰트·이미지까지 한 파일에 들어 있어 더블클릭으로 오프라인에서 열립니다.

## 개발 체크
```bash
npm run lint     # ESLint
npm run format   # Prettier 검사 (수정: npm run format:fix)
npm test         # Vitest
```
PR과 `main` 푸시마다 GitHub Actions(`.github/workflows/ci.yml`)가 위 세 가지와 빌드를 실행합니다. Node 22 (`.nvmrc`).
