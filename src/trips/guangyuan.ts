import type { TripConfig, TransportContent, ScheduleContent, CardsContent } from '../schema/trip'

// 携程 CDN 图片（已验证可访问）
const IMG = {
  qianfoya:  'https://dimg04.c-ctrip.com/images/1A0h1700000120wdg9553.jpg',
  hilton:    'https://dimg04.c-ctrip.com/images/200f0z000000miaau473D_W_1280_853_R5_Q70.jpg',
  jiujing:   'https://dimg04.c-ctrip.com/images/1mc3n12000nv3s2vq9C48_W_1280_853_R5_Q70.jpg',
}

const guangyuanTrip: TripConfig = {
  id: 'guangyuan-3d',
  title: '广元三天两晚',
  tags: ['四川', '古城', '栈道', '轻松游'],
  searchKeywords: ['广元', '昭化古城', '皇泽寺', '千佛崖', '明月峡'],
  // 日期用「周几」展示，不写具体日期
  start: '周五',
  end: '周日',

  days: [
    // ─────────── 周五 · 到达 ───────────
    {
      id: 'fri',
      title: '周五 · 到达广元',
      sections: [
        {
          id: 'fri-transport',
          title: '往返交通',
          kind: 'transport',
          content: {
            outbound: {
              num: 'D2007',
              from: '西安北',
              fromTime: '19:31',
              to: '广元',
              toTime: '~21:30',
            },
            returnOptions: [
              { num: 'G2208',      time: '15:25', note: '下午早班，时间略紧' },
              { num: 'G1840/1841', time: '16:46', note: '中间选项，较宽裕' },
              { num: 'G2240',      time: '20:33', note: '最宽松，可多玩半天', recommended: true },
            ],
          } satisfies TransportContent,
        },
        {
          id: 'fri-hotel',
          title: '住宿推荐（连住两晚）',
          kind: 'cards',
          content: {
            items: [
              {
                icon: '🏨',
                title: '广元希尔顿欢朋酒店',
                desc: '品牌连锁，服务稳定，广元高档酒店榜 No.1',
                mapKeyword: '广元希尔顿欢朋酒店',
                image: IMG.hilton,
              },
              {
                icon: '☕',
                title: '喆啡酒店（图腾广场店）',
                desc: '设计风格，Café + Hotel，性价比高',
                mapKeyword: '喆啡酒店图腾广场广元',
                xhsKeyword: '广元喆啡酒店图腾广场',
              },
              {
                icon: '🌿',
                title: '旧静度假酒店',
                desc: '环境安静，适合放松型旅行，距广元站约 18 分钟',
                mapKeyword: '旧静度假酒店广元',
                image: IMG.jiujing,
              },
            ],
          } satisfies CardsContent,
        },
        {
          // 美食融合进晚间行程，不单独开页签
          id: 'fri-night',
          title: '周五晚间',
          kind: 'schedule',
          content: {
            items: [
              {
                time: '21:30',
                title: '🚖 广元站打车入住',
                desc: '约 10~15 分钟到市区酒店',
                type: 'transport',
              },
              {
                time: '22:00',
                title: '🐷 小香猪火盆烧烤',
                desc: '纯碳烤，下高铁必去首选。小香猪是招牌，炭火香气足',
                mapKeyword: '小香猪火盆烧烤广元',
                xhsKeyword: '广元小香猪火盆烧烤',
                type: 'meal',
              },
              {
                time: '22:00',
                title: '🍗 疯狂烤翅（备选）',
                desc: '烤翅好吃，本地口碑极佳，皮脆肉嫩',
                mapKeyword: '疯狂烤翅广元',
                xhsKeyword: '广元疯狂烤翅',
                type: 'meal',
              },
              {
                time: '22:00',
                title: '🔥 碳上烤烧烤（备选）',
                desc: '烤猪蹄软糯入味，炭火慢烤，口感绝佳',
                mapKeyword: '碳上烤烧烤广元',
                xhsKeyword: '广元碳上烤烧烤',
                type: 'meal',
              },
              {
                time: '宵夜',
                title: '🏮 老城小吃街',
                desc: '广元本地风味，热闹，推荐广元凉面、霉豆腐',
                mapKeyword: '广元老城小吃街',
                xhsKeyword: '广元老城小吃街',
                type: 'sight',
              },
              {
                time: '宵夜',
                title: '🌙 东坝夜市（二选一）',
                desc: '东坝片区，摊位多，选择丰富',
                mapKeyword: '广元东坝夜市',
                xhsKeyword: '广元东坝夜市',
                type: 'sight',
              },
            ],
          } satisfies ScheduleContent,
        },
      ],
    },

    // ─────────── 周六 · 古城探访 ───────────
    {
      id: 'sat',
      title: '周六 · 古城探访',
      sections: [
        {
          // 早餐、景点、午餐全部融合在一条时间轴里
          id: 'sat-morning',
          title: '上午 + 午餐',
          kind: 'schedule',
          content: {
            items: [
              {
                time: '08:00',
                title: '🍜 臊子凉面（早餐）',
                desc: '秘制臊子，鲜香爽口，广元特色早点，不要错过',
                mapKeyword: '臊子凉面广元',
                xhsKeyword: '广元臊子凉面',
                type: 'meal',
              },
              {
                time: '08:30',
                title: '🥬 蜀门市场早市',
                desc: '霉豆腐、泡菜、核桃、蒸凉面均可买，支持真空打包带走',
                duration: '约50分钟',
                mapKeyword: '蜀门市场广元',
                xhsKeyword: '广元蜀门市场早市',
                type: 'sight',
              },
              {
                time: '09:20',
                title: '🚶 嘉陵江滨江路散步',
                desc: '沿滨江路慢走，凤凰山若封闭直接跳过',
                duration: '约50分钟',
                mapKeyword: '嘉陵江滨江路广元',
                type: 'transport',
              },
              {
                time: '10:10',
                title: '🛕 皇泽寺',
                desc: '中国唯一的女皇祀庙，6窟1203躯北魏至明清摩崖石刻，不用赶慢慢看',
                duration: '约1.5小时',
                mapKeyword: '皇泽寺广元',
                xhsKeyword: '广元皇泽寺',
                type: 'sight',
              },
              {
                time: '11:50',
                title: '⛩ 千佛崖',
                desc: '四川规模最大的石窟群，950余龛7000余尊，密如蜂巢，震撼。从皇泽寺打车约 10 分钟',
                duration: '约1.2小时',
                mapKeyword: '千佛崖广元',
                image: IMG.qianfoya,
                type: 'sight',
              },
              {
                // 午餐三选一，各自带导航，融合在时间轴中
                time: '13:10',
                title: '🍲 韩记火锅（市委旗舰）',
                desc: '广元本地连锁旗舰，麻辣鲜香，公园街196号，📞0839-3273355',
                duration: '约1.5小时',
                mapKeyword: '韩记火锅市委广元',
                xhsKeyword: '广元韩记火锅',
                type: 'meal',
              },
              {
                time: '13:10',
                title: '🍚 柴火饭（苴国市场）（备选）',
                desc: '柴火米饭，菌菌香，可让老板特制，朴实鲜香',
                mapKeyword: '柴火饭苴国市场广元',
                xhsKeyword: '广元柴火饭苴国市场',
                type: 'meal',
              },
              {
                time: '13:10',
                title: '🫕 贾鸭肠（备选）',
                desc: '小碗菜品，比网红火锅更地道，鲜嫩弹牙，本地人常去',
                mapKeyword: '贾鸭肠广元',
                xhsKeyword: '广元贾鸭肠',
                type: 'meal',
              },
            ],
          } satisfies ScheduleContent,
        },
        {
          id: 'sat-zhaohua',
          title: '下午 · 昭化古城',
          kind: 'schedule',
          content: {
            items: [
              {
                time: '14:30',
                title: '🚖 网约车 → 昭化古城',
                desc: '约 40~70 元，40~60 分钟。随时走，省去等班车焦虑',
                type: 'transport',
              },
              {
                time: '14:30',
                title: '🏯 昭化古城漫游',
                desc: '国内保存最完好的三国古城，"巴蜀第一县"。主街、县衙、考棚、城墙，节奏随意，不赶',
                duration: '约3.5小时',
                mapKeyword: '昭化古城广元',
                xhsKeyword: '广元昭化古城',
                type: 'sight',
              },
            ],
          } satisfies ScheduleContent,
        },
        {
          // 晚餐推荐 + 夜间活动合并，不单独开页签
          id: 'sat-evening',
          title: '晚间 · 晚餐 + 活动',
          kind: 'cards',
          content: {
            items: [
              {
                icon: '🐟',
                title: '何记老万州烤鱼（17:00开门）',
                subtitle: '活鱼现杀现烤，推荐蒜香微微辣',
                desc: '从昭化返回市区后直奔，鲜嫩多汁，火候到位',
                mapKeyword: '何记老万州烤鱼广元',
                xhsKeyword: '广元何记老万州烤鱼',
                badge: '17:00开门',
              },
              {
                icon: '🍄',
                title: '海伶山珍（高端选）',
                subtitle: '菌子主题，赵露思同款，人均约150元',
                desc: '菌汤浓郁鲜美，想吃得精致可选，建议提前订座',
                mapKeyword: '海伶山珍广元',
                xhsKeyword: '广元海伶山珍',
                badge: '人均150',
              },
              {
                icon: '🌉',
                title: '方案 A · 回广元吃鱼 + 游船',
                subtitle: '南河江边鱼庄（上海路/滨河南路）→ 嘉陵江夜游游船',
                desc: '游船：美团/携程/抖音搜"广元嘉陵江游船"提前购票，提前20分钟到码头',
                mapKeyword: '南河江边鱼庄广元',
                xhsKeyword: '广元嘉陵江夜游游船',
                badge: '江景推荐',
              },
              {
                icon: '🏮',
                title: '方案 B · 留昭化看夜景',
                subtitle: '灯笼街/西市夜色 → 古城内晚餐 → 葭萌春秋演出',
                desc: '22:00 前后网约车回广元约 50~90 元，或直接住昭化',
                mapKeyword: '昭化古城广元',
                xhsKeyword: '昭化古城夜景',
                badge: '省力省钱',
              },
            ],
          } satisfies CardsContent,
        },
      ],
    },

    // ─────────── 周日 · 明月峡返程 ───────────
    {
      id: 'sun',
      title: '周日 · 明月峡返程',
      sections: [
        {
          id: 'sun-schedule',
          title: '上午行程',
          kind: 'schedule',
          content: {
            items: [
              {
                time: '09:00',
                title: '🚖 酒店出发 → 明月峡',
                desc: '网约车直达，约 40~55 分钟，单程约 60~100 元',
                type: 'transport',
              },
              {
                time: '09:50',
                title: '🏞 明月峡历史文化旅游区',
                desc: '"中国道路交通博物馆"，嘉陵江峡谷五条古道并行，沿栈道步行，轻松不爬山，可随意拍照',
                duration: '约2.5小时',
                mapKeyword: '明月峡历史文化旅游区广元',
                xhsKeyword: '广元明月峡',
                type: 'sight',
              },
              {
                time: '13:00',
                title: '🍜 午餐',
                desc: '朝天城区简餐，或返回市区再选',
                duration: '约1小时',
                type: 'meal',
              },
              {
                time: '14:30',
                title: '🚄 前往广元站',
                desc: '提前 45~60 分钟到站，周末人多安检慢',
                mapKeyword: '广元站',
                type: 'transport',
              },
            ],
          } satisfies ScheduleContent,
        },
        {
          id: 'sun-alt',
          title: '周日备选方案',
          kind: 'cards',
          content: {
            items: [
              {
                icon: '🏛',
                title: '市区博物馆 + 滨江',
                desc: '广元市博物馆（带身份证）+ 嘉陵江滨江漫步，雨天/早班车适用',
                mapKeyword: '广元市博物馆',
                xhsKeyword: '广元市博物馆',
              },
              {
                icon: '🌊',
                title: '明月峡 + 雪溪洞',
                desc: '两处同属朝天方向，G2240 晚班可玩，体力充沛时选',
                mapKeyword: '明月峡历史文化旅游区广元',
                xhsKeyword: '广元明月峡',
              },
              {
                icon: '🌲',
                title: '翠云廊',
                desc: '剑阁方向古柏驿道，平缓步行不爬山，单程约 1~1.5 小时',
                mapKeyword: '翠云廊剑阁',
                xhsKeyword: '剑阁翠云廊',
              },
              {
                icon: '⛰',
                title: '天曌山',
                desc: '山林风光，距市区约 1 小时，需早出发',
                mapKeyword: '天曌山广元',
                xhsKeyword: '广元天曌山',
              },
              {
                icon: '🫀',
                title: '三娃子肥肠（元坝）',
                desc: '凉拌肥肠，蒜香扑鼻，入口软糯。需专程去元坝，G2240 晚班可顺路安排',
                mapKeyword: '三娃子肥肠元坝广元',
                xhsKeyword: '广元三娃子肥肠元坝',
                badge: '需去元坝',
              },
            ],
          } satisfies CardsContent,
        },
      ],
    },

    // ─────────── 实用速查 ───────────
    {
      id: 'tips',
      title: '实用速查',
      sections: [
        {
          id: 'tips-emergency',
          title: '应急备案',
          kind: 'cards',
          content: {
            items: [
              { icon: '⛰', title: '凤凰山封闭',        desc: '周六上午动线不受影响，已不纳入行程' },
              { icon: '⛵', title: '嘉陵江游船停航',    desc: '方案A改为纯吃鱼+滨江散步，或直接切换方案B' },
              { icon: '🌧', title: '明月峡遇雨',        desc: '改市区博物馆+室内购物，轻松收尾' },
              { icon: '🚌', title: '昭化班车等待太久',  desc: '直接网约车 40~70 元搞定，时间成本更低' },
            ],
          } satisfies CardsContent,
        },
        {
          id: 'tips-products',
          title: '早市特产（可带走）',
          kind: 'cards',
          content: {
            items: [
              { icon: '🧀', title: '霉豆腐',   desc: '真空装，可带走' },
              { icon: '🥒', title: '泡菜榨菜', desc: '本地特色' },
              { icon: '🌰', title: '核桃制品', desc: '广元特产' },
              { icon: '🍜', title: '蒸凉面',   desc: '建议现吃' },
            ],
          } satisfies CardsContent,
        },
        {
          id: 'tips-misc',
          title: '旅行贴士',
          kind: 'cards',
          content: {
            items: [
              { icon: '📱', title: '查票工具',   desc: '12306 / 高德地图 / 广运神马小程序' },
              { icon: '🎫', title: '景区门票',   desc: '以景区公众号为准，部分区域需单独购票' },
              { icon: '🚄', title: '广元站进站', desc: '提前 45~60 分钟到站，周末安检慢' },
              { icon: '🍽', title: '火锅订座',   desc: '热门店周末中午易满，提前电话订座' },
              { icon: '⛵', title: '游船购票',   desc: '美团/携程/抖音提前购，提前 20 分钟到码头' },
              { icon: '🧾', title: '博物馆',     desc: '需携带身份证入馆' },
            ],
          } satisfies CardsContent,
        },
      ],
    },
  ],
}

export default guangyuanTrip
