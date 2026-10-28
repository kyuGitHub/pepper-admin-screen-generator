import type { ScreenSchema } from '../schema/types';
import { db } from './supabase';

export interface ScreenRow {
  id: string;
  title: string;
  area: string;
  pattern: string;
  schema: ScreenSchema;
  thumbnail_path: string | null;
  source_id: string | null;
  created_by_email: string | null;
  created_at: string;
  updated_at: string;
}

export type ScreenSummary = Omit<ScreenRow, 'schema'>;

export const AREAS = ['여신', '수신', '홈뱅킹', '회원', '고객지원', '마케팅', '설정', '리포트', '시스템'] as const;
export const PATTERNS = ['상세', '목록', '모달', '대시보드'] as const;

const SUMMARY_COLUMNS = 'id,title,area,pattern,thumbnail_path,source_id,created_by_email,created_at,updated_at';

export async function listScreens(): Promise<ScreenSummary[]> {
  const { data, error } = await db().from('screens').select(SUMMARY_COLUMNS).order('updated_at', { ascending: false });
  if (error) throw error;
  return data as ScreenSummary[];
}

export async function getScreen(id: string): Promise<ScreenRow> {
  const { data, error } = await db().from('screens').select('*').eq('id', id).single();
  if (error) throw error;
  return data as ScreenRow;
}

export async function createScreen(input: {
  title: string;
  area: string;
  pattern: string;
  schema: ScreenSchema;
  source_id?: string | null;
}): Promise<ScreenRow> {
  const { data: auth } = await db().auth.getUser();
  const { data, error } = await db()
    .from('screens')
    .insert({ ...input, created_by: auth.user?.id ?? null, created_by_email: auth.user?.email ?? null })
    .select('*')
    .single();
  if (error) throw error;
  return data as ScreenRow;
}

export async function updateScreen(id: string, patch: Partial<Pick<ScreenRow, 'title' | 'area' | 'pattern' | 'schema' | 'thumbnail_path'>>): Promise<void> {
  const { error } = await db().from('screens').update(patch).eq('id', id);
  if (error) throw error;
}

export async function deleteScreen(id: string, thumbnailPath: string | null): Promise<void> {
  if (thumbnailPath) await db().storage.from('thumbnails').remove([thumbnailPath]);
  const { error } = await db().from('screens').delete().eq('id', id);
  if (error) throw error;
}

export async function uploadThumbnail(id: string, blob: Blob): Promise<string> {
  const path = `${id}.png`;
  const { error } = await db().storage.from('thumbnails').upload(path, blob, { contentType: 'image/png', upsert: true });
  if (error) throw error;
  return path;
}

export function thumbnailUrl(path: string | null, updatedAt: string): string | null {
  if (!path) return null;
  const { data } = db().storage.from('thumbnails').getPublicUrl(path);
  // Cache-bust per update so a re-captured thumbnail shows immediately.
  return `${data.publicUrl}?v=${encodeURIComponent(updatedAt)}`;
}
