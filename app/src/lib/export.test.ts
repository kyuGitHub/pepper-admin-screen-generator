import { describe, expect, it } from 'vitest';
import { SAMPLE_SCREENS } from '../screens';
import { injectSchema, safeName } from './export';

const template =
  '<!doctype html><html><head><title>Digital Admin 화면</title></head><body><script id="screen-schema" type="application/json">null</script><script type="module">x</script></body></html>';

describe('injectSchema', () => {
  it('embeds the schema JSON and the page title', () => {
    const schema = { ...SAMPLE_SCREENS.channelList.schema, data: { values: { note: '</script><b>' }, tables: {} } };
    const html = injectSchema(template, schema, '채널 목록');
    expect(html).toContain('<title>채널 목록 | Digital Admin</title>');
    expect(html).toContain('<script id="screen-schema" type="application/json">{"id"');
    expect(html).not.toContain('</script><b>');
    const json = html.match(/application\/json">([\s\S]*?)<\/script>/)![1];
    expect(JSON.parse(json).data.values.note).toBe('</script><b>');
  });

  it('refuses a template without the marker', () => {
    expect(() => injectSchema('<html></html>', SAMPLE_SCREENS.channelList.schema)).toThrow();
  });

  it('makes file-safe names', () => {
    expect(safeName('대출신청 상세정보 v3: 복제/2')).toBe('대출신청 상세정보 v3 복제 2');
  });
});
