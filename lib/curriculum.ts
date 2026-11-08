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
        code: "JM29",
        shorthand: "Quadrilat",
        name_zh: "四邊形",
        name_en: "Quadrilaterals",
        chapter: "CH3",
        classScore: 66,
        personal: 44,
        hot: true,
        subtopics: [
          { code: "JM29.1", name: "梯形 Trapezium", score: 78, cre: "[C 概念] 只有一對平行邊" },
          { code: "JM29.2", name: "菱形 Rhombus", score: 44, cre: "[C 概念] 忘記菱形對角線互相垂直 ∠AOB = 90° + [E 執行] 漏寫定理理由 prop. of rhombus", ma: "MA5 幾何處理" },
          { code: "JM29.3", name: "長方形 Rectangle", score: 82, cre: "[C 概念] 四個角都是直角" },
          { code: "JM29.4", name: "正方形與進階證明 Square & Level 2", score: 60, cre: "[R 審題] 要同時用到菱形與長方形性質", ma: "MA4 邏輯推理" },
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
        hot: false,
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

export function teleScript(subject: SubjectKey, keys: string[], student = "鄭*博", examCode?: string | null) {
  if (examCode?.startsWith("JM29")) {
    if (keys.includes("1") && !keys.includes("2") && !keys.includes("3")) {
      return `今日課題：四邊形（JM29c 菱形長題目）。${student}斷在第 2 步同第 6 步，未寫 [property of rhombus]，屬 C 概念（輔助標示：MA1 概念理解 / MA5 幾何處理）。對角線互相平分，而且 ∠AOB = 90°。`;
    }
    if (keys.includes("2") && keys.includes("3")) {
      return `今日課題：四邊形（JM29c 菱形長題目）。${student}下一刀要同時補 R 審題（AC = 30 cm 是全條對角線，要先除以 2；輔助標示：MA3 圖文轉化）同 E 執行（8 cm 仍要寫 [Pyth. theorem] 同單位 cm；輔助標示：MA2 代數運算）。`;
    }
    if (keys.includes("2")) {
      return `今日課題：四邊形（JM29c 菱形長題目）。${student}漏看 AC = 30 cm 是全條對角線，未除以 2 就代入畢氏定理，屬 R 審題（輔助標示：MA3 圖文轉化）。`;
    }
    if (keys.includes("3")) {
      return `今日課題：四邊形（JM29c 菱形長題目）。${student}計到 8 cm，但漏寫 [property of rhombus] / [Pyth. theorem] 或單位 cm，屬 E 運算執行（輔助標示：MA2 代數運算）。`;
    }
    return `今日課題：四邊形（JM29c 菱形長題目）。${student}可以先揭到對角線互相平分；下一步攻第 6 步 ∠AOB = 90° 的 C 概念（輔助標示：MA1 概念理解 / MA5 幾何處理），並補上 [property of rhombus] 同 [Pyth. theorem]。`;
  }
  if (subject === "Maths") {
    if (keys.includes("1") && !keys.includes("2") && !keys.includes("3")) {
      return `今日課題：一元二次方程（長題目特訓）。${student}連判別式公式都未寫出，第 1 步 1M 失分，屬於 C 概念（輔助標示：MA1 概念理解）。先補 Δ 先，先唔好追後面兩步。`;
    }
    if (keys.includes("2") && keys.includes("3")) {
      return `今日課題：一元二次方程（長題目特訓）。${student}已經掌握第 1 步列判別式穩攞 1M 步驟分；下一步我哋重點攻克第 2 步展開括號時嘅 R 審題 同 E 運算執行 變號盲點（輔助標示：MA3 圖文轉化 / MA2 代數運算），下次校內 UT 長題目就可以由攞 1 分躍升到袋齊 3 分滿分！`;
    }
    if (keys.includes("2")) {
      return `今日課題：一元二次方程（長題目特訓）。${student}漏看「相異實根」，把條件寫成大於等於零，第 1 個條件 1M 屬 R 審題（輔助標示：MA3 圖文轉化）。`;
    }
    if (keys.includes("3")) {
      return `今日課題：一元二次方程（長題目特訓）。${student}式列對了，但展開正負變號錯，有 M 失 A，屬 E 運算執行（輔助標示：MA2 代數運算）。`;
    }
    return `今日課題：一元二次方程（長題目特訓）。${student}已經掌握第 1 步列判別式穩攞 1M 步驟分；下一步我哋重點攻克第 2 步展開括號時嘅 R 審題 同 E 運算執行 變號盲點（輔助標示：MA3 圖文轉化 / MA2 代數運算），下次校內 UT 長題目就可以由攞 1 分躍升到袋齊 3 分滿分！`;
  }
  if (keys.includes("2") && keys.includes("3")) {
    return `今日課題：靜電學（3 分解釋長題目）。${student}操作步驟有分，但成因同結論的 R 審題、E 執行仍會掉 1M。記住只有自由電子會移動，正電荷唔會郁。呢度只講 C、R、E。`;
  }
  if (keys.includes("1")) {
    return `今日課題：靜電學（3 分解釋長題目）。${student}第 1 步把正電荷寫成會移動，1M 成因失分，屬 C 概念理解。正電荷唔會郁。`;
  }
  return `今日課題：靜電學（3 分解釋長題目）。${student}喺操作同結論步驟已經穩攞 2 分；只要修正第 1 步 C 概念理解，記實「只有自由電子會移動、正電荷唔會郁」，下次校內 UT 呢類 3 分解釋題就可以穩袋滿分！`;
}

export const FOCUS_RADAR: Record<SubjectKey, { code: string; name: string; score: number }[]> = {
  Phy: [
    { code: "JPWM07", name: "光的折射", score: 69 },
    { code: "SPEM01", name: "靜電學", score: 57 },
    { code: "JPWM06", name: "光的反射", score: 88 },
    { code: "SPEM02", name: "電路", score: 64 },
  ],
  Maths: [
    { code: "SM02", name: "一元二次方程", score: 52 },
    { code: "JM20", name: "畢氏定理", score: 82 },
    { code: "JM12", name: "恆等式和因式分解", score: 86 },
    { code: "SM03", name: "函數及其圖像", score: 61 },
  ],
};

export interface LqStep {
  mark: "1M" | "1A";
  status: "got" | "break" | "lost";
  title: string;
  self: string;
}

export interface LqPaper {
  code: string;
  total: number;
  stem: string;
  steps: LqStep[];
  scaffold: string[];
  keys: Record<"1" | "2" | "3", { label: string; detail: string; ma?: string }>;
}

const PAPERS: Record<string, LqPaper> = {
  "SM02.2": {
    code: "SM02.2",
    total: 3,
    stem: "[LQ 手寫母題] 方程 x² − (k−2)x + (k+1) = 0 有兩個相異實根，求 k 的取值範圍。(3分)",
    steps: [
      { mark: "1M", status: "got", title: "正確列出判別式條件 Δ > 0", self: "學生自評：🟢 識列式" },
      { mark: "1M", status: "break", title: "代入 (−(k−2))² − 4(1)(k+1) > 0 展開時漏變號", self: "學生自評：🟡 卡關" },
      { mark: "1A", status: "lost", title: "解二次不等式 k < 0 或 k > 8", self: "連帶未作答" },
    ],
    scaffold: [
      "Step 1（穩袋第 1 個 1M 分）：圈出「相異實根」，寫 Δ > 0",
      "Step 2（攻克你剛才卡關的 1M 斷點）：展開 −4(k+1) 時記得負正得負",
      "Step 3（衝刺最後 1A 答案分）：畫拋物線開口向上，求兩側範圍",
    ],
    keys: {
      "1": { label: "1 · C 概念 (失首步 1M)", detail: "連 Δ 公式都未知，0 分無從入手", ma: "MA1 概念理解" },
      "2": { label: "2 · R 審題 (失條件 1M)", detail: "漏看「相異實根」，寫成 Δ ≥ 0", ma: "MA3 圖文轉化" },
      "3": { label: "3 · E 運算/執行 (有 M 失 A 分)", detail: "式列對了，但展開正負變號錯，或不等式方向錯", ma: "MA2 代數運算" },
    },
  },
  "SPEM01.1": {
    code: "SPEM01.1",
    total: 3,
    stem: "[LQ 3分解釋題] 解釋如何利用帶負電塑膠棒，透過感應起電使金屬球帶淨正電荷。(3分)",
    steps: [
      { mark: "1M", status: "break", title: "成因：同性電荷相斥，自由電子被排斥至遠端／地球", self: "學生誤寫「正電荷移動」" },
      { mark: "1M", status: "got", title: "操作：先切斷接地線（移開手指），再移走帶負電棒", self: "學生自評：🟢 次序正確" },
      { mark: "1A", status: "got", title: "結論：金屬球因缺少電子而帶淨正電荷", self: "學生自評：🟢 結論正確" },
    ],
    scaffold: [
      "Step 1（穩袋第 1 個 1M 分）：先寫「自由電子受排斥移動，正電荷不動」",
      "Step 2（攻克你剛才卡關的 1M 斷點）：先斷接地，後移棒",
      "Step 3（衝刺最後 1A 答案分）：總結帶淨正電荷，並檢查單位",
    ],
    keys: {
      "1": { label: "1 · C 概念 (失首步 1M)", detail: "把正電荷寫成會移動，成因 1M 失分" },
      "2": { label: "2 · R 審題 (失條件 1M)", detail: "沒讀出「帶負電棒」要排斥電子，條件 1M 失分" },
      "3": { label: "3 · E 運算/執行 (有 M 失 A 分)", detail: "次序寫反：先移棒再鬆手，操作分扣掉" },
    },
  },
  "JM29.2": {
    code: "JM29.2",
    total: 3,
    stem: "[LQ 手寫母題] 在菱形 ABCD 中，對角線相交於 O。已知 AB = 17 cm 及 AC = 30 cm，求 BO 的長度。(3分)",
    steps: [
      { mark: "1M", status: "got", title: "AO = ½ AC，寫上 property of rhombus", self: "學生自評：🟢 識平分" },
      { mark: "1M", status: "break", title: "∠AOB = 90°，再次寫 property of rhombus", self: "學生自評：🟡 忘記垂直" },
      { mark: "1A", status: "lost", title: "BO = 8 cm，並寫 Pyth. theorem 與單位", self: "連帶未寫理由" },
    ],
    scaffold: [
      "Step 1（穩袋第 1 個 1M 分）：寫 AO = ½ AC，右側理由 [property of rhombus]",
      "Step 2（攻克你剛才卡關的 1M 斷點）：在 O 點標 ∠AOB = 90°",
      "Step 3（衝刺最後 1A 答案分）：用畢氏定理求 BO = 8 cm，並寫 [Pyth. theorem]",
    ],
    keys: {
      "1": { label: "1 · C 概念 (失首步 1M)", detail: "不熟菱形性質 [property of rhombus]：唔知對角線垂直 90° 或互相平分", ma: "MA1 概念理解 / MA5 幾何處理" },
      "2": { label: "2 · R 審題 (失條件 1M)", detail: "漏看全條對角線 AC = 30 cm，未除以 2 就代入畢氏定理", ma: "MA3 圖文轉化" },
      "3": { label: "3 · E 運算/執行 (有 M 失 A 分)", detail: "計出 8 cm，但漏寫 [property of rhombus] / [Pyth. theorem] 或漏寫單位 cm", ma: "MA2 代數運算" },
    },
  },
};

export function weakestExam(subject: SubjectKey) {
  const rows = PACKS[subject].topics.flatMap((topic) =>
    topic.subtopics.map((sub) => ({ ...sub, topic: topic.code })),
  );
  return [...rows].sort((a, b) => (a.score ?? 100) - (b.score ?? 100))[0];
}

export function findSubtopic(subject: SubjectKey, code: string | null) {
  if (!code) return weakestExam(subject);
  for (const topic of PACKS[subject].topics) {
    const sub = topic.subtopics.find((item) => item.code === code);
    if (sub) return { ...sub, topic: topic.code };
  }
  return weakestExam(subject);
}

export function lqPaper(subject: SubjectKey, code: string | null): LqPaper {
  const point = findSubtopic(subject, code);
  if (PAPERS[point.code]) return PAPERS[point.code];
  const base = PAPERS[subject === "Maths" ? "SM02.2" : "SPEM01.1"];
  return {
    ...base,
    code: point.code,
    stem: `[LQ 手寫] ${point.code} ${point.name}（${point.score ?? "—"}%）· 沿用 1M / 1M / 1A，滿分 3 分`,
  };
}

export function lqStepsCard(subject: SubjectKey, code: string | null) {
  const paper = lqPaper(subject, code);
  return {
    kind: "steps" as const,
    title: "🆘 15s 長題目 (LQ) 拆步搶 M 分急救卡",
    body: "長題目唔識計到尾？跟住呢 3 步逐格搶 M 分（步驟分），唔好交白卷！",
    steps: paper.scaffold,
  };
}

export function lqTwinCard(subject: SubjectKey, code: string | null) {
  const point = findSubtopic(subject, code);
  if (point.code.startsWith("JM29")) {
    return {
      kind: "twin" as const,
      title: "🧬 長題目 (LQ) 防棄考雙階段雙胞胎排程",
      body: "e-Book 同小節 Rhombus。手機只補今日斷點，完整手寫留到回堂。",
      phases: [
        {
          title: "第一階段 · +48h 明晚 20:00 · 90 秒斷點微切片",
          body: "不逼學生在手機重做整條 10 分鐘菱形長題。只補 Step 6：∠AOB = 90°，並寫上灰色理由 [property of rhombus]。",
        },
        {
          title: "第二階段 · +7d 下週課前保鮮 · 完整手寫變種 LQ",
          body: "回中心課堂派發 JM29.2 完整 3 分手寫菱形題，驗證能否穩奪 2M + 1A 滿分。",
        },
      ],
    };
  }
  return {
    kind: "twin" as const,
    title: "🧬 長題目 (LQ) 防棄考雙階段雙胞胎排程",
    body: `${point.code} ${point.name} 鎖定同一 Level 3。手機只補今日斷點，完整手寫留到回堂。`,
    phases: [
      {
        title: "第一階段 · +48h 明晚 20:00 · 90 秒斷點微切片",
        body: "不逼學生在手機重做整條 10 分鐘長題目。只針對今日失分的 Step 2（1M 斷點）派關鍵步驟列式／展開填空，確保手機端完成率。",
      },
      {
        title: "第二階段 · +7d 下週課前保鮮 · 完整手寫變種 LQ",
        body: `回中心課堂或考前派發同考點 ${point.code} 完整 3 分手寫長題目，驗證能否穩奪 2M + 1A 滿分。`,
      },
    ],
  };
}

export const EBOOK_URL = "https://uniplusmathsteam-bot.github.io/jm26b-inequalities-ebook/reader.html?book=jm29c";

export type EbookTab = "trapezium" | "rhombus" | "rectangle" | "square" | "level2";

export interface EbookLine {
  expr: string;
  reason?: string;
  note: string;
  mark?: string;
}

export const JM29_LINES: EbookLine[] = [
  { expr: "AB = 17 cm", note: "已知 Given" },
  { expr: "AO = ½ AC", reason: "property of rhombus", note: "對角線互相平分 · 搶第 1 個 1M", mark: "1M" },
  { expr: "   = ½ × 30 cm", note: "把整條對角線除以 2" },
  { expr: "   = 15 cm", note: "AO 的長度" },
  { expr: "In △AOB,", note: "鎖定直角三角形" },
  { expr: "∠AOB = 90°", reason: "property of rhombus", note: "全班最常卡關斷點 [C 概念]：忘記菱形對角線垂直", mark: "1M" },
  { expr: "AO² + BO² = AB²", reason: "Pyth. theorem", note: "畢氏定理列式 · 搶第 2 個 1M", mark: "1M" },
  { expr: "BO = √(17² − 15²) cm", note: "[R 審題 / E 執行]：誤將 17 當直角邊相加，或漏寫理由／單位" },
  { expr: "   = 8 cm", note: "最終準確答案 · 穩袋最後 1A", mark: "1A" },
];

export const EBOOK_TABS: { id: EbookTab; label: string; code: string }[] = [
  { id: "trapezium", label: "Trapezium", code: "JM29.1" },
  { id: "rhombus", label: "Rhombus 🔥", code: "JM29.2" },
  { id: "rectangle", label: "Rectangle", code: "JM29.3" },
  { id: "square", label: "Square", code: "JM29.4" },
  { id: "level2", label: "Level 2", code: "JM29.4" },
];

export function ebookHits(keys: string[]) {
  const hits: number[] = [];
  if (keys.includes("1")) hits.push(2, 6);
  if (keys.includes("2")) hits.push(3);
  if (keys.includes("3")) hits.push(8);
  return hits;
}

export function ebookRescueCard() {
  return {
    kind: "ebook" as const,
    title: "🆘 15s 長題目 (LQ) 拆步搶 M 分急救卡",
    body: "長題目唔識計到尾？跟住呢 3 步逐格搶 M 分（步驟分），唔好交白卷！e-Book 唔會一次畀晒 9 行答案。",
  };
}

export function isEbookPoint(code: string | null | undefined) {
  return Boolean(code?.startsWith("JM29"));
}
