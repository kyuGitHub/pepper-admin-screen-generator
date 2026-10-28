# Digital Admin 화면 렌더러 (Screen Generator 기반)

`project/대출신청 상세정보 v3.dc.html`(Claude Design 핸드오프)을 React + TypeScript + Vite로 구현했습니다.
화면은 **JSON 직렬화 가능한 스키마**로 정의되고, 렌더러가 페퍼 디지털어드민 디자인시스템 컴포넌트로 그립니다.
향후 "화면 제너레이터"는 이 스키마를 만들어 주는 편집 UI만 추가하면 됩니다.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 타입체크 + dist/ 빌드
```

## 구조

| 경로 | 내용 |
| --- | --- |
| `src/design-system/` | 디자인시스템 번들(`_ds_bundle.js`) 포팅: Button, Input, Select, Checkbox/Radio, InputGroup, Panel, FieldTable, Tabs, Modal, AppHeader, Lnb + 토큰/폰트/이미지 |
| `src/schema/types.ts` | 화면 스키마 정의 (탭 → 열 → 패널/반복그룹 → 블록·필드·액션) |
| `src/renderer/` | 스키마 렌더러와 목업 런타임 (수정→저장/취소, 정보변경이력, 마스킹, 접기/펼치기, 모달, 합계 계산) |
| `src/screens/loanApplicationDetail/` | v3 화면 스키마(`schema.ts`)와 샘플 데이터(`data.ts`) |

## 스키마 주요 요소
- **패널 액션**: `button`(동작 없음) · `edit`(패널 수정 모드) · `history`(해당 구분으로 필터된 정보변경이력) · `modal` · `formSave`(셀렉트 저장, 변경 시에만 활성)
- **블록**: `fields`, `table`(편집 가능 컬럼·체크박스·링크·버튼·합계 행), `heading`, `section`, `divider`, `checklist`, `controls`, `totals`, `kvStrip`, `kvTable`, `dirtyNotice` …
- **반복 그룹**: 담보제공자처럼 동일 패널 묶음을 인스턴스별(키 접미사)로 반복하고 접기/펼치기 제공
- **텍스트 템플릿**: `{rows:loans}`, `{rowsWhere:cautions.yn=N}`, `{sum:a,b}`, `{checked:precheck}` 등으로 건수·합계를 상태에서 계산

모든 변경은 메모리에만 저장되며 새로고침하면 초기화됩니다.

## 단일 HTML로 보기
`npm run build:single`을 실행하면 `preview/대출신청 상세정보 v3.html`이 다시 만들어집니다. 폰트·이미지까지 한 파일에 들어 있어 더블클릭으로 오프라인에서 열립니다.

## 개발 체크
```bash
npm run lint     # ESLint
npm run format   # Prettier 검사 (수정: npm run format:fix)
npm test         # Vitest
```
PR과 `main` 푸시마다 GitHub Actions(`.github/workflows/ci.yml`)가 위 세 가지와 빌드를 실행합니다. Node 22 (`.nvmrc`).
