import dayjs from 'dayjs';
import type { Review } from '@/types';

const now = dayjs();

export const reviews: Review[] = [
  // ── Reviews for p1 (李美容) ──
  {
    id: 'r1',
    bookingId: 'b1',
    groomerId: 'p1',
    customerName: '王小明',
    rating: 5,
    comment: '非常專業的美容師！我家貴賓犬洗完澡後毛髮超級蓬鬆，造型也很可愛。',
    createdAt: now.subtract(27, 'day').toISOString(),
  },
  {
    id: 'r2',
    bookingId: 'b11',
    groomerId: 'p1',
    customerName: '錢怡君',
    rating: 4,
    comment: '手藝不錯，但等待時間有點長。整體來說還是滿意的。',
    createdAt: now.subtract(11, 'day').toISOString(),
  },
  {
    id: 'r3',
    bookingId: 'b1',
    groomerId: 'p1',
    customerName: '劉怡伶',
    rating: 5,
    comment: '每次帶毛孩來都很放心，美容師很有耐心，推薦！',
    createdAt: now.subtract(20, 'day').toISOString(),
  },
  {
    id: 'r4',
    bookingId: 'b1',
    groomerId: 'p1',
    customerName: '蔡明宏',
    rating: 5,
    comment: '第三次來了，服務一如既往地好，毛孩每次都很開心。',
    createdAt: now.subtract(15, 'day').toISOString(),
  },

  // ── Reviews for p2 (陳毛毛) ──
  {
    id: 'r5',
    bookingId: 'b8',
    groomerId: 'p2',
    customerName: '蔡明宏',
    rating: 5,
    comment: '對小型犬非常溫柔，我家約克夏很怕生但在她手上很安靜。',
    createdAt: now.subtract(20, 'day').toISOString(),
  },
  {
    id: 'r6',
    bookingId: 'b6',
    groomerId: 'p2',
    customerName: '李家豪',
    rating: 4,
    comment: '洗澡洗得很乾淨，價格也合理。小型犬美容很專業。',
    createdAt: now.subtract(18, 'day').toISOString(),
  },

  // ── Reviews for p3 (張寵愛) ──
  {
    id: 'r7',
    bookingId: 'b2',
    groomerId: 'p3',
    customerName: '林大華',
    rating: 5,
    comment: '貓咪美容找她就對了！我家英短超怕水但她處理得很好。',
    createdAt: now.subtract(26, 'day').toISOString(),
  },
  {
    id: 'r8',
    bookingId: 'b15',
    groomerId: 'p3',
    customerName: '王小明',
    rating: 5,
    comment: '波斯貓的毛很難處理，但美容師很有經驗，洗完超漂亮！',
    createdAt: now.subtract(6, 'day').toISOString(),
  },
  {
    id: 'r9',
    bookingId: 'b2',
    groomerId: 'p3',
    customerName: '馬詩涵',
    rating: 5,
    comment: '真的是貓咪美容專家，每次都處理得很好，貓咪也不會緊張。',
    createdAt: now.subtract(14, 'day').toISOString(),
  },

  // ── Reviews for p4 (王汪汪) ──
  {
    id: 'r10',
    bookingId: 'b3',
    groomerId: 'p4',
    customerName: '陳美玲',
    rating: 4,
    comment: '黃金獵犬洗完很香，吹毛也吹得很蓬鬆。不過大狗需要預留更多時間。',
    createdAt: now.subtract(25, 'day').toISOString(),
  },
  {
    id: 'r11',
    bookingId: 'b14',
    groomerId: 'p4',
    customerName: '馬詩涵',
    rating: 5,
    comment: '大型犬美容專家名不虛傳，我家拉布拉多超配合。',
    createdAt: now.subtract(8, 'day').toISOString(),
  },

  // ── Reviews for p5 (林巧手) ──
  {
    id: 'r12',
    bookingId: 'b4',
    groomerId: 'p5',
    customerName: '黃志偉',
    rating: 5,
    comment: '泰迪熊造型太可愛了！完全符合我的期望，朋友都說好看。',
    createdAt: now.subtract(24, 'day').toISOString(),
  },
  {
    id: 'r13',
    bookingId: 'b9',
    groomerId: 'p5',
    customerName: '許雅文',
    rating: 5,
    comment: '比賽造型非常精緻，毛孩變得超可愛！下次還要來。',
    createdAt: now.subtract(19, 'day').toISOString(),
  },
  {
    id: 'r14',
    bookingId: 'b4',
    groomerId: 'p5',
    customerName: '趙筱涵',
    rating: 4,
    comment: '造型很漂亮，不過價格偏高。但手藝確實值這個價。',
    createdAt: now.subtract(12, 'day').toISOString(),
  },

  // ── Reviews for p7 (趙毛球) ──
  {
    id: 'r15',
    bookingId: 'b10',
    groomerId: 'p7',
    customerName: '鄭國強',
    rating: 5,
    comment: '比賽級的手藝，我家比熊犬造型超完美！',
    createdAt: now.subtract(16, 'day').toISOString(),
  },
  {
    id: 'r16',
    bookingId: 'b10',
    groomerId: 'p7',
    customerName: '馬怡萍',
    rating: 5,
    comment: '標準造型做得很好，很專業的美容師。',
    createdAt: now.subtract(9, 'day').toISOString(),
  },

  // ── Reviews for p8 (吳柔柔) ──
  {
    id: 'r17',
    bookingId: 'b7',
    groomerId: 'p8',
    customerName: '吳淑芬',
    rating: 5,
    comment: '老年犬的護理很溫柔，我家 12 歲的狗狗終於不怕洗澡了。',
    createdAt: now.subtract(21, 'day').toISOString(),
  },
  {
    id: 'r18',
    bookingId: 'b7',
    groomerId: 'p8',
    customerName: '林婉如',
    rating: 5,
    comment: '敏感肌的護理做得很到位，用的洗劑也很溫和。',
    createdAt: now.subtract(10, 'day').toISOString(),
  },

  // ── Reviews for p9 (許毛孩) ──
  {
    id: 'r19',
    bookingId: 'b5',
    groomerId: 'p9',
    customerName: '張雅婷',
    rating: 4,
    comment: 'SPA 護理很不錯，毛孩洗完毛髮很柔順。',
    createdAt: now.subtract(23, 'day').toISOString(),
  },
  {
    id: 'r20',
    bookingId: 'b5',
    groomerId: 'p9',
    customerName: '黃雅琳',
    rating: 4,
    comment: '精油護毛效果很好，香味也很持久。',
    createdAt: now.subtract(6, 'day').toISOString(),
  },

  // ── Reviews for p10 (鄭萌萌) ──
  {
    id: 'r21',
    bookingId: 'b16',
    groomerId: 'p10',
    customerName: '陳冠宇',
    rating: 3,
    comment: '創意造型不錯，但跟想像中有點差距。溝通需要再加強。',
    createdAt: now.subtract(4, 'day').toISOString(),
  },
  {
    id: 'r22',
    bookingId: 'b16',
    groomerId: 'p10',
    customerName: '張家瑜',
    rating: 4,
    comment: '染毛顏色很亮眼，毛孩在路上很吸睛。',
    createdAt: now.subtract(3, 'day').toISOString(),
  },

  // ── Additional reviews ──
  {
    id: 'r23',
    bookingId: 'b1',
    groomerId: 'p1',
    customerName: '周美君',
    rating: 5,
    comment: '帶我家柯基去洗澡，洗得很乾淨，還幫忙清耳朵，很貼心。',
    createdAt: now.subtract(24, 'day').toISOString(),
  },
  {
    id: 'r24',
    bookingId: 'b3',
    groomerId: 'p4',
    customerName: '魏承翰',
    rating: 4,
    comment: '大型犬洗澡不容易，但美容師處理得很好，值得推薦。',
    createdAt: now.subtract(22, 'day').toISOString(),
  },
  {
    id: 'r25',
    bookingId: 'b9',
    groomerId: 'p5',
    customerName: '王小明',
    rating: 5,
    comment: '日系造型太精緻了，每次都讓人驚艷，物超所值。',
    createdAt: now.subtract(17, 'day').toISOString(),
  },
];
