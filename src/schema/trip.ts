// ── 时间轴条目（kind: 'schedule'） ──
export type ScheduleItem = {
  time: string;          // 显示时间，如 "08:30"
  title: string;
  desc?: string;
  duration?: string;     // 如 "约1.5小时"
  mapKeyword?: string;   // 高德搜索关键词
  image?: string;        // 参考图片 CDN URL
  xhsKeyword?: string;   // 无图时展示小红书搜索按钮
  type?: 'sight' | 'meal' | 'transport' | 'night'; // 决定圆点颜色
};

export type ScheduleContent = {
  items: ScheduleItem[];
};

// ── 卡片列表（kind: 'cards'） ──
export type CardItem = {
  icon?: string;
  title: string;
  subtitle?: string;
  desc?: string;
  mapKeyword?: string;
  badge?: string;        // 如 "推荐"
  image?: string;        // 参考图片 CDN URL（携程/官方）
  xhsKeyword?: string;   // 无图时展示小红书搜索跳转按钮
};

export type CardsContent = {
  items: CardItem[];
};

// ── 交通卡片（kind: 'transport'） ──
export type TrainLeg = {
  num: string;           // 车次号
  from: string;
  fromTime: string;
  to: string;
  toTime: string;        // 预计，如 "~21:30"
};

export type ReturnOption = {
  num: string;
  time: string;
  note: string;
  recommended?: boolean;
};

export type TransportContent = {
  outbound: TrainLeg;
  returnOptions: ReturnOption[];
};

export type TripMeta = {
  id: string;
  title: string;
  cover?: string;
  tags?: string[];
  searchKeywords?: string[];
  start?: string; // ISO date, optional
  end?: string; // ISO date, optional
};

export type TripSection = {
  id: string; // stable key: used for localStorage notes
  title: string;
  // This project focuses on "extensible UI scaffolding".
  // Concrete rendering can be refined later per section.kind.
  kind?: 'text' | 'cards' | 'schedule' | 'transport' | 'custom';
  content?: unknown;
};

export type TripDay = {
  id: string;
  title: string;
  sections: TripSection[];
};

export type TripConfig = TripMeta & {
  days: TripDay[];
};

