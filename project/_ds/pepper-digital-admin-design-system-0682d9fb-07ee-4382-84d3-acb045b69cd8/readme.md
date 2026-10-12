# 페퍼저축은행 Digital Admin Design System

Design system for **디지털 어드민 (Digital Admin System)** — Pepper Savings Bank's (페퍼저축은행) internal back-office for operating, controlling and monitoring the **디지털페퍼** consumer APP/WEB financial services: members (회원), loans (여신), deposits (수신), customer support (고객지원), marketing, settings, reports and system administration. Users are bank staff (상담원, 심사역, 운영자) working on wide desktop monitors (layout min-width **1860px**).

## Sources
- Local codebase `admin/` (read-only mount; publishing package by EiLAB, CSS v0.3 2020-07-01, markup revisions 2021-06):
  - `admin/resource/css/ui_common.css` (fonts, layout: header/LNB/login/error/loading), `ui_theme.css` (Bootstrap 4.6 overrides, modal, datepicker, dark mode), `ui_helper.css` (`.new-*` utilities)
  - `admin/html/_guide/component/component.html` — the component guide (the component inventory)
  - `admin/html/_template/{layout,modal,_chart}` — layout shell, popup/alert, rMate grid & chart
  - `admin/html/page/{login,main,etc}` — login, main, 404/505, loading
  - `admin/html/sample/sample/*` — real screens (sample01 고객상담/CTI, sample05/06 dashboard light/dark, example03 공지 등록 …)
  - Third-party: Bootstrap 4.6.0, bootstrap-datepicker 1.9.0, jQuery, rMateChart / rMateGrid H5 (licensed, not copied).

## Index
- `styles.css` — entry; imports `tokens/*.css` only
- `tokens/` — `fonts.css` (@font-face NanumSquare), `colors.css`, `typography.css`, `spacing.css`, `effects.css`, `base.css`, `images.css` (`.pp-img-*` bitmap classes so asset URLs resolve from any page)
- `fonts/` — nanumsquare l/r/b/eb `.woff`
- `assets/logo/` header (white), login (colour), footer logos · `assets/layout/` LNB/header sprites · `assets/form/` checkbox/radio/clear · `assets/contents/` login background, login checkbox, loading.gif
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand)
- `components/` — React primitives (see below), one `*.card.html` per folder
- `ui_kits/admin/` — click-through Digital Admin recreation (`index.html`, `login.html`, README)
- `SKILL.md` — Agent-Skills entry point

## Components
- **core/** — `Button` (primary · outline · addon · danger · success-outline · ghost; md/lg/sm/icon), `Icon` (+`ICON_NAMES`), `Separator` (hyphen / bar)
- **forms/** — `Input`, `Select`, `Textarea`, `Checkbox`, `Radio` (+`RadioGroup`), `InputGroup`, `DateInput`, `DateRange`, `Datepicker`, `SearchBar`; internal `ChoiceControl`
- **navigation/** — `AppHeader` (GNB), `Lnb` (side tree), `Pills` (nav-pills toggle), `Tabs` (nav-tabs)
- **data/** — `Panel`, `FieldTable`, `DataGrid`, `StatTile`, `SummaryStat`, `StatusCircle`, `StepProgress`
- **feedback/** — `Modal`, `AlertModal`, `Loading`

Inventory maps 1:1 to the component guide + templates: button, radio, checkbox, input, input-clear, select, form set (input-group), datepicker & range, toggle (pills, sm), tab, collapse (search bar), helper/hyphen/middlebar, svg icons; layout header/LNB; modal popup/alert; loading; rMate grid; dashboard custom blocks (`new-card-list`, `new-table-list`, `new-circle`, `circle-step`).

### Intentional additions
- `Icon` — wraps the Bootstrap Icons SVGs that the source pastes inline; same path data.
- `DataGrid` — HTML stand-in for the licensed rMateGridH5, matching its `gridStyle` theme values.
- `Panel`, `FieldTable`, `SearchBar`, `SummaryStat`, `StatTile` — named wrappers for markup patterns that the source repeats with utility classes (`border rounded new-p15`, `table-borderless` + readonly inputs, `bg-info rounded-lg` filter bar).

---

## CONTENT FUNDAMENTALS
- **Language**: Korean UI, terse noun labels. English only for system words: "Digital Admin System", "Admin", "Logout", "Excel", "CTI", "MTD/MRR/TGT", "Not Found!".
- **Labels are nouns, not sentences**: 고객번호, 대출잔액, 최종진행단계, 상환방식, 중도수수료율. Buttons are 2–4 syllable verbs/nouns: 조회, 확인, 닫기, 다음, 취소, 등록, 초기화, 전체갱신, 전체열기/전체닫기, 전화걸기.
- **Select placeholders double as field names** — the first option is the label: 기간, 상품구분, 유입채널, 진행상태, 조회일자구분.
- **Messages** use formal polite -습니다 with 죄송합니다 for errors: "요청하신 페이지에 접근할 권한이 없습니다." / "죄송합니다. 현재 찾을 수 없는 페이지를 요청하셨습니다." Placeholder guidance: "…검색어(고객명/휴대폰/상담번호)를 입력하세요." Inline notes start with `* `.
- **No first person, no "you"**; the system is impersonal. No emoji, no exclamation except the English "Not Found!".
- **Data formatting**: dates `YYYY-MM-DD`, timestamps `YYYY-MM-DD HH:mm:ss`, phones `010-9999-1234`, amounts comma-grouped and right-aligned (`35,000,000`), rates `12.5%`, periods `36개월`, units in parentheses after titles: "(단위 건 / 백만원)". Personal summary: "나여신 ( 남성, 개인, 만 32세 )".
- **Domain vocabulary**: 여신(loan)/수신(deposit), 대환(refinance), 기표/송금(disbursement), 한도산출(limit calc), 본인확인, 전자약정, 완제, 연체, 유입채널(토스 등 플랫폼연계).
- Single-letter flag buttons (유 신 회 파 연 건 특 F) mark customer attributes — keep them single glyphs.

## VISUAL FOUNDATIONS
- **Vibe**: dense, utilitarian Bootstrap-4 back-office, re-skinned in a **charcoal navy (#2d2f3a)** with a sparing **pepper red (#df0024)**. Information density beats whitespace; 12px base text, 24px-tall controls.
- **Colour**: navy for header, primary buttons, active pills/tabs and focus borders; hover lightens to `#5c6284`, disabled to `#bec0ce`. Red only for the login CTA, the 조회 (search) button (stock Bootstrap danger `#dc3545`), the current step and calendar selection. Neutrals are warm-neutral greys (#303030 text, #707070 muted, #cacaca/#dedede borders, #f5f5f5/#f6f6f6 fills). Up/down deltas follow Korean convention: **red ▲ up, blue ▼ down** (Bootstrap primary #007bff). Status circles: green 정상, red 오류.
- **Type**: NanumSquare only (400/500/700 shipped as r/b/eb). Headings bold; panel titles 16px, page title 24px, modal 20px; LNB/GNB 14px bold; grids 13px. Numbers bold for KPIs (20–22px).
- **Backgrounds**: flat white content. Only the login page has an illustration — `login_bg.png`, navy organic wave shapes with faint rotated diamond outlines. No gradients, no textures, no photography.
- **Layout**: fixed 50px navy header (z 600) + 282px white LNB with a #93949a right rule (z 500) and a 24×54 opener tab; content padding 20px 30px; Bootstrap 12-col grid with **10px gutters** (row −5px). Screens are compositions of bordered panels in `col-2/3/4/6` splits.
- **Cards/panels**: 1px #dee2e6 border, 4px radius, 15px padding, **no shadow**. Inner KPI tiles: #f5f5f5 fill, 4px radius, no border. Filter bar: #f5f5f5, 4.8px radius, 10px 30px padding.
- **Borders**: 1px everywhere. Tabs sit on a 1px navy baseline; inactive tabs are #f6f6f6 blocks, active is white with navy top/sides. Pills are a joined segmented group with 8px #cacaca separators.
- **Corner radii**: 2px checkbox · 4px buttons/inputs/panels · 5px LNB/header controls & login fields · 10px login box · 14px modals · 25px logout pill · 50% circles.
- **Shadows**: only `0 7px 20px 5px rgba(0,0,0,.19)` on modals and `4px 0 10px rgba(223,0,36,.25)` under the login button. Backdrop rgba(0,0,0,.3); loading overlay rgba(0,0,0,.6).
- **Hover**: colour shift, never opacity (`.btn:hover{opacity:1}`): primary → #5c6284; outline → navy border+text; GNB/LNB → 2px white underline / text underline+bold; grid rows → #d5d5d8.
- **Press/focus**: active = hover colour; inputs focus to navy border + Bootstrap's blue 0.2rem glow. No scale/shrink.
- **Readonly fields** are the main data-display device: #f6f6f6 fill, border same colour — label/value tables of readonly inputs instead of plain text.
- **Animation**: essentially none — Bootstrap's .15s colour transitions, modal fade, 180° rotation on collapse carets/LNB opener, the animated loading.gif.
- **Transparency/blur**: only overlays; no blur anywhere.
- **Dark mode** (`body.mode-dark`, dashboards): page #242632, cards #20222d with #111423 border, fields/buttons #3d4150, pills #313445, primary turns blue #4f77ea, secondary text #a4a6b4. Tokens provided as `--pp-dark-*`; components are light-only.

## ICONOGRAPHY
- **Bootstrap Icons** (icons.getbootstrap.com) is the official set — the component guide instructs copying the SVG source inline, 16×16, `fill="currentColor"`, size via width/height. Seen: grid-3x3-gap-fill (calendar addon), search, x-lg (modal close, 14px #93949a), arrow-repeat (panel refresh), pencil-square, arrows-fullscreen, graph-up, bar-chart-fill, pie-chart-fill, list, caret-up-fill/caret-down-fill (deltas), caret-down-square (상세검색). These are in `components/core/Icon.jsx` with verbatim path data; add others by copying from Bootstrap Icons.
- **PNG sprites** for layout chrome: LNB plus/minus toggles, dotted tree connectors, LNB opener arrow, header select arrow, profile avatar, checkbox/radio check marks, input clear (×), login checkboxes — in `assets/`, exposed through `.pp-img-*` classes.
- No icon font, no emoji. Unicode used only for « » month nav in the datepicker and ⓒ in the copyright.
- **Logos**: PNG only — white header wordmark (85×22) next to an underlined "Admin" label, colour "pepper" wordmark on login, small footer mark. No SVG logo was provided; don't redraw it.

## Fonts
NanumSquare `.woff` files are copied from the source (no substitution). EOT files were skipped (IE-only). NanumSquare Light is shipped but unused by the source.
