"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { HelpCircle, RefreshCw, X } from "lucide-react";
import ichingData from "../data/i-ching.json";

interface HexagramDetail {
  name: string;
  chinese_name: string;
  gwa_name: string;
  judgment: {
    text: string;
    comments: string;
  };
  tanjun: string;
  sangjun: string;
  lines: Record<string, {
    text: string;
    comments: string;
  }>;
}

interface HexagramData {
  hexagram_number: number;
  binary_code: string;
  ko: HexagramDetail;
  en: HexagramDetail;
}

const typedIchingData = ichingData as Record<string, HexagramData>;

const findHexagramData = (binaryCode: string): HexagramData | null => {
  const hex = Object.values(typedIchingData).find((h) => h.binary_code === binaryCode);
  return hex || null;
};

const originalTabTranslations = {
  KO: {
    judgment: "괘사 (Judgment)",
    tanjun: "단전 (Tanjun)",
    sangjun: "상전 (Sangjun)",
    lines: "효사 (Lines)",
    primaryTitle: "본괘 (현재의 상황)",
    changedTitle: "지괘 (미래의 결과)",
    pastTitle: "과거의 상태/원인",
    threeLinesChanging: "3개의 효가 동하여 본괘에서 지괘로 변화합니다.",
  },
  EN: {
    judgment: "Judgment",
    tanjun: "Tanjun (Commentary on the Decision)",
    sangjun: "Sangjun (Commentary on the Images)",
    lines: "Lines",
    primaryTitle: "Primary Hexagram (Current Situation)",
    changedTitle: "Changed Hexagram (Future Outcome)",
    pastTitle: "Past Status / Cause",
    threeLinesChanging: "3 lines are changing, moving from the primary to the changed hexagram.",
  }
};

const Accordion = ({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/10 rounded-lg overflow-hidden bg-white/5 my-2">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-4 py-3 text-sm font-bold text-slate-100 hover:bg-white/10 transition-colors"
      >
        <span>{title}</span>
        <span className="text-xs">{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && (
        <div className="px-4 py-3 text-sm text-slate-300 border-t border-white/5 bg-slate-800/40">
          {children}
        </div>
      )}
    </div>
  );
};

const renderSection = (title: string, content: string, asAccordion: boolean, defaultOpen = false) => {
  if (asAccordion) {
    return (
      <Accordion title={title} defaultOpen={defaultOpen}>
        <p className="whitespace-pre-line leading-relaxed">{content}</p>
      </Accordion>
    );
  }
  return (
    <div className="space-y-1 my-3">
      <h4 className="text-xs text-slate-400 font-semibold">{title}</h4>
      <p className="text-sm text-slate-200 whitespace-pre-line leading-relaxed">{content}</p>
    </div>
  );
};

const renderHexagramHeader = (hex: HexagramDetail, noBoldAll = false) => {
  const boldClass = noBoldAll ? "" : "font-bold text-white";
  const nameChinese = `${hex.name} (${hex.chinese_name})`;
  const gwaName = hex.gwa_name;
  
  return (
    <div className="space-y-2 border-b border-white/10 pb-4 mb-4">
      <h3 className={`text-lg md:text-xl ${boldClass}`}>
        {nameChinese}
      </h3>
      <p className={`text-sm text-slate-300 ${boldClass}`}>
        {gwaName}
      </p>
      <div className={`mt-3 p-3 bg-white/5 rounded-lg border border-white/5 ${boldClass}`}>
        <p className="text-sm leading-relaxed">{hex.judgment.text}</p>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{hex.judgment.comments}</p>
      </div>
    </div>
  );
};

const renderLinesSection = (hex: HexagramDetail, highlightLineKeys: string[], boldLineKeys: string[], asAccordion: boolean, defaultOpen = false, noBoldAll = false, lang: "KO" | "EN" = "KO") => {
  const lineKeys = Object.keys(hex.lines).sort((a, b) => Number(a) - Number(b));
  
  const content = (
    <div className="space-y-4">
      {lineKeys.map((key) => {
        const isHighlighted = !noBoldAll && highlightLineKeys.includes(key);
        const isBold = !noBoldAll && boldLineKeys.includes(key);
        
        const line = hex.lines[key];
        
        let lineClassName = "text-sm leading-relaxed";
        if (isHighlighted) {
          lineClassName += " text-emerald-400";
        }
        if (isBold) {
          lineClassName += " font-bold";
        }
        
        return (
          <div key={key} className={lineClassName}>
            <div className="flex gap-2">
              <span className="shrink-0 font-bold">{key}.</span>
              <div>
                <p>{line.text}</p>
                <p className={`text-xs mt-1 ${isHighlighted ? "text-emerald-300/80" : "text-slate-400"}`}>
                  {line.comments}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  if (asAccordion) {
    return (
      <Accordion title={lang === "KO" ? "효사 (Lines)" : "Lines"} defaultOpen={defaultOpen}>
        {content}
      </Accordion>
    );
  }

  return (
    <div className="space-y-2 my-4">
      <h4 className="text-xs text-slate-400 font-semibold">{lang === "KO" ? "효사 (Lines)" : "Lines"}</h4>
      {content}
    </div>
  );
};

const renderTraditionalTab = (lines: number[], currentLang: "KO" | "EN", initMessage: string, primaryHex: HexagramData | null, changedHex: HexagramData | null) => {
  if (lines.length === 0 || !primaryHex) {
    return (
      <div className="text-center text-slate-400 py-8 italic whitespace-pre-line">
        {initMessage}
      </div>
    );
  }

  // Find hexagrams
  const pHex = currentLang === "KO" ? primaryHex.ko : primaryHex.en;
  const cHex = changedHex ? (currentLang === "KO" ? changedHex.ko : changedHex.en) : null;

  // Determine moving lines and static lines (0-based indices)
  const movingLineIndices: number[] = [];
  const staticLineIndices: number[] = [];
  lines.forEach((sum, idx) => {
    if (sum === 6 || sum === 9) {
      movingLineIndices.push(idx);
    } else {
      staticLineIndices.push(idx);
    }
  });

  const movingCount = movingLineIndices.length;
  const trans = originalTabTranslations[currentLang];

  switch (movingCount) {
    case 0: {
      return (
        <div className="space-y-4">
          {renderHexagramHeader(pHex)}
          {renderSection(trans.tanjun, pHex.tanjun, false)}
          {renderSection(trans.sangjun, pHex.sangjun, false)}
          {renderLinesSection(pHex, [], [], false, false, false, currentLang)}
        </div>
      );
    }
    case 1: {
      const movingKey = (movingLineIndices[0] + 1).toString();
      return (
        <div className="space-y-4">
          {renderHexagramHeader(pHex)}
          {renderSection(trans.tanjun, pHex.tanjun, false)}
          {renderSection(trans.sangjun, pHex.sangjun, false)}
          {renderLinesSection(pHex, [movingKey], [movingKey], false, false, false, currentLang)}
        </div>
      );
    }
    case 2: {
      const lowerKey = (movingLineIndices[0] + 1).toString();
      const upperKey = (movingLineIndices[1] + 1).toString();
      return (
        <div className="space-y-4">
          {renderHexagramHeader(pHex)}
          {renderSection(trans.tanjun, pHex.tanjun, false)}
          {renderSection(trans.sangjun, pHex.sangjun, false)}
          {renderLinesSection(pHex, [lowerKey, upperKey], [lowerKey], false, false, false, currentLang)}
        </div>
      );
    }
    case 3: {
      if (!cHex) return null;
      const key1 = (movingLineIndices[0] + 1).toString();
      const key2 = (movingLineIndices[1] + 1).toString(); // Middle
      const key3 = (movingLineIndices[2] + 1).toString();

      return (
        <div className="space-y-6">
          <div className="text-sm font-bold text-emerald-400 text-center py-2 bg-emerald-400/10 rounded-lg border border-emerald-400/20">
            {trans.threeLinesChanging}
          </div>

          {/* 본괘 */}
          <div className="space-y-4 pt-2">
            <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider border-l-4 border-emerald-400 pl-2">
              {trans.primaryTitle}
            </h4>
            {renderHexagramHeader(pHex)}
            {renderSection(trans.tanjun, pHex.tanjun, true)}
            {renderSection(trans.sangjun, pHex.sangjun, true)}
            {renderLinesSection(pHex, [key1, key2, key3], [key2], false, false, false, currentLang)}
          </div>

          {/* 구분선 */}
          <hr className="border-white/10 my-6" />

          {/* 지괘 */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider border-l-4 border-cyan-400 pl-2">
              {trans.changedTitle}
            </h4>
            {renderHexagramHeader(cHex)}
            {renderSection(trans.tanjun, cHex.tanjun, true, false)}
            {renderSection(trans.sangjun, cHex.sangjun, true, false)}
            {renderLinesSection(cHex, [], [], true, false, false, currentLang)}
          </div>
        </div>
      );
    }
    case 4: {
      if (!cHex) return null;
      const staticKey1 = (staticLineIndices[0] + 1).toString();
      const staticKey2 = (staticLineIndices[1] + 1).toString();

      return (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider border-l-4 border-cyan-400 pl-2">
              {trans.changedTitle}
            </h4>
            {renderHexagramHeader(cHex)}
            {renderSection(trans.tanjun, cHex.tanjun, false)}
            {renderSection(trans.sangjun, cHex.sangjun, false)}
            {renderLinesSection(cHex, [staticKey1, staticKey2], [staticKey1, staticKey2], false, false, false, currentLang)}
          </div>

          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-4 text-xs text-slate-400 font-medium tracking-wider">
              {trans.pastTitle}
            </span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <div className="space-y-4 opacity-80">
            {renderHexagramHeader(pHex, true)}
            {renderSection(trans.tanjun, pHex.tanjun, false, false)}
            {renderSection(trans.sangjun, pHex.sangjun, false, false)}
            {renderLinesSection(pHex, [], [], false, false, true, currentLang)}
          </div>
        </div>
      );
    }
    case 5: {
      if (!cHex) return null;
      const staticKey = (staticLineIndices[0] + 1).toString();

      return (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider border-l-4 border-cyan-400 pl-2">
              {trans.changedTitle}
            </h4>
            {renderHexagramHeader(cHex)}
            {renderSection(trans.tanjun, cHex.tanjun, false)}
            {renderSection(trans.sangjun, cHex.sangjun, false)}
            {renderLinesSection(cHex, [staticKey], [staticKey], false, false, false, currentLang)}
          </div>

          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-4 text-xs text-slate-400 font-medium tracking-wider">
              {trans.pastTitle}
            </span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <div className="space-y-4 opacity-80">
            {renderHexagramHeader(pHex, true)}
            {renderSection(trans.tanjun, pHex.tanjun, false, false)}
            {renderSection(trans.sangjun, pHex.sangjun, false, false)}
            {renderLinesSection(pHex, [], [], false, false, true, currentLang)}
          </div>
        </div>
      );
    }
    case 6: {
      if (!cHex) return null;
      const changedCode = lines.map(sum => (sum === 6 || sum === 9) ? "1" : "0").join("");
      const isSpecialHex = changedCode === "111111" || changedCode === "000000";
      const highlightKeys = isSpecialHex ? ["7"] : [];

      return (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider border-l-4 border-cyan-400 pl-2">
              {trans.changedTitle}
            </h4>
            {renderHexagramHeader(cHex)}
            {renderSection(trans.tanjun, cHex.tanjun, false)}
            {renderSection(trans.sangjun, cHex.sangjun, false)}
            {renderLinesSection(cHex, highlightKeys, highlightKeys, false, false, false, currentLang)}
          </div>

          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-4 text-xs text-slate-400 font-medium tracking-wider">
              {trans.pastTitle}
            </span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <div className="space-y-4 opacity-80">
            {renderHexagramHeader(pHex, true)}
            {renderSection(trans.tanjun, pHex.tanjun, false, false)}
            {renderSection(trans.sangjun, pHex.sangjun, false, false)}
            {renderLinesSection(pHex, [], [], false, false, true, currentLang)}
          </div>
        </div>
      );
    }
    default:
      return null;
  }
};

interface Translation {
  headerTitle: string;
  langButton: string;
  inputLabel: string;
  inputPlaceholder: string;
  generateBtnNormal: string;
  generateBtnLoading: string;
  rouletteLabels: string[];
  primaryHexTitle: string;
  changedHexTitle: string;
  resultLabel: string;
  detailBtn: string;
  introCTA: string;
  introTitle: string;
  introP1: string;
  introP2: string;
  introP3: string;
  resultInit: string;
  yangText: string;
  yinText: string;
  yangSub: string;
  yinSub: string;
  analyzing: string;
  tabAi: string;
  tabOriginal: string;
  resultInitAi: string;
  resultInitOriginal: string;
  resultGeneratedAi: string;
  resultGeneratedOriginal: string;
}

const translations: Record<"KO" | "EN", Translation> = {
  KO: {
    headerTitle: "시야(SYA)",
    langButton: "EN",
    inputLabel: "당신 앞의 문제",
    inputPlaceholder: "답을 찾고 싶은 당신의 문제를 적어주세요",
    generateBtnNormal: "AI 점괘 생성",
    generateBtnLoading: "AI 점괘 생성중...",
    rouletteLabels: ["초효", "이효", "삼효", "사효", "오효", "상효"],
    primaryHexTitle: "본괘(Primary Hexagram)",
    changedHexTitle: "지괘(Changed Hexagram)",
    resultLabel: "점괘 해석",
    detailBtn: "AI로 풀어보는 상세 해석",
    introCTA: "화면을 터치하여 진입하세요",
    introTitle: "시야(視野), See Your Answer(SYA)",
    introP1: "인생의 문제 앞에 꽉 막힌 당신의 시야,",
    introP2: "답을 보여 드립니다.",
    introP3: "AI로 점쳐보는 동양철학의 지혜,",
    resultInit: "점괘 생성 후 AI의 첫 번째 통찰이 이곳에 표시됩니다...",
    yangText: "양",
    yinText: "음",
    yangSub: "Yang",
    yinSub: "Yin",
    analyzing: "분석중...",
    tabAi: "✨ AI 맞춤 풀이",
    tabOriginal: "전통 괘 원문",
    resultInitAi: "점괘 생성 후 당신의 고민에 맞는 AI의 현대적 풀이가 이곳에 표시됩니다...",
    resultInitOriginal: "점괘 생성 후 전통적인 주역 괘의 원문 해설이 이곳에 표시됩니다...",
    resultGeneratedAi: "🔮 [AI 현대적 해석]\n본괘와 지괘의 흐름을 보아, 현재 당신이 마주한 상황은 중대한 변화의 기로에 있습니다. AI 분석 결과, 내면의 균형을 유지하고 조급함을 버린다면 조만간 훌륭한 해답을 얻게 될 것입니다. 흐름에 순응하며 성실히 임하십시오.",
    resultGeneratedOriginal: "📜 [주역 괘 원문 해설]\n本卦(본괘) 및 變爻(변효) 분석 결과:\n乾爲天 (건위천) - 天行健 君子以 自强不息\n하늘의 운행이 굳건하니, 군자는 이를 본받아 스스로 힘쓰고 쉬지 아니한다. 변화하는 기운 속에서 바른 길을 고수함이 이롭습니다.",
  },
  EN: {
    headerTitle: "SYA",
    langButton: "KO",
    inputLabel: "Question in front of you",
    inputPlaceholder: "Please write down your question you want to find the answer",
    generateBtnNormal: "Create a fortune telling with AI",
    generateBtnLoading: "Creating AI fortune telling...",
    rouletteLabels: ["Initial Line", "Second Line", "Third Line", "Fourth Line", "Fifth Line", "Top Line"],
    primaryHexTitle: "Primary Hexagram",
    changedHexTitle: "Changed Hexagram",
    resultLabel: "Fortune-telling interpretation",
    detailBtn: "Detailed interpretation of the answer with AI",
    introCTA: "Tap to enter",
    introTitle: "SYA: See Your Answer",
    introP1: "When your vision is blocked by life's problems,",
    introP2: "We reveal the answer.",
    introP3: "Oriental wisdom interpreted by AI,",
    resultInit: "AI insights will appear here after generation...",
    yangText: "양",
    yinText: "음",
    yangSub: "Yang",
    yinSub: "Yin",
    analyzing: "Analyzing...",
    tabAi: "✨ AI Insights",
    tabOriginal: "Traditional Text",
    resultInitAi: "AI's modern interpretation customized for your problem will appear here...",
    resultInitOriginal: "The traditional I Ching hexagram text will appear here...",
    resultGeneratedAi: "🔮 [AI Modern Interpretation]\nThis is the customized AI interpretation for your situation. Analyzing the flow of the primary and changed hexagrams, your current situation is at a turning point. If you maintain inner balance and act with patience, a clear answer will reveal itself soon.",
    resultGeneratedOriginal: "📜 [I Ching Traditional Text]\nAnalysis of Primary and Changing Lines:\nQián (The Creative) - Great success, perseverance brings reward. The movement of heaven is full of power. Thus the superior man makes himself strong and untiring.",
  },
};

interface SlotState {
  status: "idle" | "rolling" | "stopped";
  value?: 2 | 3;
}

export default function Home() {
  const [currentLang, setCurrentLang] = useState<"KO" | "EN">("KO");
  const [activeTab, setActiveTab] = useState<"ai" | "original">("ai");
  const [oracleInput, setOracleInput] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [screenStage, setScreenStage] = useState<"intro" | "main">("intro");
  const [tapToEnterVisible, setTapToEnterVisible] = useState<boolean>(false);
  
  // Transition control for splash screen
  const [splashVisible, setSplashVisible] = useState<boolean>(true);
  const [splashAnimating, setSplashAnimating] = useState<boolean>(false);
  const [dashboardVisible, setDashboardVisible] = useState<boolean>(false);

  const [lastLineIndex, setLastLineIndex] = useState<number>(-1);
  const [lines, setLines] = useState<number[]>([]);
  const [slots, setSlots] = useState<SlotState[]>([
    { status: "idle" },
    { status: "idle" },
    { status: "idle" },
  ]);
  const [highlightedFrame, setHighlightedFrame] = useState<"primary" | "changed" | null>(null);
  const [primaryHexName, setPrimaryHexName] = useState<string>("");
  const [changedHexName, setChangedHexName] = useState<string>("");
  const [aiResult, setAiResult] = useState<string>("");
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [primaryHex, setPrimaryHex] = useState<HexagramData | null>(null);
  const [changedHex, setChangedHex] = useState<HexagramData | null>(null);

  // CTA Timer for Splash screen
  useEffect(() => {
    const timer = setTimeout(() => {
      if (screenStage === "intro") {
        setTapToEnterVisible(true);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [screenStage]);

  // Body overflow locking
  useEffect(() => {
    if (splashVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [splashVisible]);

  const handleSplashClick = () => {
    if (screenStage === "intro") {
      setScreenStage("main");
      setSplashAnimating(true);
      setDashboardVisible(true);
      setTimeout(() => {
        setSplashVisible(false);
      }, 1000);
    }
  };

  const handleGenerate = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setActiveTab("ai");
    setLastLineIndex(0);
    setLines([]);
    setHighlightedFrame(null);
    setPrimaryHexName("");
    setChangedHexName("");
    setAiResult(""); // Clear AI result

    const generatedLines: number[] = [];

    for (let i = 0; i < 6; i++) {
      setLastLineIndex(i);

      // Start slots rolling
      setSlots([
        { status: "rolling" },
        { status: "rolling" },
        { status: "rolling" },
      ]);

      // Wait 800ms
      await new Promise((resolve) => setTimeout(resolve, 800));

      let sum = 0;
      
      // Slot 0 Stops
      const val0 = Math.random() > 0.5 ? 3 : 2;
      sum += val0;
      setSlots([
        { status: "stopped", value: val0 },
        { status: "rolling" },
        { status: "rolling" },
      ]);
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Slot 1 Stops
      const val1 = Math.random() > 0.5 ? 3 : 2;
      sum += val1;
      setSlots([
        { status: "stopped", value: val0 },
        { status: "stopped", value: val1 },
        { status: "rolling" },
      ]);
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Slot 2 Stops
      const val2 = Math.random() > 0.5 ? 3 : 2;
      sum += val2;
      setSlots([
        { status: "stopped", value: val0 },
        { status: "stopped", value: val1 },
        { status: "stopped", value: val2 },
      ]);
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Save line data
      generatedLines.push(sum);
      setLines((prev) => [...prev, sum]);

      // Wait 1000ms before starting next line (or completing)
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    setIsGenerating(false);
    setLastLineIndex(-1);
    setPrimaryHex(null);
    setChangedHex(null);

    // Determine hexagram names and frame highlighting
    const reversedLines = [...generatedLines].reverse();
    const primaryCode = reversedLines.map(sum => (sum === 7 || sum === 9) ? "1" : "0").join("");
    const changedCode = reversedLines.map(sum => (sum === 6 || sum === 7) ? "1" : "0").join("");

    const pHex = findHexagramData(primaryCode);
    const cHex = findHexagramData(changedCode);

    setPrimaryHex(pHex);
    setChangedHex(cHex);

    const t = translations[currentLang];
    
    if (pHex) {
      const detail = currentLang === "KO" ? pHex.ko : pHex.en;
      setPrimaryHexName(`${detail.name}\n${detail.chinese_name}`);
    }
    
    if (cHex) {
      const detail = currentLang === "KO" ? cHex.ko : cHex.en;
      setChangedHexName(`${detail.name}\n${detail.chinese_name}`);
    }

    setAiResult(t.resultGeneratedAi); // Set AI result after generation

    const movingLinesCount = generatedLines.filter((s) => s === 6 || s === 9).length;
    if (movingLinesCount >= 4) {
      setHighlightedFrame("changed");
    } else {
      setHighlightedFrame("primary");
    }

    setIsGenerated(true);
  };

  const getLineDetails = (sum: number) => {
    let pType: "yang" | "yin" = "yang";
    let cType: "yang" | "yin" = "yang";
    let symbol = "";
    let pColor = "bg-white";

    if (sum === 9) {
      pType = "yang";
      cType = "yin";
      symbol = "●";
      pColor = "bg-emerald-400";
    } else if (sum === 6) {
      pType = "yin";
      cType = "yang";
      symbol = "×";
      pColor = "bg-cyan-400";
    } else if (sum === 7) {
      pType = "yang";
      cType = "yang";
      symbol = "";
      pColor = "bg-white";
    } else if (sum === 8) {
      pType = "yin";
      cType = "yin";
      symbol = "";
      pColor = "bg-white";
    }

    return { pType, cType, symbol, pColor };
  };

  const t = translations[currentLang];

  const getRouletteLabel = () => {
    if (isGenerating && lastLineIndex !== -1) {
      return `${t.rouletteLabels[lastLineIndex]} ${t.analyzing}`;
    }
    return t.analyzing;
  };

  return (
    <div className="relative min-h-screen bg-slate-700 select-none">
      {/* Splash Screen Intro */}
      {splashVisible && (
        <div
          className={`splash-screen fixed inset-0 z-[100] flex flex-col items-center justify-center p-margin-mobile ${
            splashAnimating ? "translate-y-[-100%] opacity-0" : ""
          }`}
          onClick={handleSplashClick}
        >
          <div className="relative flex flex-col items-center animate-fade-up">
            <div className="absolute w-64 h-64 bg-emerald-400/20 blur-[80px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="relative z-10 mb-stack-lg logo-glow animate-pulse-subtle">
              <Image
                alt="SYA Logo"
                className="w-64 md:w-80 h-auto"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeGeunIKF47zPgIq3O_t93yoig2f2m3r9ixJKzfzfVcyaIuhrfaaHV1n_LWALHcpQ7_Qn2qMhDAqKYyWWTP2L_nAEOUyn4X8AStMWrOJjkgYr8_dgTnZKpAXWBMw9r6Ok2VUC7VSe3AiC4I7Z9Pupa5XRbgse0By6DkK8crdmgbiaKlFyddpdIteuzQohBehWXDMgO_rqP2yJ0zt5nr9747EWUHnmHM5QdrjGsw7g6Xv4EnDDQNGo-qw6KenzqfOLxZLc"
                width={320}
                height={320}
              />
            </div>
            <div className="text-center space-y-4 z-10 px-4">
              <h1 className="font-display-lg text-[26px] md:text-[32px] text-white font-bold tracking-tight">
                {t.introTitle}
              </h1>

              {/* Mobile Paragraphs */}
              <div className="md:hidden space-y-3">
                <p className="font-body-lg text-slate-100 text-[15px] leading-relaxed">
                  {t.introP1}
                </p>
                <p className="font-body-lg text-slate-100 text-[15px] leading-relaxed">
                  {t.introP2}
                </p>
                <p className="font-label-md text-emerald-400 tracking-widest text-[14px] leading-relaxed font-bold pt-1">
                  {t.introP3}
                </p>
                <p className="font-label-md text-emerald-400 tracking-widest text-[14px] leading-relaxed font-bold">
                  <span className="bg-emerald-400/20 px-2 py-0.5 rounded">AI 주역</span>
                </p>
              </div>

              {/* Desktop Paragraphs */}
              <div className="hidden md:block space-y-4">
                <p className="font-body-lg text-slate-100 text-[18px] leading-relaxed">
                  {t.introP1} {t.introP2}
                </p>
                <p className="font-label-md text-emerald-400 tracking-widest text-[16px] leading-relaxed font-bold">
                  <span className="">{t.introP3}</span>{" "}
                  <span className="bg-emerald-400/20 px-2 py-1 rounded">AI 주역</span>
                </p>
              </div>
            </div>
            <div
              className={`absolute bottom-[-100px] left-1/2 -translate-x-1/2 animate-blink transition-opacity duration-1000 ${
                tapToEnterVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              <p className="font-label-md text-slate-200 text-sm tracking-widest uppercase">
                {t.introCTA}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Virtual Mobile Dashboard */}
      <div
        className={`transition-all duration-1000 ease-out flex justify-center min-h-screen bg-slate-700 overflow-y-auto ${
          dashboardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
        id="dashboard"
      >
        <div className="w-full max-w-md bg-slate-700 flex flex-col min-h-screen border-x border-white/10 shadow-2xl relative">
          <header className="sticky top-0 z-50 bg-slate-700/80 backdrop-blur-md border-b border-white/20 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden flex items-center justify-center bg-emerald-400/20">
                <Image
                  alt="SYA Logo Icon"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtAamKFD-nhRdXM4vrKGq5HOLQXZ_WPmNXoAJ5v9seW54-7jOfnoziy7yzhbKXi9ieJW_MWBjRnCxfONOEy0D06NBJ98wKs5gaa97vvK7j5TOYQFmkwSyTv08iPXphu6_1jxiEXjSji8u-_XARuKANXPGV6Zqi8gThfTSTgFBjB5C5PcPaTefm5hlSGVmVWp0w5guNuHv0fFPPBleJisD8ftyXUjTmUPfeK0LUdlPYM11cWwMVmAXf_ef1feId9q1AqS0"
                  width={56}
                  height={56}
                />
              </div>
              <h2 className="text-white text-2xl font-bold tracking-tight">
                {t.headerTitle}
              </h2>
            </div>
            <button
              className="px-3 py-1 rounded-full border-2 border-white/30 text-xs font-label-md text-white hover:bg-white/10 transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentLang((prev) => (prev === "KO" ? "EN" : "KO"));
              }}
            >
              {t.langButton}
            </button>
          </header>

          <main className="flex-1 px-6 py-8 space-y-10 pb-32">
            {/* Input Section */}
            <div className="space-y-3">
              <label className="font-label-sm text-xs text-slate-100 flex items-center gap-2">
                <HelpCircle className="w-3 h-3 animate-none" strokeWidth={2} />
                {t.inputLabel}
              </label>
              <div className="relative">
                <textarea
                  className="w-full h-32 bg-white/10 backdrop-blur-lg border-2 border-white/20 rounded-xl p-4 pr-12 text-white font-body-md focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 outline-none resize-none transition-all placeholder:text-slate-300"
                  placeholder={t.inputPlaceholder}
                  value={oracleInput}
                  onChange={(e) => {
                    setOracleInput(e.target.value);
                    setIsGenerated(false);
                  }}
                />
                {oracleInput && (
                  <button
                    onClick={() => {
                      setOracleInput("");
                      setIsGenerated(false);
                    }}
                    className="absolute bottom-4 right-4 p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !oracleInput.trim() || isGenerated}
                className="w-full bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-headline-md py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-[0_0_20px_rgba(52,211,153,0.3)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw
                  className={`w-5 h-5 ${isGenerating ? "animate-yin-yang" : ""}`}
                  strokeWidth={2}
                />
                <span className="font-bold">{isGenerating ? t.generateBtnLoading : t.generateBtnNormal}</span>
              </button>
            </div>

            {/* Roulette Section */}
            {isGenerating && (
              <div className="glass-panel rounded-2xl p-6 animate-pulse-subtle" id="roulette-frame">
                <div className="flex flex-col items-center gap-4">
                  <span className="font-label-md text-emerald-400 text-sm uppercase tracking-widest font-bold">
                    {getRouletteLabel()}
                  </span>
                  <div className="flex gap-4">
                    {slots.map((slot, i) => (
                      <div
                        key={i}
                        className="w-24 h-24 bg-slate-800 rounded-lg flex flex-col items-center justify-center overflow-hidden border-2 border-white/20"
                      >
                        {slot.status === "rolling" ? (
                          <div className="slot-rolling flex flex-col items-center justify-center">
                            <span className="text-white font-black text-xl md:text-2xl">{t.yangText}</span>
                            <span className="text-slate-400 font-bold text-xs md:text-sm uppercase tracking-wider mt-1">
                              {t.yangSub}
                            </span>
                            <div className="h-4"></div>
                            <span className="text-white font-black text-xl md:text-2xl">{t.yinText}</span>
                            <span className="text-slate-400 font-bold text-xs md:text-sm uppercase tracking-wider mt-1">
                              {t.yinSub}
                            </span>
                          </div>
                        ) : slot.status === "stopped" && slot.value !== undefined ? (
                          <div className="flex flex-col items-center justify-center h-full animate-fade-up">
                            <span
                              className={`${
                                slot.value === 3 ? "text-emerald-400" : "text-cyan-400"
                              } font-black text-xl md:text-2xl`}
                            >
                              {slot.value === 3 ? t.yangText : t.yinText}
                            </span>
                            <span className="text-slate-300 font-bold text-xs md:text-sm uppercase tracking-wider mt-1">
                              {slot.value === 3 ? t.yangSub : t.yinSub}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center">
                            <span className="text-white font-black text-xl md:text-2xl">
                              {t.yangText}/{t.yinText}
                            </span>
                            <span className="text-slate-400 font-bold text-xs md:text-sm uppercase tracking-wider mt-1">
                              {t.yangSub}/{t.yinSub}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Hexagram Section */}
            <div className="grid grid-cols-2 gap-2" id="hexagram-container">
              {/* Primary Hexagram Frame */}
              <div
                className={`glass-panel rounded-xl p-4 md:p-6 flex flex-col items-center transition-all duration-700 ${
                  highlightedFrame === "primary" ? "highlight-hex" : ""
                }`}
                id="primary-hex-frame"
              >
                <span className="text-[10px] font-label-sm text-slate-100 uppercase mb-4 font-bold text-center">
                  {t.primaryHexTitle}
                </span>
                <div className="flex flex-col-reverse gap-1 w-full items-center justify-center min-h-[144px]" id="primary-lines">
                  {lines.map((sum, index) => {
                    const { pType, pColor, symbol } = getLineDetails(sum);
                    return (
                      <div
                        key={index}
                        className={`relative flex items-center justify-center w-full h-4 animate-fade-up ${index === 3 ? 'mb-[0.3rem]' : ''}`}
                      >
                        <div className="flex items-center justify-center gap-2 w-28 h-3">
                          {pType === "yang" ? (
                            <div className={`h-full w-full ${pColor} rounded-none`}></div>
                          ) : (
                            <>
                              <div className={`h-full w-[49%] ${pColor} rounded-none`}></div>
                              <div className="h-full w-[2%]"></div>
                              <div className={`h-full w-[49%] ${pColor} rounded-none`}></div>
                            </>
                          )}
                          </div>
                          {symbol && (
                          <span className={`absolute left-[calc(50%+64px)] -translate-y-1/2 top-1/2 font-bold ${symbol === '●' ? 'text-emerald-400 text-xs' : 'text-emerald-400 text-lg'} leading-none`}>
                            {symbol}
                          </span>
                          )}
                      </div>
                    );
                  })}
                </div>
                <div
                  className="text-sm md:text-base font-bold text-center mt-2 tracking-wide text-emerald-400 min-h-[3.5rem] whitespace-pre-line leading-relaxed"
                  id="primary-hex-name"
                >
                  {primaryHexName}
                </div>
              </div>

              {/* Changed Hexagram Frame */}
              <div
                className={`glass-panel rounded-xl p-4 md:p-6 flex flex-col items-center transition-all duration-700 ${
                  highlightedFrame === "changed" ? "highlight-hex" : ""
                }`}
                id="changed-hex-frame"
              >
                <span className="text-[10px] font-label-sm text-slate-100 uppercase mb-4 font-bold text-center">
                  {t.changedHexTitle}
                </span>
                <div className="flex flex-col-reverse gap-1 w-full items-center justify-center min-h-[144px]" id="changed-lines">
                  {lines.map((sum, index) => {
                    const { cType } = getLineDetails(sum);
                    return (
                      <div
                        key={index}
                        className={`relative flex items-center justify-center w-full h-4 animate-fade-up ${index === 3 ? 'mb-[0.3rem]' : ''}`}
                      >
                        <div className="flex items-center justify-center gap-2 w-28 h-3">
                          {cType === "yang" ? (
                            <div className="h-full w-full bg-white rounded-none"></div>
                          ) : (
                            <>
                              <div className="h-full w-[49%] bg-white rounded-none"></div>
                              <div className="h-full w-[2%]"></div>
                              <div className="h-full w-[49%] bg-white rounded-none"></div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div
                  className="text-sm md:text-base font-bold text-center mt-2 tracking-wide text-cyan-400 min-h-[3.5rem] whitespace-pre-line leading-relaxed"
                  id="changed-hex-name"
                >
                  {changedHexName}
                </div>
              </div>
            </div>

            {/* Interpretation Section */}
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="font-label-sm text-xs text-slate-100">{t.resultLabel}</label>
                
                {/* Tab Headers */}
                <div className="flex bg-slate-800/50 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setActiveTab("ai")}
                    className={`flex-1 py-2 text-center text-xs md:text-sm rounded-lg transition-all cursor-pointer ${
                      activeTab === "ai"
                        ? "bg-white/20 text-white font-bold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {t.tabAi}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("original")}
                    className={`flex-1 py-2 text-center text-xs md:text-sm rounded-lg transition-all cursor-pointer ${
                      activeTab === "original"
                        ? "bg-white/20 text-white font-bold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {t.tabOriginal}
                  </button>
                </div>

                {/* Content Box */}
                <div className="w-full bg-white/10 backdrop-blur-lg border-2 border-white/20 rounded-xl p-4 min-h-[120px] text-slate-100 font-body-md text-sm animate-fade-up">
                  {activeTab === "ai" ? (
                    <div className="whitespace-pre-line">
                      {!aiResult ? t.resultInitAi : aiResult}
                    </div>
                  ) : (
                    renderTraditionalTab(isGenerating ? [] : lines, currentLang, t.resultInitOriginal, isGenerating ? null : primaryHex, isGenerating ? null : changedHex)
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
