export type SubjectKey = "Phy" | "Maths";

export interface SubtopicNode {
  code: string;
  name: string;
  score: number | null;
  cre: string;
  ma?: string;
}

export interface TopicNode {
  code: string;
  shorthand: string;
  name_zh: string;
  name_en: string;
  chapter: string;
  classScore: number | null;
  personal: number | null;
  hot: boolean;
  subtopics: SubtopicNode[];
}

export interface ChapterNode {
  code: string;
  name_zh: string;
  name_en: string;
  score: number | null;
}

export interface SubjectPack {
  id: SubjectKey;
  label: string;
  mExam: number;
  script: string;
  iceTitle: string;
  iceBody: string;
  chapters: ChapterNode[];
  topics: TopicNode[];
}

export const PACKS: Record<SubjectKey, SubjectPack> = {
  Phy: {
    id: "Phy",
    label: "Physics 物理科",
    mExam: 74,
    script:
      "今日課題：靜電學。處理感應起電題目時，屬於 C 概念理解最常錯嘅一步，記住永遠只有自由電子會移動，正電荷係唔會移動嘅！另外計折射率時要留意 R 審題，分清楚光線係由空氣入玻璃定係玻璃出空氣。",
    iceTitle: "全班第 1 題破冰 · SPEM01.1",
    iceBody: "感應起電時，邊種電荷會移動？先用自己的話說一次，再選答案。",
    chapters: [
      { code: "CH1", name_zh: "熱和氣體", name_en: "Heat and Gases", score: 78 },
      { code: "CH2", name_zh: "力和運動", name_en: "Force and Motion", score: 86 },
      { code: "CH3", name_zh: "波動與光學", name_en: "Wave Motion and Optics", score: 74 },
      { code: "CH4", name_zh: "電和磁", name_en: "Electricity & Magnetism", score: 45 },
      { code: "CH5", name_zh: "放射現象與核能", name_en: "Radioactivity & Nuclear", score: null },
    ],
    topics: [
      {
        code: "JPWM07",
        shorthand: "Refraction",
        name_zh: "光的折射",
        name_en: "Light refraction",
        chapter: "CH3",
        classScore: 84,
        personal: 69,
        hot: true,
        subtopics: [
          { code: "JPWM07.1", name: "折射定律與折射率", score: 88, cre: "[C 概念] 定律本身已穩" },
          { code: "JPWM07.2", name: "視深與實深計算", score: 62, cre: "[R 審題] 誤將空氣當成光密介質" },
        ],
      },
      {
        code: "SPEM01",
        shorthand: "Electrostat",
        name_zh: "靜電學",
        name_en: "Electrostatics",
        chapter: "CH4",
        classScore: 45,
        personal: 57,
        hot: true,
        subtopics: [
          { code: "SPEM01.1", name: "充電與感應起電", score: 38, cre: "[C 概念] 接地時誤以為正電荷移動" },
          { code: "SPEM01.2", name: "電場線與靜電應用", score: 52, cre: "[E 執行] 電場方向箭頭畫反" },
        ],
      },
      {
        code: "JPWM06",
        shorthand: "Reflection",
        name_zh: "光的反射",
        name_en: "Light reflection",
        chapter: "CH3",
        classScore: 90,
        personal: 90,
        hot: false,
        subtopics: [{ code: "JPWM06.1", name: "反射定律", score: 90, cre: "[C 概念] 入射角等於反射角" }],
      },
      {
        code: "JPWM08",
        shorthand: "TotalIntRef",
        name_zh: "全內反射",
        name_en: "Total internal reflection",
        chapter: "CH3",
        classScore: 76,
        personal: 76,
        hot: false,
        subtopics: [{ code: "JPWM08.1", name: "臨界角", score: 76, cre: "[R 審題] 先確認光密入光疏" }],
      },
      {
        code: "SPEM02",
        shorthand: "ElecCircuit",
        name_zh: "電路",
        name_en: "Electric circuits",
        chapter: "CH4",
        classScore: 64,
        personal: 64,
        hot: false,
        subtopics: [{ code: "SPEM02.1", name: "串並聯", score: 64, cre: "[E 執行] 電流分配寫反" }],
      },
    ],
  },
  Maths: {
    id: "Maths",
    label: "Maths 數學科",
    mExam: 78,
    script:
      "今日課題：一元二次方程。先透過 R 審題圈出題目問緊「有實根」定係「兩個相異實根」，決定判別式大於定大於等於零；跟住喺 E 運算執行展開括號時小心正負變號（對應數學能力：MA2 代數運算）。",
    iceTitle: "全班第 1 題破冰 · SM02.2",
    iceBody: "判別式小於零時，方程有沒有實根？先圈出題目問的是「有實根」還是「兩個相異實根」。",
    chapters: [
      { code: "CH1", name_zh: "數與估算", name_en: "Number & Estimation", score: 88 },
      { code: "CH2", name_zh: "代數與函數", name_en: "Algebra & Functions", score: 68 },
      { code: "CH3", name_zh: "度量與幾何", name_en: "Mensuration & Geometry", score: 79 },
      { code: "CH4", name_zh: "坐標與三角學", name_en: "Coordinates & Trigonometry", score: 72 },
      { code: "CH5", name_zh: "統計與概率", name_en: "Statistics & Probability", score: 81 },
    ],
    topics: [
      {
        code: "SM02",
        shorthand: "QuadEqn",
        name_zh: "一元二次方程",
        name_en: "Quadratic Equations in One Unknown",
        chapter: "CH2",
        classScore: 52,
        personal: 52,
        hot: true,
        subtopics: [
          { code: "SM02.1", name: "二次公式與因式分解", score: 75, cre: "[C 概念] 公式選擇已穩", ma: "MA1 概念理解" },
          { code: "SM02.2", name: "判別式與根的性質", score: 42, cre: "[R 審題 + E 運算] 忽略「相異實根」需嚴格大於零及負號變號", ma: "MA3 圖文轉化 / MA2 代數運算" },
        ],
      },
      {
        code: "JM20",
        shorthand: "Pythagoras",
        name_zh: "畢氏定理",
        name_en: "Pythagoras' Theorem",
        chapter: "CH4",
        classScore: 82,
        personal: 82,
        hot: true,
        subtopics: [
          { code: "JM20.1", name: "畢氏定理計算", score: 88, cre: "[E 運算] 斜邊位置已穩", ma: "MA5 幾何處理" },
          { code: "JM20.2", name: "畢氏定理逆定理與應用", score: 76, cre: "[R 審題] 先確認是否直角", ma: "MA4 邏輯推理" },
        ],
      },
      {
        code: "JM12",
        shorthand: "IdentFact",
        name_zh: "恆等式和因式分解",
        name_en: "Identities and Factorization",
        chapter: "CH2",
        classScore: 86,
        personal: 86,
        hot: false,
        subtopics: [{ code: "JM12.1", name: "因式分解", score: 86, cre: "[E 運算] 提公因式", ma: "MA2 代數運算" }],
      },
      {
        code: "SM03",
        shorthand: "FuncGraph",
        name_zh: "函數及其圖像",
        name_en: "Functions and Graphs",
        chapter: "CH2",
        classScore: 61,
        personal: 61,
        hot: false,
        subtopics: [{ code: "SM03.1", name: "圖像讀根", score: 61, cre: "[R 審題] 交點看成頂點", ma: "MA3 圖文轉化" }],
      },
      {
        code: "JM30",
        shorthand: "IntroProb",
        name_zh: "概率",
        name_en: "Probabilities",
        chapter: "CH5",
        classScore: 81,
        personal: 81,
        hot: false,
        subtopics: [{ code: "JM30.1", name: "基本概率", score: 81, cre: "[C 概念] 樣本空間", ma: "MA1 概念理解" }],
      },
    ],
  },
};

export function packOf(subject: SubjectKey) {
  return PACKS[subject];
}

export function topicOf(subject: SubjectKey, code: string) {
  return PACKS[subject].topics.find((topic) => topic.code === code);
}

export function activeTopics(subject: SubjectKey) {
  return PACKS[subject].topics.filter((topic) => topic.hot);
}

export function testedChapterAverage(subject: SubjectKey) {
  const rows = PACKS[subject].chapters.filter((chapter) => chapter.score != null);
  if (!rows.length) return null;
  return Math.round(rows.reduce((sum, chapter) => sum + (chapter.score ?? 0), 0) / rows.length);
}

export function creFromHotkeys(keys: string[], subject: SubjectKey) {
  const tags = keys.map((key) => (key === "1" ? "C 概念" : key === "2" ? "R 審題" : "E 運算/執行"));
  const unique = [...new Set(tags)];
  const ma =
    subject === "Maths"
      ? keys.map((key) => (key === "1" ? "MA1 概念理解" : key === "2" ? "MA3 圖文轉化" : "MA2 代數運算"))
      : [];
  return { tags: unique, ma: [...new Set(ma)] };
}

export function teleScript(subject: SubjectKey, keys: string[]) {
  const pack = PACKS[subject];
  if (keys.includes("2") && keys.includes("3")) {
    return subject === "Maths"
      ? "今日課題：一元二次方程。剛剛批改亮起 R 審題同 E 運算。相異實根要嚴格大於零，展開時小心變號。對應數學能力：MA3 圖文轉化、MA2 代數運算。"
      : "今日課題：靜電學。剛剛標成 R 審題同 E 執行。自由電子先會移動，正電荷唔會郁；電場箭頭唔好畫反。呢度只講 C、R、E。";
  }
  if (keys.includes("1")) {
    return subject === "Maths"
      ? "今日課題：一元二次方程。C 概念先分清公式同因式分解，再用到先先講 MA1。"
      : "今日課題：靜電學。C 概念先記住：接地時移動的是自由電子，正電荷不會走。";
  }
  return pack.script;
}
