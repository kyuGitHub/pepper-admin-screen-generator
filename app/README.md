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
- `/` — 화면 목록: 썸네일 카드, 제목·영역·패턴·작성자 검색, [새 화면 올리기]
- `/screens/:id` — 저장된 스키마를 렌더러로 표시, [편집], [복제], [내보내기 ▾], 삭제
- DB·스토리지 정의는 `../supabase/schema.sql` (Supabase SQL Editor에서 실행)

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

## 구조

| 경로 | 내용 |
| --- | --- |
| `src/design-system/` | 디자인시스템 번들(`_ds_bundle.js`) 포팅: Button, Input, Select, Checkbox/Radio, InputGroup, Panel, FieldTable, Tabs, Modal, AppHeader, Lnb + 토큰/폰트/이미지 |
| `src/schema/types.ts` | 화면 스키마 정의 (탭 → 열 → 패널/반복그룹 → 블록·필드·액션) |
| `src/renderer/` | 스키마 렌더러와 목업 런타임 (수정→저장/취소, 정보변경이력, 마스킹, 접기/펼치기, 모달, 합계 계산) |
| `src/editor/` | 클릭 편집기 (요소 선택, 속성 패널, 추가·삭제·순서, 실행취소, 저장) |
| `src/lib/spec.ts`, `src/lib/export.ts` | 화면정의서 생성(Markdown·HTML), 단일 HTML·PNG·JSON 내보내기 |
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
