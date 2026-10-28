import { ExportMenu } from '../generator/ExportMenu';
import { GenCanvas, GenPage, GenToolbar, GenToolbarHeading } from '../generator/ui';
import { ScreenRenderer } from '../renderer/ScreenRenderer';
import type { ScreenSchema } from '../schema/types';

/** Demo-mode screen page (`?screen=<key>&tools=1`): the sample on the canvas with [내보내기], no login or database. */
export function DemoScreenPage({ schema }: { schema: ScreenSchema }) {
  return (
    <GenPage fullHeight>
      <GenToolbar>
        <GenToolbarHeading title={schema.title} meta="데모 · 내장 샘플" />
        <div style={{ marginLeft: 'auto' }}>
          <ExportMenu schema={schema} title={schema.title} meta={{ pattern: schema.tabs.length ? '상세' : '목록' }} />
        </div>
      </GenToolbar>
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <GenCanvas label={schema.title} meta="1860 × 1100">
          <ScreenRenderer schema={schema} />
        </GenCanvas>
      </div>
    </GenPage>
  );
}
