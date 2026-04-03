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
  kind?: 'text' | 'cards' | 'schedule' | 'custom';
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

