import type { TripConfig } from '../schema/trip'

// 示例配置：用于验证 UI 骨架与本地备注存储逻辑。
// 后续新增旅行只需要新增 `src/trips/<tripId>.ts` 并在 registry 登记即可。
const demoTrip: TripConfig = {
  id: 'demo',
  title: '示例旅行',
  tags: ['demo'],
  searchKeywords: ['旅行', '旅游', '目的地'],
  start: '2026-04-01',
  end: '2026-04-03',
  days: [
    {
      id: 'd1',
      title: 'Day 1',
      sections: [
        { id: 's1', title: '本块 1', kind: 'text', content: { text: '这里先放占位内容。' } },
        { id: 's2', title: '本块 2', kind: 'text', content: { text: '后续你的具体旅行数据会填充到这里。' } },
      ],
    },
  ],
}

export default demoTrip

