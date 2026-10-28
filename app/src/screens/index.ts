import type { ScreenSchema } from '../schema/types';
import { bannerPopupListScreen } from './bannerPopupList/schema';
import { channelListScreen } from './channelList/schema';
import { loanProductListScreen } from './loanProductList/schema';
import { notificationListScreen } from './notificationList/schema';
import { loanApplicationDetailScreen } from './loanApplicationDetail/schema';

/** Built-in sample screens: demo mode picks one with `?screen=<key>`, the upload dialog offers them as starters. */
export const SAMPLE_SCREENS: Record<string, { label: string; area: string; pattern: string; schema: ScreenSchema }> = {
  loanApplicationDetail: { label: '대출신청 상세정보 v3', area: '여신', pattern: '상세', schema: loanApplicationDetailScreen },
  channelList: { label: '채널 목록 (+ 채널 설정)', area: '설정', pattern: '목록', schema: channelListScreen },
  loanProductList: { label: '여신 상품 목록 (+ 상품안내 설정)', area: '설정', pattern: '목록', schema: loanProductListScreen },
  notificationList: { label: '알림 설정 목록 (+ 알림 설정)', area: '마케팅', pattern: '목록', schema: notificationListScreen },
  bannerPopupList: { label: '배너팝업 목록 (+ 배너 팝업 설정)', area: '마케팅', pattern: '목록', schema: bannerPopupListScreen },
};
