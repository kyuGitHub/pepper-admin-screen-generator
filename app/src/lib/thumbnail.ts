import type { ScreenSchema } from '../schema/types';
import { renderOffscreen } from './offscreen';

/** Small PNG of the first tab for the screen list cards (null when capture fails; callers keep the placeholder). */
export const captureThumbnail = (schema: ScreenSchema): Promise<Blob | null> => renderOffscreen(schema, { pixelRatio: 0.25 });
