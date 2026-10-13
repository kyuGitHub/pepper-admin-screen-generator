# pepper-admin-screen-generator
디지털어드민 화면 제너레이터

- `app/` — 스키마 기반 화면 렌더러 (React + TypeScript + Vite). 실행 방법은 [`app/README.md`](app/README.md) 참고
- `project/` — Claude Design에서 내보낸 원본 디자인(대출신청 상세정보 v3 등)과 디자인시스템
- `chats/` — 디자인 작업 대화 기록
- `preview/` — 구현 화면을 한 파일로 묶은 HTML (더블클릭으로 바로 보기)
- `HANDOFF.md` — 디자인 핸드오프 안내

## Vercel 배포
Vercel 프로젝트의 **Root Directory를 `app`** 으로 두고 Deploy하면 됩니다. 빌드 설정은 `app/vercel.json`에 있습니다(Vite, `npm run build`, 결과물 `dist`).

[Vercel에서 Import하기](https://vercel.com/new/import?s=https%3A%2F%2Fgithub.com%2FkyuGitHub%2Fpepper-admin-screen-generator)

- `main`에 푸시하면 운영 URL이, PR을 열면 미리보기 URL이 자동으로 갱신됩니다.
- 외부 공개를 막으려면 Vercel 프로젝트의 Settings → Deployment Protection을 켜세요.
