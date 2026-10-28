import { describe, expect, it } from 'vitest';
import { getAt, insertAt, moveAt, removeAt, samePath, setAt } from './paths';

const doc = { title: 't', tabs: [{ label: 'a', items: [1, 2, 3] }, { label: 'b' }] };

describe('paths', () => {
  it('reads and writes nested values without mutating the source', () => {
    expect(getAt(doc, ['tabs', 1, 'label'])).toBe('b');
    const next = setAt(doc, ['tabs', 0, 'label'], 'A');
    expect(next.tabs[0].label).toBe('A');
    expect(doc.tabs[0].label).toBe('a');
    expect(next.tabs[1]).toBe(doc.tabs[1]); // untouched branches are shared
  });

  it('inserts, removes and moves array elements', () => {
    expect(insertAt(doc, ['tabs', 0, 'items', 1], 9).tabs[0].items).toEqual([1, 9, 2, 3]);
    expect(removeAt(doc, ['tabs', 0, 'items', 0]).tabs[0].items).toEqual([2, 3]);
    const moved = moveAt(doc, ['tabs', 0, 'items', 0], 2);
    expect(moved.next.tabs[0].items).toEqual([2, 3, 1]);
    expect(moved.path).toEqual(['tabs', 0, 'items', 2]);
    expect(moveAt(doc, ['tabs', 0, 'items', 2], 5).path).toEqual(['tabs', 0, 'items', 2]);
  });

  it('compares paths', () => {
    expect(samePath(['a', 1], ['a', 1])).toBe(true);
    expect(samePath(['a', 1], ['a', '1'])).toBe(false);
    expect(samePath(null, ['a'])).toBe(false);
  });
});
