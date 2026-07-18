"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { HelpCircle, RefreshCw, X } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import pdfMake from "pdfmake/build/pdfmake";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import pdfFonts from "pdfmake/build/vfs_fonts";
import ichingData from "../data/i-ching.json";

import InfoButtons from "./components/InfoButtons";
import { useLanguage } from "./context/LanguageContext";

// Register fonts
(pdfMake as any).vfs = pdfFonts;

const getZhuXiRules = (movingLinesCount: number, currentLang: "ko" | "en") => {
  const rules: Record<number, string> = {
    0: currentLang === 'ko' ? "분석 무게중심: 본괘 100%. 상황 정체, 본괘의 전체 괘사와 대운을 중심에 두고 풀이하십시오." : "Focus: 100% Original Hexagram. Situation is stagnant; interpret the overall Judgment and flow.",
    1: currentLang === 'ko' ? "분석 무게중심: 본괘 괘사 30% + 해당하는 1개 동효 70%. 이 1개 효사의 경고와 조언을 핵심 열쇠로 하여 행동 지침을 제시하십시오." : "Focus: 30% Original Judgment + 70% the specific moving line. The line's warning/advice is key.",
    2: currentLang === 'ko' ? "분석 무게중심: 본괘 괘사 20% + 아랫쪽 동효 50% + 윗쪽 동효 30%. 아랫쪽 동효가 1순위 핵심 열쇠, 윗쪽은 2순위 보완 조언입니다." : "Focus: 20% Original Judgment + 50% lower moving line (key) + 30% upper line (supplementary).",
    3: currentLang === 'ko' ? "분석 무게중심: 본괘 50% + 지괘 50%. 3개 동효 중 '가운데 위치한 효사'를 핵심 축으로 삼아 현재 대처 방안을 도출하고 지괘 괘사로 결론을 맺으십시오." : "Focus: 50% Original + 50% Changed. Use the middle moving line as the pivot to derive advice, conclude with Changed Judgment.",
    4: currentLang === 'ko' ? "분석 무게중심: 지괘 괘사 70% + 지괘의 미변효 20% + 본괘 10%. 미래(지괘)가 주(主)이며, 지괘의 2개 미변효를 핵심 조언으로 삼으십시오." : "Focus: 70% Changed Judgment + 20% Changed static lines + 10% Original. Future (Changed) dominates.",
    5: currentLang === 'ko' ? "분석 무게중심: 지괘 괘사 80% + 지괘의 미변효 15% + 본괘 5%. 지괘 괘사를 중심으로, 단 1개의 지괘 미변효를 마지막 실천 조언으로 강조하십시오." : "Focus: 80% Changed Judgment + 15% Changed static line + 5% Original. Changed Judgment is key.",
    6: currentLang === 'ko' ? "분석 무게중심: 지괘 괘사 90% + (특수 시) 특수 효사 10%. 환골탈태의 시기이므로 지괘 전체 괘사와 운의 흐름을 강력하게 이끌어 주십시오. 111111/000000일 경우만 마지막 7번째 효사를 활용하십시오." : "Focus: 90% Changed Judgment + 10% special line. A time of transformation; lead with the Changed Hexagram's flow.",
  };
  return rules[movingLinesCount] || "";
};

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

const renderLinesSection = (hex: HexagramDetail, highlightLineKeys: string[], boldLineKeys: string[], asAccordion: boolean, defaultOpen = false, noBoldAll = false, lang: "ko" | "en" = "ko") => {
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
      <Accordion title={lang === "ko" ? "효사 (Lines)" : "Lines"} defaultOpen={defaultOpen}>
        {content}
      </Accordion>
    );
  }

  return (
    <div className="space-y-2 my-4">
      <h4 className="text-xs text-slate-400 font-semibold">{lang === "ko" ? "효사 (Lines)" : "Lines"}</h4>
      {content}
    </div>
  );
};

const renderTraditionalTab = (
  lines: number[], 
  currentLang: "ko" | "en", 
  initMessage: string, 
  primaryHex: HexagramData | null, 
  changedHex: HexagramData | null
): { jsx: React.ReactNode; text: string } => {
  if (lines.length === 0 || !primaryHex) {
    return {
      jsx: (
        <div className="text-center text-slate-400 py-8 italic whitespace-pre-line">
          {initMessage}
        </div>
      ),
      text: ""
    };
  }

  const pHex = currentLang === "ko" ? primaryHex.ko : primaryHex.en;
  const cHex = changedHex ? (currentLang === "ko" ? changedHex.ko : changedHex.en) : null;
  const isKo = currentLang === 'ko';

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
  const trans = originalTabTranslations[isKo ? "KO" : "EN"];
  const sanitize = (text: string) => isKo ? text : text.replace(/[\u4e00-\u9fa5]/g, '').trim();

  let caseText = "";
  let jsx: React.ReactNode = null;

  switch (movingCount) {
    case 0:
      caseText = `${isKo ? "[본괘]" : "[Primary Hexagram]"}\n${sanitize(pHex.name)} ${pHex.chinese_name || ''}\n${trans.judgment} ${pHex.judgment.text}\n${trans.tanjun} ${pHex.tanjun}\n${trans.sangjun} ${pHex.sangjun}\n${trans.lines}\n${Object.keys(pHex.lines || {}).sort((a,b)=>Number(a)-Number(b)).map(k => `${k}. ${pHex.lines[k].text}\n   (${pHex.lines[k].comments})`).join('\n')}`;
      jsx = (
        <div className="space-y-4">
          {renderHexagramHeader(pHex)}
          {renderSection(trans.tanjun, pHex.tanjun, false)}
          {renderSection(trans.sangjun, pHex.sangjun, false)}
          {renderLinesSection(pHex, [], [], false, false, false, currentLang)}
        </div>
      );
      break;
    case 1:
      caseText = `${isKo ? "[본괘]" : "[Primary Hexagram]"}\n${sanitize(pHex.name)} ${pHex.chinese_name || ''}\n${trans.judgment} ${pHex.judgment.text}\n${trans.tanjun} ${pHex.tanjun}\n${trans.sangjun} ${pHex.sangjun}\n${trans.lines}\n${Object.keys(pHex.lines || {}).sort((a,b)=>Number(a)-Number(b)).map(k => `${Number(k)-1 === movingLineIndices[0] ? (isKo ? "[★ 핵심 조언] " : "[★ Key Advice] ") : ""}${k}. ${pHex.lines[k].text}\n   (${pHex.lines[k].comments})`).join('\n')}`;
      jsx = (
        <div className="space-y-4">
          {renderHexagramHeader(pHex)}
          {renderSection(trans.tanjun, pHex.tanjun, false)}
          {renderSection(trans.sangjun, pHex.sangjun, false)}
          {renderLinesSection(pHex, [(movingLineIndices[0]+1).toString()], [(movingLineIndices[0]+1).toString()], false, false, false, currentLang)}
        </div>
      );
      break;
    case 2:
      caseText = `${isKo ? "[본괘]" : "[Primary Hexagram]"}\n${sanitize(pHex.name)} ${pHex.chinese_name || ''}\n${trans.judgment} ${pHex.judgment.text}\n${trans.tanjun} ${pHex.tanjun}\n${trans.sangjun} ${pHex.sangjun}\n${trans.lines}\n${Object.keys(pHex.lines || {}).sort((a,b)=>Number(a)-Number(b)).map(k => {
        const idx = Number(k)-1;
        const mark = idx === movingLineIndices[0] ? (isKo ? "[★ 핵심 조언] " : "[★ Key Advice] ") : (idx === movingLineIndices[1] ? (isKo ? "[★ 보완 조언] " : "[★ Supplementary Advice] ") : "");
        return `${mark}${k}. ${pHex.lines[k].text}\n   (${pHex.lines[k].comments})`;
      }).join('\n')}`;
      jsx = (
        <div className="space-y-4">
          {renderHexagramHeader(pHex)}
          {renderSection(trans.tanjun, pHex.tanjun, false)}
          {renderSection(trans.sangjun, pHex.sangjun, false)}
          {renderLinesSection(pHex, [(movingLineIndices[0]+1).toString(), (movingLineIndices[1]+1).toString()], [(movingLineIndices[0]+1).toString()], false, false, false, currentLang)}
        </div>
      );
      break;
    case 3:
      caseText = `${trans.threeLinesChanging}\n\n${isKo ? "[본괘]" : "[Primary Hexagram]"}\n${sanitize(pHex.name)} ${pHex.chinese_name || ''}\n${trans.judgment} ${pHex.judgment.text}\n${trans.tanjun} ${pHex.tanjun}\n${trans.sangjun} ${pHex.sangjun}\n${trans.lines}\n${Object.keys(pHex.lines || {}).sort((a,b)=>Number(a)-Number(b)).map(k => {
        const idx = Number(k)-1;
        const mark = idx === movingLineIndices[1] ? (isKo ? "[★ 핵심 조언] " : "[★ Key Advice] ") : (movingLineIndices.includes(idx) ? (isKo ? "[★ 변화 효사] " : "[★ Changing Line] ") : "");
        return `${mark}${k}. ${pHex.lines[k].text}\n   (${pHex.lines[k].comments})`;
      }).join('\n')}\n\n${isKo ? "[지괘]" : "[Changed Hexagram]"}\n${sanitize(cHex!.name)} ${cHex!.chinese_name || ''}\n${trans.judgment} ${cHex!.judgment.text}\n${trans.tanjun} ${cHex!.tanjun}\n${trans.sangjun} ${cHex!.sangjun}\n${trans.lines}\n${Object.keys(cHex!.lines || {}).sort((a,b)=>Number(a)-Number(b)).map(k => `${k}. ${cHex!.lines[k].text}\n   (${cHex!.lines[k].comments})`).join('\n')}`;
      jsx = (
        <div className="space-y-6">
          <div className="text-sm font-bold text-emerald-400 text-center py-2 bg-emerald-400/10 rounded-lg border border-emerald-400/20">
            {trans.threeLinesChanging}
          </div>
          <div className="space-y-4 pt-2">
            <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider border-l-4 border-emerald-400 pl-2">
              {trans.primaryTitle}
            </h4>
            {renderHexagramHeader(pHex)}
            {renderSection(trans.tanjun, pHex.tanjun, true)}
            {renderSection(trans.sangjun, pHex.sangjun, true)}
            {renderLinesSection(pHex, movingLineIndices.map(i => (i+1).toString()), [(movingLineIndices[1]+1).toString()], false, false, false, currentLang)}
          </div>
          <hr className="border-white/10 my-6" />
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider border-l-4 border-cyan-400 pl-2">
              {trans.changedTitle}
            </h4>
            {renderHexagramHeader(cHex!)}
            {renderSection(trans.tanjun, cHex!.tanjun, true, false)}
            {renderSection(trans.sangjun, cHex!.sangjun, true, false)}
            {renderLinesSection(cHex!, [], [], true, false, false, currentLang)}
          </div>
        </div>
      );
      break;
    case 4:
      caseText = `${isKo ? "[지괘]" : "[Changed Hexagram]"}\n${sanitize(cHex!.name)} ${cHex!.chinese_name || ''}\n${trans.judgment} ${cHex!.judgment.text}\n${trans.tanjun} ${cHex!.tanjun}\n${trans.sangjun} ${cHex!.sangjun}\n${trans.lines}\n${Object.keys(cHex!.lines || {}).sort((a,b)=>Number(a)-Number(b)).map(k => {
        const idx = Number(k)-1;
        const mark = staticLineIndices.includes(idx) ? (isKo ? "[★ 핵심 조언] " : "[★ Key Advice] ") : "";
        return `${mark}${k}. ${cHex!.lines[k].text}\n   (${cHex!.lines[k].comments})`;
      }).join('\n')}\n\n${isKo ? "--- 과거의 상태/원인 ---\n" : "--- Past Status/Cause ---\n"}\n${isKo ? "[본괘]" : "[Primary Hexagram]"}\n${sanitize(pHex.name)} ${pHex.chinese_name || ''}\n${trans.judgment} ${pHex.judgment.text}\n${trans.tanjun} ${pHex.tanjun}\n${trans.sangjun} ${pHex.sangjun}\n${trans.lines}\n${Object.keys(pHex.lines || {}).sort((a,b)=>Number(a)-Number(b)).map(k => `${k}. ${pHex.lines[k].text}\n   (${pHex.lines[k].comments})`).join('\n')}`;
      jsx = (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider border-l-4 border-cyan-400 pl-2">
              {trans.changedTitle}
            </h4>
            {renderHexagramHeader(cHex!)}
            {renderSection(trans.tanjun, cHex!.tanjun, false)}
            {renderSection(trans.sangjun, cHex!.sangjun, false)}
            {renderLinesSection(cHex!, staticLineIndices.map(i => (i+1).toString()), staticLineIndices.map(i => (i+1).toString()), false, false, false, currentLang)}
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
      break;
    case 5:
      caseText = `${isKo ? "[지괘]" : "[Changed Hexagram]"}\n${sanitize(cHex!.name)} ${cHex!.chinese_name || ''}\n${trans.judgment} ${cHex!.judgment.text}\n${trans.tanjun} ${cHex!.tanjun}\n${trans.sangjun} ${cHex!.sangjun}\n${trans.lines}\n${Object.keys(cHex!.lines || {}).sort((a,b)=>Number(a)-Number(b)).map(k => {
        const idx = Number(k)-1;
        const mark = idx === staticLineIndices[0] ? (isKo ? "[★ 핵심 조언] " : "[★ Key Advice] ") : "";
        return `${mark}${k}. ${cHex!.lines[k].text}\n   (${cHex!.lines[k].comments})`;
      }).join('\n')}\n\n${isKo ? "--- 과거의 상태/원인 ---\n" : "--- Past Status/Cause ---\n"}\n${isKo ? "[본괘]" : "[Primary Hexagram]"}\n${sanitize(pHex.name)} ${pHex.chinese_name || ''}\n${trans.judgment} ${pHex.judgment.text}\n${trans.tanjun} ${pHex.tanjun}\n${trans.sangjun} ${pHex.sangjun}\n${trans.lines}\n${Object.keys(pHex.lines || {}).sort((a,b)=>Number(a)-Number(b)).map(k => `${k}. ${pHex.lines[k].text}\n   (${pHex.lines[k].comments})`).join('\n')}`;
      jsx = (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider border-l-4 border-cyan-400 pl-2">
              {trans.changedTitle}
            </h4>
            {renderHexagramHeader(cHex!)}
            {renderSection(trans.tanjun, cHex!.tanjun, false)}
            {renderSection(trans.sangjun, cHex!.sangjun, false)}
            {renderLinesSection(cHex!, [(staticLineIndices[0]+1).toString()], [(staticLineIndices[0]+1).toString()], false, false, false, currentLang)}
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
      break;
    case 6: {
      const changedCode = lines.map(sum => (sum === 6 || sum === 9) ? "1" : "0").join("");
      const isSpecialHex = changedCode === "111111" || changedCode === "000000";
      const highlightKeys = isSpecialHex ? ["7"] : [];
      caseText = `${isKo ? "[지괘]" : "[Changed Hexagram]"}\n${sanitize(cHex!.name)} ${cHex!.chinese_name || ''}\n${trans.judgment} ${cHex!.judgment.text}\n${trans.tanjun} ${cHex!.tanjun}\n${trans.sangjun} ${cHex!.sangjun}\n${trans.lines}\n${Object.keys(cHex!.lines || {}).sort((a,b)=>Number(a)-Number(b)).map(k => {
        const mark = (isSpecialHex && k === "7") ? (isKo ? "[★ 핵심 조언] " : "[★ Key Advice] ") : "";
        return `${mark}${k}. ${cHex!.lines[k].text}\n   (${cHex!.lines[k].comments})`;
      }).join('\n')}\n\n${isKo ? "--- 과거의 상태/원인 ---\n" : "--- Past Status/Cause ---\n"}\n${isKo ? "[본괘]" : "[Primary Hexagram]"}\n${sanitize(pHex.name)} ${pHex.chinese_name || ''}\n${trans.judgment} ${pHex.judgment.text}\n${trans.tanjun} ${pHex.tanjun}\n${trans.sangjun} ${pHex.sangjun}\n${trans.lines}\n${Object.keys(pHex.lines || {}).sort((a,b)=>Number(a)-Number(b)).map(k => `${k}. ${pHex.lines[k].text}\n   (${pHex.lines[k].comments})`).join('\n')}`;
      jsx = (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider border-l-4 border-cyan-400 pl-2">
              {trans.changedTitle}
            </h4>
            {renderHexagramHeader(cHex!)}
            {renderSection(trans.tanjun, cHex!.tanjun, false)}
            {renderSection(trans.sangjun, cHex!.sangjun, false)}
            {renderLinesSection(cHex!, highlightKeys, highlightKeys, false, false, false, currentLang)}
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
      break;
    }
    default:
      jsx = null;
  }
  return { jsx, text: caseText };
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
  saveResult: string;
}

const translations: Record<"ko" | "en", Translation> = {
  ko: {
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
    saveResult: "결과 저장",
  },
  en: {
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
    introTitle: "시야(視野), See Your Answer(SYA)",
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
    saveResult: "Save Result",
  },
};

interface SlotState {
  status: "idle" | "rolling" | "stopped";
  value?: 2 | 3;
}

export default function Home() {
  const { language, toggleLanguage } = useLanguage();
  const rouletteRef = useRef<HTMLDivElement>(null); // Ref for roulette
  const hexagramRef = useRef<HTMLDivElement>(null); // Ref for results

  const scrollToRoulette = () => {
    if (!rouletteRef.current) return;
    const headerHeight = 80;
    const elementPosition = rouletteRef.current.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };

  const scrollToHexagrams = () => {
    if (!hexagramRef.current) return;
    const headerHeight = 80;
    const elementPosition = hexagramRef.current.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };

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
  const [showFormula, setShowFormula] = useState<boolean>(false);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [primaryHex, setPrimaryHex] = useState<HexagramData | null>(null);
  const [changedHex, setChangedHex] = useState<HexagramData | null>(null);
  const [traditionalPdfText, setTraditionalPdfText] = useState("");
  
  // AI State
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [aiError, setApiError] = useState<string | null>(null);
  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(false);
  const [isPdfEnabled, setIsPdfEnabled] = useState<boolean>(false); 


  // Reset button state when input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOracleInput(e.target.value);
    setIsPdfEnabled(false);
  };

  const handleDownloadPDF = async () => {
    if (!aiResult || !primaryHex) return;
    setIsPdfLoading(true);

    try {
      // 1. Language and Data Mapping
      const isKo = language === 'ko';
      const pHexData = isKo ? primaryHex.ko : primaryHex.en;
      const cHexData = changedHex ? (isKo ? changedHex.ko : changedHex.en) : null;


      // 2. Label Setup
      const labels = isKo ? {
        title: "시야(視野) - 점괘 결과 보고서",
        question: "■ 내담자의 질문",
        hex: "■ 생성된 점괘",
        trad: "■ 전통 괘 원문",
        ai: "■ AI 맞춤 현대적 해석"
      } : {
        title: "SYA(See Your Answer) - Consultation Report",
        question: "■ Seeker's Question",
        hex: "■ Generated Hexagrams",
        trad: "■ Traditional Text Interpretation",
        ai: "■ AI Modern Interpretation"
      };

      const sanitize = (text: string) => isKo ? text : text.replace(/[\u4e00-\u9fa5]/g, '').trim();

      // 3. Direct URL Font Definition (Using NanumGothic)
      (pdfMake as any).fonts = {
        NotoSansKR: {
          normal: 'https://cdn.jsdelivr.net/gh/fonts-archive/NanumGothic/NanumGothic.ttf',
          bold: 'https://cdn.jsdelivr.net/gh/fonts-archive/NanumGothic/NanumGothicBold.ttf'
        }
      };
      
      // 4. Construct Content
      const content = [
        { text: labels.title, style: 'header' },
        { canvas: [{ type: 'line' as 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1 }] },
        { text: '\n' },
        { text: labels.question, style: 'sectionTitle' },
        { text: oracleInput || "질문 없음", style: 'body' },
        { text: labels.hex, style: 'sectionTitle' },
        { 
          text: `${sanitize(pHexData.name)} ${isKo ? "(" + pHexData.chinese_name + ")" : ""} -> ${cHexData ? sanitize(cHexData.name) + (isKo ? " (" + cHexData.chinese_name + ")" : "") : (isKo ? "변화 없음" : "No change")}`, 
          style: 'body' 
        },
        { text: labels.ai, style: 'sectionTitle' },
        { text: aiResult, style: 'body' },
        { text: labels.trad, style: 'sectionTitle' },
        { text: traditionalPdfText, style: 'body' }
        ];



      // 5. Doc Definition
      const docDefinition: TDocumentDefinitions = {
        defaultStyle: { font: 'NotoSansKR' },
        content,
        styles: {
          header: { fontSize: 18, bold: true, alignment: 'center', margin: [0, 0, 0, 20] },
          sectionTitle: { fontSize: 13, bold: true, margin: [0, 15, 0, 5] },
          body: { fontSize: 10, lineHeight: 1.4 }
        } as any
      };

      // 6. Generate and Download
      const timestamp = new Date().toISOString().replace(/[:T]/g, '-').split('.')[0];
      pdfMake.createPdf(docDefinition).download(`sya-oracle-result-${timestamp}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setIsPdfLoading(false);
    }
  };

  const fetchAIInterpretation = async (question: string, p: HexagramData, c: HexagramData | null, linesArr: number[]) => {
    setIsLoadingAi(true);
    setApiError(null);
    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
      //const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
      const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

      const movingLinesCount = linesArr.filter((s) => s === 6 || s === 9).length;
      const ruleDescription = getZhuXiRules(movingLinesCount, language);

      const prompt = `
        System Role: You are a master of the I Ching, acting as a life mentor. Provide empathetic, clear, modern advice (3-4 paragraphs) in ${language === 'ko' ? 'Korean' : 'English'}.
        
        Context:
        User Question: ${question}
        Primary Hexagram: ${p.ko.name} / ${p.en.name} (${p.ko.gwa_name} / ${p.en.gwa_name})
        Changed Hexagram: ${c ? (c.ko.name + "/" + c.en.name) : "None"}
        Moving Lines Count: ${movingLinesCount}
        Interpretation Rule to Strictly Follow: ${ruleDescription}

        Provide the interpretation now:
      `;

      const result = await model.generateContent(prompt);
      setAiResult(result.response.text());
      setIsPdfEnabled(true); // Enable button
    } catch (err) {
      console.error("AI API Error:", err);
      setApiError(language === 'ko' ? "해석 생성 중 오류가 발생했습니다." : "Error generating interpretation.");
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Body overflow locking
  useEffect(() => {
    if (splashVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [splashVisible]);

  // Auto-scroll when generating starts
  useEffect(() => {
    if (isGenerating) {
      setTimeout(scrollToRoulette, 100);
    }
  }, [isGenerating]);

  // Auto-scroll when hexagrams are generated
  useEffect(() => {
    if (isGenerated) {
      setTimeout(scrollToHexagrams, 100);
    }
  }, [isGenerated]);

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
    setShowFormula(false);
    setIsPdfEnabled(false); // Reset button state
    setActiveTab("ai");
    setLastLineIndex(0);
    setLines([]);
    setHighlightedFrame(null);
    setPrimaryHexName("");
    setChangedHexName("");
    setAiResult(""); // Clear AI result
    
    // Clear slots to reset formula/labels
    setSlots([
      { status: "idle" },
      { status: "idle" },
      { status: "idle" },
    ]);

    const generatedLines: number[] = [];

    for (let i = 0; i < 6; i++) {
      setLastLineIndex(i);
      setShowFormula(false);

      // Start slots rolling and clear previous formula/label
      setSlots([
        { status: "rolling", value: undefined },
        { status: "rolling", value: undefined },
        { status: "rolling", value: undefined },
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
      setShowFormula(true); // Show formula only AFTER lines are updated

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

    const t = translations[language];
    
    if (pHex) {
      const detail = language === "ko" ? pHex.ko : pHex.en;
      setPrimaryHexName(`${detail.name}\n${detail.chinese_name}`);
    }
    
    if (cHex) {
      const detail = language === "ko" ? cHex.ko : cHex.en;
      setChangedHexName(`${detail.name}\n${detail.chinese_name}`);
    }

    // Fetch AI Interpretation
    if (pHex) {
      fetchAIInterpretation(oracleInput, pHex, cHex, generatedLines);
    }

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

  const t = translations[language];

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
                priority={true}
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
                  <span className="bg-emerald-400/20 px-2 py-0.5 rounded">{language === 'ko' ? 'AI 주역' : 'AI I-CHING'}</span>
                </p>
              </div>

              {/* Desktop Paragraphs */}
              <div className="hidden md:block space-y-4">
                <p className="font-body-lg text-slate-100 text-[18px] leading-relaxed">
                  {t.introP1} {t.introP2}
                </p>
                <p className="font-label-md text-emerald-400 tracking-widest text-[16px] leading-relaxed font-bold">
                  <span className="">{t.introP3}</span>{" "}
                  <span className="bg-emerald-400/20 px-2 py-1 rounded">{language === 'ko' ? 'AI 주역' : 'AI I-CHING'}</span>
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
                toggleLanguage();
              }}
            >
              {t.langButton}
            </button>
          </header>
          <InfoButtons currentLang={language.toUpperCase() as "KO" | "EN"} />

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
                    setIsPdfEnabled(false);
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
              <div ref={rouletteRef} className="glass-panel rounded-2xl p-6 animate-pulse-subtle" id="roulette-frame">
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
                            <span className="text-slate-400 font-bold text-xs mt-1">
                              {slot.value}
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
                  {/* Final Sum Formula */}
                  {showFormula && (
                    <div className="text-emerald-400 font-bold text-sm mt-3 px-4">
                       {language === 'ko' ? '동전 결과: ' : 'Coin Result: '}
                       {slots.map(s => s.value).join(' + ')} = <span className="font-black text-base">{slots.reduce((sum, s) => sum + (s.value || 0), 0)}</span>
                       <span className="text-emerald-400 font-black text-base ml-2">
                         ({lines.length > 0 ? (lines[lines.length - 1] === 6 ? (language === 'ko' ? '노음' : 'Old Yin') : lines[lines.length - 1] === 7 ? (language === 'ko' ? '소양' : 'Young Yang') : lines[lines.length - 1] === 8 ? (language === 'ko' ? '소음' : 'Young Yin') : (language === 'ko' ? '노양' : 'Old Yang')) : ''})
                       </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Hexagram Section */}
            <div ref={hexagramRef} className="grid grid-cols-2 gap-2" id="hexagram-container">
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

                <label className="font-label-sm text-xs text-slate-100 flex justify-between items-center">
                  <span>{t.resultLabel}</span>
                  <button
                    onClick={handleDownloadPDF}
                    disabled={!isPdfEnabled || isPdfLoading}
                    className={`text-xs bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-bold px-3 py-1 rounded-full transition flex items-center gap-1 ${!isPdfEnabled || isPdfLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >

                    {isPdfLoading ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        PDF 생성 중...
                      </>
                    ) : (
                      t.saveResult
                    )}
                  </button>
                </label>
                
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
                    <div className="whitespace-pre-wrap">
                      {isLoadingAi ? (
                        <div className="flex items-center justify-center py-4">
                          <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
                        </div>
                      ) : aiError ? (
                        <div className="text-red-400">{aiError}</div>
                      ) : !aiResult ? (
                        t.resultInitAi
                      ) : (
                        aiResult
                      )}
                    </div>
                  ) : (
                    (() => {
                      const { jsx, text } = renderTraditionalTab(isGenerating ? [] : lines, language, t.resultInitOriginal, isGenerating ? null : primaryHex, isGenerating ? null : changedHex);
                      if (text !== traditionalPdfText) setTraditionalPdfText(text);
                      return jsx;
                    })()
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
