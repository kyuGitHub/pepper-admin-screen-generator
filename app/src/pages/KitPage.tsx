import { useState } from 'react';
import {
  GenButton,
  GenCenterCard,
  GenCheckbox,
  GenCodeArea,
  GenDialog,
  GenEmptyState,
  GenErrorText,
  GenField,
  GenInput,
  GenMenu,
  GenModeBadge,
  GenPage,
  GenScreenCard,
  GenSection,
  GenSelect,
  GenStepItem,
  GenTag,
  GenTextarea,
  GenToolbar,
  GenToolbarButton,
  GenToolbarHeading,
} from '../generator/ui';

/** Demo-mode gallery (`?kit=1`) of the generator chrome, for visual checks without a login. */
export function KitPage() {
  const [dialog, setDialog] = useState(false);
  return (
    <GenPage>
      <GenToolbar>
        <GenToolbarHeading onBack={() => {}} title="UI 키트" meta="generator · dark" />
        <GenModeBadge />
        <GenModeBadge dirty />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <GenToolbarButton tone="primary">편집</GenToolbarButton>
          <GenToolbarButton>복제</GenToolbarButton>
          <GenMenu
            label="내보내기"
            items={[{ label: 'URL 복사', hint: '공유', onSelect: () => {} }, 'divider', { label: '삭제', danger: true, onSelect: () => {} }]}
            toast="복사했습니다"
          />
          <GenToolbarButton tone="danger">삭제</GenToolbarButton>
        </div>
      </GenToolbar>
      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '28px 32px', display: 'grid', gap: 20 }}>
        <GenSection n="01" title="컨트롤" lead="버튼 4종 × 3크기, 입력, 선택, 여러 줄, 체크박스, 코드 영역">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
            {(['primary', 'secondary', 'ghost', 'danger'] as const).map((v) => (
              <GenButton key={v} variant={v}>
                {v}
              </GenButton>
            ))}
            <GenButton size="sm">sm</GenButton>
            <GenButton size="lg">lg</GenButton>
            <GenButton disabled>disabled</GenButton>
            <GenTag>여신</GenTag>
            <GenTag kind="pattern">목록</GenTag>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <GenField label="입력" required>
              <GenInput placeholder="예: 채널 목록" />
            </GenField>
            <GenField label="선택">
              <GenSelect options={['여신', '수신', '설정']} />
            </GenField>
            <GenField label="읽기 전용">
              <GenInput value="MG2026082400073" readOnly />
            </GenField>
          </div>
          <GenField label="여러 줄">
            <GenTextarea rows={3} placeholder="항목을 한 줄에 하나씩" />
          </GenField>
          <GenField label="코드">
            <GenCodeArea value={'{ "title": "채널 목록", "tabs": [] }'} height={90} />
          </GenField>
          <GenCheckbox label="빈 값은 샘플로 채우기" defaultChecked />
          <GenErrorText>오류 문구 예시: "tabs" 항목의 형식이 다릅니다.</GenErrorText>
          <GenButton onClick={() => setDialog(true)}>다이얼로그 열기</GenButton>
        </GenSection>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <GenScreenCard
            title="채널 목록 (+ 채널 설정)"
            area="설정"
            pattern="목록"
            updatedAt="2026-10-28 10:14"
            author="pm@pepper.co.kr"
            onOpen={() => {}}
            onDuplicate={() => {}}
            onDelete={() => {}}
          />
          <GenEmptyState>아직 화면이 없습니다.</GenEmptyState>
          <ol style={{ padding: 0, margin: 0, display: 'grid', gap: 10 }}>
            <GenStepItem n={1} title="요구사항 정리">
              화면명·항목·버튼을 적습니다.
            </GenStepItem>
          </ol>
        </div>
        <GenCenterCard title="화면 제너레이터 로그인" fullPage={false}>
          <GenField label="이메일">
            <GenInput size="lg" defaultValue="pm@pepper.co.kr" />
          </GenField>
          <GenField label="비밀번호">
            <GenInput size="lg" type="password" />
          </GenField>
          <GenButton variant="primary" size="lg" block>
            로그인
          </GenButton>
        </GenCenterCard>
      </main>
      <GenDialog
        open={dialog}
        title="새 화면 올리기"
        onClose={() => setDialog(false)}
        footer={
          <>
            <GenButton onClick={() => setDialog(false)}>취소</GenButton>
            <GenButton variant="primary">저장</GenButton>
          </>
        }
      >
        <GenField label="화면 이름">
          <GenInput placeholder="예: 채널 목록" />
        </GenField>
        <GenCodeArea value="" placeholder='{ "title": "..." }' height={160} />
      </GenDialog>
    </GenPage>
  );
}
