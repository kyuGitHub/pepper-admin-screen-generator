import type { ScreenSchema } from '../schema/types';
import { channelListScreen } from './channelList/schema';
import { loanApplicationDetailScreen } from './loanApplicationDetail/schema';

/** Built-in sample screens: demo mode picks one with `?screen=<key>`, the upload dialog offers them as starters. */
export const SAMPLE_SCREENS: Record<string, { label: string; area: string; pattern: string; schema: ScreenSchema }> = {
  loanApplicationDetail: { label: '대출신청 상세정보 v3', area: '여신', pattern: '상세', schema: loanApplicationDetailScreen },
  channelList: { label: '채널 목록 (+ 채널 설정)', area: '설정', pattern: '목록', schema: channelListScreen },
};
