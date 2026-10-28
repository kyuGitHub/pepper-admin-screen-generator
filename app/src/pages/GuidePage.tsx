import { Link } from 'react-router-dom';
import { Brand, Toolbar } from '../generator/chrome';
import { downloadText } from '../lib/export';
import { intakeMarkdown } from '../lib/intake';
import { schemaGuide as guide } from '../lib/schemaGuide';

/* 사용 안내: the PM flow in six steps, what each export is for, and the pilot checklist. */

const STEPS: { title: string; body: string }[] = [
  {
    title: '요청서 작성',
    body: '[요청서 만들기]에서 화면명·메뉴 경로·항목·버튼·팝업을 적습니다. 현업이 보낸 캡처·목록을 그대로 붙여넣어도 됩니다. 참고 화면(같은 패턴의 기존 화면)을 고르면 Claude가 같은 형식으로 만듭니다.',
  },
  {
    title: 'Claude에서 JSON 생성',
    body: '[프롬프트 복사] → Claude(Max 계정) 새 대화에 붙여넣기 → 돌아온 ```json 블록을 복사합니다. 결과가 마음에 안 들면 같은 대화에서 "신청정보 패널에 상환방식 추가" 처럼 말로 고칩니다.',
  },
  {
    title: '화면 올리기',
    body: '[새 화면 올리기]에 JSON을 붙여넣고 저장합니다. 형식 오류는 줄 번호와 함께 안내됩니다. 빈 값은 샘플 데이터로 자동으로 채워집니다.',
  },
  {
    title: '클릭 편집',
    body: '화면을 열고 [편집]. 라벨·값·버튼을 클릭해 고치고, 필드·패널·탭을 추가합니다. [저장]하면 썸네일도 갱신됩니다. 케이스별 화면은 [복제] 후 편집합니다.',
  },
  {
    title: '검토 공유',
    body: '[내보내기 ▾ → URL 복사]로 PM리더·현업리더에게 보냅니다(로그인 필요). 회의에서는 화면을 그대로 열어 시연하고, 수정 요청은 편집기에서 즉시 반영합니다.',
  },
  {
    title: '개발 전달',
    body: '[화면정의서 열기]로 항목·데이터 키·입력 형태·버튼 동작 표를 PDF로 저장하거나 Confluence에 붙여넣습니다. "동작 정의 필요" 버튼은 개발자와 협의할 목록입니다. 단일 HTML은 디자이너·퍼블리셔 참고용입니다.',
  },
];

export function GuidePage({ demo = false }: { demo?: boolean }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--pp-gray-80)', fontFamily: 'var(--font-sans)', color: 'var(--pp-gray-900)' }}>
      <Toolbar>
        {!demo && (
          <>
            <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: 13 }}>
              ← 목록
            </Link>
            <span style={{ color: 'var(--pp-gray-450)' }}>|</span>
          </>
        )}
        <Brand />
        <span style={{ marginLeft: 12, fontWeight: 700 }}>사용 안내</span>
      </Toolbar>
      <main style={{ maxWidth: 980, margin: '0 auto', padding: '24px 30px', fontSize: 13, lineHeight: 1.7 }}>
        <h1 style={{ fontSize: 22, margin: '0 0 4px' }}>화면 제너레이터 사용 흐름</h1>
        <p style={{ margin: '0 0 18px', color: 'var(--pp-gray-700)' }}>
          PPT 화면설계서 대신, 요청서 → Claude → 클릭 편집 → URL 공유 → 화면정의서 전달까지 한 흐름입니다. 화면 하나에 목표 10분.
        </p>
        <ol style={{ paddingLeft: 0, listStyle: 'none', margin: 0 }}>
          {STEPS.map((s, i) => (
            <li
              key={i}
              style={{
                display: 'flex',
                gap: 14,
                background: '#fff',
                border: '1px solid var(--border-default)',
                borderRadius: 8,
                padding: '12px 16px',
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  background: 'var(--pp-navy-800)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 2 }}>{s.title}</div>
                <div style={{ color: 'var(--pp-gray-800)' }}>{s.body}</div>
              </div>
            </li>
          ))}
        </ol>

        <h2 style={{ fontSize: 16, margin: '26px 0 8px' }}>잘 만들기 위한 요령</h2>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>항목은 패널 단위로 묶어 적고, 입력형태(선택/날짜/여부/금액)를 함께 쓰면 한 번에 맞게 나옵니다.</li>
          <li>버튼은 "버튼명 - 동작" 형태로. 동작을 모르면 그대로 비워 두면 화면정의서에 "동작 정의 필요"로 표시됩니다.</li>
          <li>기존 화면과 비슷하면 그 화면을 참고 화면으로 고르세요. 메뉴·헤더·용어가 그대로 유지됩니다.</li>
          <li>JSON이 길어 잘리면 Claude에게 "이어서 출력"이라고 하거나, 패널 수를 줄여 두 화면으로 나누세요.</li>
          <li>실제 고객 정보는 어디에도 넣지 않습니다. 캡처를 붙일 때도 가린 뒤 사용하세요.</li>
        </ul>

        <h2 style={{ fontSize: 16, margin: '26px 0 8px' }}>파일럿 체크리스트 (PM 팀)</h2>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>계정: Supabase 대시보드 → Authentication → Users → Invite user로 PM 이메일 초대. 초대 메일의 링크에서 비밀번호 설정.</li>
          <li>첫 과제: 각자 맡은 소매금융 통합시스템 화면 1개를 요청서부터 화면정의서까지 끝까지 만들어 보기 (목표 1시간 이내).</li>
          <li>측정: 화면 1개 소요 시간, 수정 왕복 횟수, 개발자가 추가로 물어본 항목 수. 기존 PPT 방식(30분~3시간/화면)과 비교.</li>
          <li>피드백: 막힌 지점·없는 블록·틀린 용어를 목록 화면 제목 옆에 "(피드백)" 화면으로 복제해 남기거나, 팀 채널에 URL과 함께 올리기.</li>
          <li>품질 기준: 개발 착수 회의에서 화면정의서만으로 질문 없이 넘어가면 합격.</li>
        </ul>

        <h2 style={{ fontSize: 16, margin: '26px 0 8px' }}>문서</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button type="button" onClick={() => downloadText('화면 요청서(인테이크 질문지).md', intakeMarkdown(), 'text/markdown')} style={docBtn}>
            인테이크 질문지 (.md)
          </button>
          <button type="button" onClick={() => downloadText('화면 스키마 작성 규칙.md', guide, 'text/markdown')} style={docBtn}>
            스키마 작성 규칙 (.md)
          </button>
          {!demo && (
            <Link to="/intake" style={{ ...docBtn, textDecoration: 'none', display: 'inline-block' }}>
              요청서 만들기 →
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}

const docBtn = {
  font: 'inherit',
  fontSize: 12,
  padding: '6px 12px',
  border: '1px solid var(--pp-navy-800)',
  background: '#fff',
  color: 'var(--pp-navy-800)',
  borderRadius: 4,
  cursor: 'pointer',
} as const;
