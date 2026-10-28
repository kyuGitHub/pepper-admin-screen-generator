/* Immutable path helpers over plain JSON data (the screen schema). A path is a list of object keys and array indices. */

export type Path = (string | number)[];

export function getAt(obj: unknown, path: Path): unknown {
  let cur: unknown = obj;
  for (const k of path) {
    if (cur === null || cur === undefined) return undefined;
    cur = (cur as Record<string | number, unknown>)[k];
  }
  return cur;
}

function cloneStep(node: unknown, key: string | number): Record<string | number, unknown> | unknown[] {
  if (Array.isArray(node)) return [...node];
  if (node && typeof node === 'object') return { ...(node as Record<string, unknown>) };
  return typeof key === 'number' ? [] : {};
}

/** Returns a copy of `obj` with the value at `path` replaced (containers along the path are cloned). */
export function setAt<T>(obj: T, path: Path, value: unknown): T {
  if (path.length === 0) return value as T;
  const [k, ...rest] = path;
  const copy = cloneStep(obj, k) as Record<string | number, unknown>;
  copy[k] = setAt(copy[k], rest, value);
  return copy as T;
}

export function updateAt<T>(obj: T, path: Path, fn: (cur: unknown) => unknown): T {
  return setAt(obj, path, fn(getAt(obj, path)));
}

/** Removes an array element; `path` must end in an index. */
export function removeAt<T>(obj: T, path: Path): T {
  const idx = path[path.length - 1] as number;
  return updateAt(obj, path.slice(0, -1), (arr) => (Array.isArray(arr) ? arr.filter((_, i) => i !== idx) : arr));
}

/** Inserts `value` into the array at the parent of `path`, at the index the path ends in. */
export function insertAt<T>(obj: T, path: Path, value: unknown): T {
  const idx = path[path.length - 1] as number;
  return updateAt(obj, path.slice(0, -1), (arr) => {
    const a = Array.isArray(arr) ? [...arr] : [];
    a.splice(idx, 0, value);
    return a;
  });
}

/** Moves the array element at `path` by `delta` positions (clamped). Returns the new path. */
export function moveAt<T>(obj: T, path: Path, delta: number): { next: T; path: Path } {
  const idx = path[path.length - 1] as number;
  const parentPath = path.slice(0, -1);
  const arr = getAt(obj, parentPath);
  if (!Array.isArray(arr)) return { next: obj, path };
  const to = Math.max(0, Math.min(arr.length - 1, idx + delta));
  if (to === idx) return { next: obj, path };
  const a = [...arr];
  const [item] = a.splice(idx, 1);
  a.splice(to, 0, item);
  return { next: setAt(obj, parentPath, a), path: [...parentPath, to] };
}

export const samePath = (a: Path | null, b: Path | null) => !!a && !!b && a.length === b.length && a.every((k, i) => k === b[i]);
