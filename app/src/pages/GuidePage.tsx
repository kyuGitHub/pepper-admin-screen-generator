import { useNavigate } from 'react-router-dom';
import { GenButton, GenPage, GenStepItem, GenToolbar } from '../generator/ui';
import { AppNav } from './AppNav';
import { downloadText } from '../lib/export';
import { intakeMarkdown } from '../lib/intake';
import { schemaGuide as guide } from '../lib/schemaGuide';

/* 사용 안내: the PM flow in six steps, what each export is for, and the pilot checklist. */

const STEPS: { title: string; body: string }[] = [
  {
    title: '요구사항 정리',
    body: '[AI로 화면 만들기]에 화면명·목적·패널별 항목·버튼·팝업을 적습니다. 현업이 보낸 캡처를 붙이면 그 레이아웃을 따릅니다. 긴 요청은 [요청서 만들기] 양식으로 정리한 뒤 [AI로 바로 생성]을 누르세요.',
  },
  {
    title: 'AI 생성',
    body: '1~3분 뒤 검증을 거친 화면이 저장되고 편집 모드로 열립니다. Claude(Max)에서 직접 만들고 싶으면 요청서의 [프롬프트 복사] → 돌아온 JSON을 [새 화면 올리기]에 넣습니다.',
  },
  {
    title: '클릭 편집',
    body: '라벨·값·버튼을 클릭해 고치고 필드·패널·탭을 추가합니다. 문장으로 고치려면 [AI 수정]. [저장]하면 썸네일도 갱신됩니다. 케이스별 화면은 [복제] 후 편집합니다.',
  },
  {
    title: '검토 공유',
    body: '[내보내기 ▾ → URL 복사]로 PM리더·현업리더에게 보냅니다(로그인 필요). 회의에서는 화면을 그대로 열어 시연하고, 수정 요청은 편집기에서 즉시 반영합니다.',
  },
  {
    title: '개발 전달',
    body: '[화면정의서 열기]로 항목·데이터 키·입력 형태·버튼 동작 표를 PDF로 저장하거나 Confluence에 붙여넣습니다. "동작 정의 필요" 버튼은 개발자와 협의할 목록입니다.',
  },
  {
    title: '보관·재사용',
    body: '단일 HTML은 디자이너·퍼블리셔 참고용, JSON은 다음 화면의 참고 화면으로 다시 씁니다. 화면은 목록에서 검색·복제·삭제할 수 있습니다.',
  },
];

export function GuidePage({ demo = false }: { demo?: boolean }) {
  const navigate = useNavigate();
  return (
    <GenPage>
      <GenToolbar>
        <AppNav />
      </GenToolbar>
      <main style={{ maxWidth: 980, margin: '0 auto', padding: '24px 30px', fontSize: 13, lineHeight: 1.7 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, margin: '0 0 4px', letterSpacing: '-0.01em' }}>페퍼 어드민 제너레이터 사용 흐름</h1>
        <p style={{ margin: '0 0 18px', color: 'var(--gen-text-sub)' }}>
          PPT 화면설계서 대신, 요구사항 → AI 생성 → 클릭 편집 → URL 공유 → 화면정의서 전달까지 한 흐름입니다. 화면 하나에 목표 10분.
        </p>
        <ol style={{ padding: 0, margin: 0, display: 'grid', gap: 10 }}>
          {STEPS.map((s, i) => (
            <GenStepItem key={i} n={i + 1} title={s.title}>
              {s.body}
            </GenStepItem>
          ))}
        </ol>

        <h2 style={{ fontSize: 15, fontWeight: 600, margin: '28px 0 8px' }}>잘 만들기 위한 요령</h2>
        <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--gen-text-sub)' }}>
          <li>항목은 패널 단위로 묶어 적고, 입력형태(선택/날짜/여부/금액)를 함께 쓰면 한 번에 맞게 나옵니다.</li>
          <li>버튼은 "버튼명 - 동작" 형태로. 동작을 모르면 그대로 비워 두면 화면정의서에 "동작 정의 필요"로 표시됩니다.</li>
          <li>기존 화면과 비슷하면 그 화면을 참고 화면으로 고르세요. 메뉴·헤더·용어가 그대로 유지됩니다.</li>
          <li>결과가 길어 잘리면 패널 수를 줄여 두 화면으로 나누고, 마음에 안 드는 부분은 [AI 수정]으로 문장으로 고치세요.</li>
          <li>실제 고객 정보는 어디에도 넣지 않습니다. 캡처를 붙일 때도 가린 뒤 사용하세요.</li>
        </ul>

        <h2 style={{ fontSize: 15, fontWeight: 600, margin: '28px 0 8px' }}>파일럿 체크리스트 (PM 팀)</h2>
        <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--gen-text-sub)' }}>
          <li>계정: Supabase 대시보드 → Authentication → Users → Invite user로 PM 이메일 초대. 초대 메일의 링크에서 비밀번호 설정.</li>
          <li>첫 과제: 각자 맡은 소매금융 통합시스템 화면 1개를 요구사항부터 화면정의서까지 끝까지 만들어 보기 (목표 1시간 이내).</li>
          <li>측정: 화면 1개 소요 시간, AI 재요청 횟수, 개발자가 추가로 물어본 항목 수. 기존 PPT 방식(30분~3시간/화면)과 비교.</li>
          <li>피드백: 막힌 지점·없는 블록·틀린 용어를 "(피드백)" 화면으로 복제해 남기거나, 팀 채널에 URL과 함께 올리기.</li>
          <li>품질 기준: 개발 착수 회의에서 화면정의서만으로 질문 없이 넘어가면 합격.</li>
        </ul>

        <h2 style={{ fontSize: 15, fontWeight: 600, margin: '28px 0 8px' }}>문서</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <GenButton onClick={() => downloadText('화면 요청서(인테이크 질문지).md', intakeMarkdown(), 'text/markdown')}>인테이크 질문지 (.md)</GenButton>
          <GenButton onClick={() => downloadText('화면 스키마 작성 규칙.md', guide, 'text/markdown')}>스키마 작성 규칙 (.md)</GenButton>
          {!demo && (
            <GenButton variant="primary" onClick={() => navigate('/intake')}>
              요청서 만들기 →
            </GenButton>
          )}
        </div>
      </main>
    </GenPage>
  );
}
