export type Subject = "Phy" | "Maths" | "Chem" | "Bio" | "IS";

export interface Subtopic {
  code: string;
  name_zh: string;
  fallback?: boolean;
}

export interface Topic {
  id: string;
  topic_code: string;
  shorthand: string;
  name_zh: string;
  name_en: string;
  topic_sort_order: number;
  hkeaa_strand: string;
  chapter_code: string;
  chapter_name: string;
  subject: Subject;
  radar_visibility: boolean;
  score: number | null;
  urgent: number;
  subtopics: Subtopic[];
  skill_dimension?: string;
  cre?: string;
}

export const MA_MAP = [
  { id: "MA1", cre: "C", name: "概念理解", note: "MA1 → C" },
  { id: "MA2", cre: "E", name: "代數運算", note: "MA2 → E" },
  { id: "MA3", cre: "R", name: "表述推理", note: "MA3 → R" },
  { id: "MA4", cre: "R", name: "圖像閱讀", note: "MA4 → R" },
  { id: "MA5", cre: "E", name: "步驟執行", note: "MA5 → E" },
  { id: "MA6", cre: "C/R/E", name: "跨維度魔王題", note: "MA6 → 跨 C/R/E" },
];

export const TOPICS: Topic[] = [
  {
    id: "phy-refr",
    topic_code: "SPOP03",
    shorthand: "Refract",
    name_zh: "光的折射",
    name_en: "Refraction",
    topic_sort_order: 30,
    hkeaa_strand: "Light",
    chapter_code: "PHY-OPT",
    chapter_name: "光學",
    subject: "Phy",
    radar_visibility: true,
    score: 84,
    urgent: 1,
    subtopics: [
      { code: "SPOP03.1", name_zh: "缺省小節（自動補齊）", fallback: true },
      { code: "SPOP03.2", name_zh: "折射角與法線" },
    ],
  },
  {
    id: "phy-refl",
    topic_code: "SPOP02",
    shorthand: "Reflect",
    name_zh: "光的反射",
    name_en: "Reflection",
    topic_sort_order: 20,
    hkeaa_strand: "Light",
    chapter_code: "PHY-OPT",
    chapter_name: "光學",
    subject: "Phy",
    radar_visibility: true,
    score: 90,
    urgent: 8,
    subtopics: [{ code: "SPOP02.1", name_zh: "反射定律", fallback: true }],
  },
  {
    id: "phy-lens",
    topic_code: "SPOP04",
    shorthand: "Lens",
    name_zh: "透鏡成像",
    name_en: "Lenses",
    topic_sort_order: 40,
    hkeaa_strand: "Light",
    chapter_code: "PHY-OPT",
    chapter_name: "光學",
    subject: "Phy",
    radar_visibility: true,
    score: null,
    urgent: 6,
    subtopics: [{ code: "SPOP04.1", name_zh: "缺省小節（自動補齊）", fallback: true }],
  },
  {
    id: "phy-elec",
    topic_code: "SPEM01",
    shorthand: "Electrostat",
    name_zh: "靜電學",
    name_en: "Electrostatics",
    topic_sort_order: 50,
    hkeaa_strand: "Electricity and Magnetism",
    chapter_code: "PHY-EM",
    chapter_name: "電磁學",
    subject: "Phy",
    radar_visibility: true,
    score: 45,
    urgent: 3,
    subtopics: [{ code: "SPEM01.1", name_zh: "電荷與電場", fallback: true }],
  },
  {
    id: "phy-mech",
    topic_code: "SPFM02",
    shorthand: "Mech",
    name_zh: "力學",
    name_en: "Mechanics",
    topic_sort_order: 10,
    hkeaa_strand: "Force and Motion",
    chapter_code: "PHY-FM",
    chapter_name: "力與運動",
    subject: "Phy",
    radar_visibility: true,
    score: 72,
    urgent: 5,
    subtopics: [{ code: "SPFM02.1", name_zh: "牛頓定律", fallback: true }],
  },
  {
    id: "phy-heat",
    topic_code: "SPHT01",
    shorthand: "Heat",
    name_zh: "熱學",
    name_en: "Heat",
    topic_sort_order: 60,
    hkeaa_strand: "Heat",
    chapter_code: "PHY-HT",
    chapter_name: "熱學",
    subject: "Phy",
    radar_visibility: true,
    score: 78,
    urgent: 9,
    subtopics: [{ code: "SPHT01.1", name_zh: "比熱", fallback: true }],
  },
  {
    id: "phy-wave",
    topic_code: "SPWV04",
    shorthand: "Wave",
    name_zh: "波動",
    name_en: "Waves",
    topic_sort_order: 70,
    hkeaa_strand: "Wave Motion",
    chapter_code: "PHY-WV",
    chapter_name: "波動",
    subject: "Phy",
    radar_visibility: true,
    score: null,
    urgent: 7,
    subtopics: [{ code: "SPWV04.1", name_zh: "缺省小節（自動補齊）", fallback: true }],
  },
  {
    id: "phy-atom",
    topic_code: "SPAT05",
    shorthand: "Atomic",
    name_zh: "原子物理",
    name_en: "Atomic Physics",
    topic_sort_order: 80,
    hkeaa_strand: "Radioactivity",
    chapter_code: "PHY-AT",
    chapter_name: "原子物理",
    subject: "Phy",
    radar_visibility: false,
    score: null,
    urgent: 10,
    subtopics: [{ code: "SPAT05.1", name_zh: "缺省小節（自動補齊）", fallback: true }],
  },
  {
    id: "math-quad",
    topic_code: "SM02",
    shorthand: "QuadEq",
    name_zh: "二次方程",
    name_en: "Quadratic Equations",
    topic_sort_order: 20,
    hkeaa_strand: "Algebra",
    chapter_code: "MATH-ALG",
    chapter_name: "代數",
    subject: "Maths",
    radar_visibility: true,
    score: 62,
    urgent: 2,
    skill_dimension: "MA2",
    cre: "E",
    subtopics: [
      { code: "SM02.1", name_zh: "缺省小節（自動補齊）", fallback: true },
      { code: "SM02.2", name_zh: "配方法與判別式" },
    ],
  },
  {
    id: "math-factor",
    topic_code: "SM01",
    shorthand: "Factor",
    name_zh: "因式分解",
    name_en: "Factorisation",
    topic_sort_order: 10,
    hkeaa_strand: "Algebra",
    chapter_code: "MATH-ALG",
    chapter_name: "代數",
    subject: "Maths",
    radar_visibility: true,
    score: 91,
    urgent: 11,
    skill_dimension: "MA1",
    cre: "C",
    subtopics: [{ code: "SM01.1", name_zh: "提取公因式", fallback: true }],
  },
  {
    id: "math-stat",
    topic_code: "SM06",
    shorthand: "Stat",
    name_zh: "統計",
    name_en: "Statistics",
    topic_sort_order: 60,
    hkeaa_strand: "Data Handling",
    chapter_code: "MATH-DH",
    chapter_name: "數據處理",
    subject: "Maths",
    radar_visibility: true,
    score: 54,
    urgent: 4,
    skill_dimension: "MA4",
    cre: "R",
    subtopics: [{ code: "SM06.1", name_zh: "平均數與分佈", fallback: true }],
  },
  {
    id: "math-pct",
    topic_code: "SM03",
    shorthand: "Percent",
    name_zh: "百分法",
    name_en: "Percentages",
    topic_sort_order: 30,
    hkeaa_strand: "Number",
    chapter_code: "MATH-NUM",
    chapter_name: "數與代數",
    subject: "Maths",
    radar_visibility: true,
    score: 88,
    urgent: 12,
    skill_dimension: "MA5",
    cre: "E",
    subtopics: [{ code: "SM03.1", name_zh: "百分變化", fallback: true }],
  },
  {
    id: "chem-acid",
    topic_code: "SC03",
    shorthand: "Acid",
    name_zh: "酸與鹼",
    name_en: "Acids and Bases",
    topic_sort_order: 30,
    hkeaa_strand: "Acids and Bases",
    chapter_code: "CHEM-AB",
    chapter_name: "酸與鹽基",
    subject: "Chem",
    radar_visibility: true,
    score: 67,
    urgent: 6,
    subtopics: [{ code: "SC03.1", name_zh: "pH 標度", fallback: true }],
  },
];

export const IS_AXES = [
  { code: "IS-CH1", name: "科學探究", score: 70, link: "共通能力" },
  { code: "IS-CH2", name: "生物共通", score: 82, link: "高中 Bio 潛能" },
  { code: "IS-CH3", name: "化學共通", score: 76, link: "高中 Chem 潛能" },
  { code: "IS-CH4", name: "物理共通", score: 88, link: "高中 Phy 潛能" },
];

export interface Seat {
  id: string;
  name: string;
  en: string;
  mastery: number;
  wrongs: number;
}

export const SEATS: Seat[] = [
  { id: "anson", name: "陳*軒", en: "Anson", mastery: 64, wrongs: 2 },
  { id: "s2", name: "李*晴", en: "Chloe", mastery: 91, wrongs: 0 },
  { id: "s3", name: "黃*諾", en: "Noah", mastery: 76, wrongs: 1 },
  { id: "s4", name: "張*澄", en: "Ian", mastery: 42, wrongs: 4 },
  { id: "s5", name: "周*恩", en: "Yan", mastery: 88, wrongs: 0 },
  { id: "s6", name: "林*朗", en: "Long", mastery: 58, wrongs: 3 },
  { id: "s7", name: "吳*希", en: "Hayley", mastery: 81, wrongs: 2 },
  { id: "s8", name: "何*言", en: "Yin", mastery: 36, wrongs: 5 },
  { id: "s9", name: "郭*菲", en: "Faye", mastery: 93, wrongs: 0 },
  { id: "s10", name: "鄭*博", en: "Marcus", mastery: 69, wrongs: 2 },
  { id: "s11", name: "謝*桐", en: "Tung", mastery: 47, wrongs: 4 },
  { id: "s12", name: "馮*悠", en: "Yau", mastery: 85, wrongs: 1 },
  { id: "s13", name: "曹*朗", en: "Long", mastery: 73, wrongs: 2 },
  { id: "s14", name: "鄧*澄", en: "Ching", mastery: 55, wrongs: 3 },
  { id: "s15", name: "許*安", en: "On", mastery: 90, wrongs: 0 },
  { id: "s16", name: "蔡*琪", en: "Kei", mastery: 63, wrongs: 2 },
  { id: "s17", name: "潘*希", en: "Hei", mastery: 49, wrongs: 4 },
  { id: "s18", name: "葉*森", en: "Sam", mastery: 77, wrongs: 1 },
  { id: "s19", name: "余*晴", en: "Ching", mastery: 86, wrongs: 0 },
  { id: "s20", name: "羅*博", en: "Bob", mastery: 51, wrongs: 3 },
];

export const HERO = {
  student: "陳*軒",
  en: "Anson",
  school: "聖保羅書院",
  form: "中三",
  cohort: "SPC-S3-2026-VERIFIED",
  parentPin: "8821",
  ldc: "林知行",
  koc: "Jason 陳朗",
  kocLeaderTrack: "Jason",
  csm: "蘇芷澄",
  backupKoc: "Chloe 李晴",
  predicted: 80,
  actualUt: 62,
};

export const DEFAULT_CART = ["phy-refr", "math-quad", "phy-elec", "math-stat", "phy-mech"];

export const CAPSULES = [
  { q: "為什麼會遠離法線？", a: "水比空氣光密。光線走向光疏介質時，會偏離法線，所以折射角大於入射角。" },
  { q: "全反射臨界角怎樣判斷？", a: "只有光密進入光疏，而且入射角大於臨界角，才會全反射。這題未達臨界，所以仍有折射。" },
  { q: "如果改成玻璃會怎樣？", a: "玻璃仍比空氣光密，方向判斷不變，但偏折幅度會比水更大。先判斷密疏，再談角度。" },
];

export const QUOTES = [
  "先判斷邊個介質光密，唔好背口訣。",
  "折射角大於入射角，因為光線離法線。",
  "單位同方向要一齊寫，先算完整一步。",
];

export const LQ_STEPS = [
  { label: "設未知數並寫單位", marks: 2 },
  { label: "列出二次方程", marks: 3 },
  { label: "代數運算（MA2）", marks: 3 },
  { label: "寫根並檢查是否合理", marks: 2 },
];

export const DIAG = [
  { q: "光由水進入空氣會遠離法線。若題目改成「由空氣進入水」，光線會怎樣？", options: ["靠近法線", "繼續遠離法線", "一定全反射"], answer: 0 },
  { q: "酸液稀釋後 pH 上升，最接近哪一種跨科判斷？", options: ["濃度下降，酸性變弱", "體積變大所以酸性變強", "pH 與濃度無關"], answer: 0 },
  { q: "判別式小於零時，二次方程有沒有實根？", options: ["沒有實根", "有一個重根", "有兩個實根"], answer: 0 },
];

export function topicById(id: string) {
  return TOPICS.find((t) => t.id === id)!;
}

export const QUESTIONS: Record<string, { stem: string; stemEn: string; wrong: string; right: string; eye: string }> = {
  "phy-refr": {
    stem: "光線由水斜向射入空氣時，折射角與入射角的關係是？",
    stemEn: "A ray travels from water into air. How does the angle of refraction compare with the angle of incidence?",
    wrong: "折射角小於入射角",
    right: "折射角大於入射角",
    eye: "水",
  },
  "math-quad": {
    stem: "判別式小於零時，二次方程有實根嗎？",
    stemEn: "If the discriminant is negative, does the quadratic equation have real roots?",
    wrong: "有兩個實根",
    right: "沒有實根",
    eye: "判別式",
  },
  "phy-elec": {
    stem: "兩個同號電荷靠近時，會怎樣？",
    stemEn: "What happens when two like charges are brought together?",
    wrong: "互相吸引",
    right: "互相排斥",
    eye: "同號",
  },
  "math-stat": {
    stem: "一組數據加入一個很大的極端值，平均數會怎樣？",
    stemEn: "What happens to the mean when a very large outlier is added?",
    wrong: "一定不變",
    right: "被拉高",
    eye: "極端值",
  },
  "phy-mech": {
    stem: "合力為零時，物體的速度會怎樣？",
    stemEn: "If the net force is zero, what happens to the velocity?",
    wrong: "一定停下",
    right: "維持原有速度",
    eye: "合力",
  },
};

export const ELEMENTS = [
  { id: "water" as const, label: "💧 水", line: "先講自己當年 DSE 踩過同一個坑，等他放下戒心。" },
  { id: "wood" as const, label: "🌲 木", line: "只播 15 秒分步卡，拆「水密、空氣疏、遠離法線」。" },
  { id: "metal" as const, label: "⚔️ 金", line: "用一句話核對概念：先判光密還是光疏，再談角度。" },
  { id: "fire" as const, label: "🔥 火", line: "把節奏收回 20 秒，不要展開新課題。" },
  { id: "earth" as const, label: "⛰️ 土", line: "讓他自己說一次結論，再說完才坐下。" },
];

export const TLA = [
  { id: "t" as const, label: "T · Teach", time: "0:00–2:00", text: "用 name_zh 講清一個判斷。" },
  { id: "l" as const, label: "L · Learn", time: "2:00–4:30", text: "學生用自己的話說一次。" },
  { id: "a" as const, label: "A · Apply", time: "4:30–6:00", text: "換一個情境，不另開課題。" },
];

export const PAYOUT_OK = [
  { name: "Jason 陳朗", pct: 0.3 },
  { name: "林知行", pct: 0.2 },
  { name: "跨科轉化池", pct: 0.2 },
];

export const ICE = [
  { q: "折射角會大於入射角嗎？", heat: { refr: 62, elec: 45 } },
  { q: "同號電荷會互相排斥嗎？", heat: { refr: 62, elec: 58 } },
  { q: "光密走向光疏，會遠離法線嗎？", heat: { refr: 71, elec: 58 } },
];

export interface SeatProfile {
  blurb: string;
  ticket: string;
  topics: { name: string; score: number | null }[];
}

const CUSTOM_PROFILES: Record<string, SeatProfile> = {
  anson: {
    blurb: "陳*軒是這班主線。折射判斷已離開背口訣，仍要先講光密還是光疏。",
    ticket: "攻堅支援 [重點] · 折射紅點後跟進",
    topics: [
      { name: "光的折射", score: 84 },
      { name: "光的反射", score: 90 },
      { name: "靜電學", score: 45 },
      { name: "透鏡成像", score: null },
    ],
  },
  s2: {
    blurb: "李*晴已經穩在深綠。今日不用加卷，只留 1 題保鮮。",
    ticket: "正向突破 [轉化] · 可邀約跨科沙盤",
    topics: [
      { name: "光的折射", score: 91 },
      { name: "靜電學", score: 88 },
      { name: "二次方程", score: 86 },
      { name: "波動", score: null },
    ],
  },
  s8: {
    blurb: "何*言連續兩晚只做零碎練習。先處理作息，再加題。",
    ticket: "暖心作息 [重點] · 留在原 KOC",
    topics: [
      { name: "光的折射", score: 36 },
      { name: "力學", score: 41 },
      { name: "二次方程", score: 44 },
      { name: "統計", score: null },
    ],
  },
};

export function seatProfile(id: string): SeatProfile {
  if (CUSTOM_PROFILES[id]) return CUSTOM_PROFILES[id];
  const seat = SEATS.find((item) => item.id === id);
  const base = seat?.mastery ?? 60;
  return {
    blurb: `${seat?.name ?? "同學"}的個人雷達。點座位不會改動陳*軒的主線。`,
    ticket: base >= 85 ? "延伸組 · 無需新工單" : base < 50 ? "微支線 · 先穩住一個課題" : "主線 · 照常節奏",
    topics: [
      { name: "光的折射", score: base },
      { name: "靜電學", score: Math.max(35, base - 12) },
      { name: "二次方程", score: Math.min(96, base + 6) },
      { name: "波動", score: base % 2 === 0 ? null : 60 },
    ],
  };
}
