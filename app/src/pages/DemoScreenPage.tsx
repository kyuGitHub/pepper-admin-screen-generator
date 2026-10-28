import { Brand, Toolbar } from '../generator/chrome';
import { ExportMenu } from '../generator/ExportMenu';
import { ScreenRenderer } from '../renderer/ScreenRenderer';
import type { ScreenSchema } from '../schema/types';

/** Demo-mode screen page (`?screen=<key>&tools=1`): the sample with [내보내기], no login or database. */
export function DemoScreenPage({ schema }: { schema: ScreenSchema }) {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Toolbar>
        <Brand />
        <span style={{ marginLeft: 12, fontWeight: 700 }}>{schema.title}</span>
        <span style={{ fontSize: 11, color: 'var(--pp-gray-450)' }}>데모 · 내장 샘플</span>
        <div style={{ marginLeft: 'auto' }}>
          <ExportMenu schema={schema} title={schema.title} meta={{ pattern: schema.tabs.length ? '상세' : '목록' }} />
        </div>
      </Toolbar>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <ScreenRenderer schema={schema} />
      </div>
    </div>
  );
}
