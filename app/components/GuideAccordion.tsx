"use client";

import { useLanguage } from "../context/LanguageContext";
import { BookOpen, AlertCircle, HelpCircle } from "lucide-react";
import { getModalContent } from "../../data/modalContent";
import { useEffect, useState } from "react";

export default function GuideAccordion() {
  const { language } = useLanguage();
  const lang = language.toUpperCase() as "KO" | "EN";
  const modalContent = getModalContent(lang);

  const t = {
    KO: {
      title: "📖 시야(SYA) AI 주역 이용 가이드 & FAQ",
      item1: { summary: "주역(I Ching)이란?", title: "🌓 변화의 서막: 주역(周易)과 64괘의 형성 과정" },
      item2: { summary: "올바른 질문 작성 팁 & 활용법", title: "🔮 시작하기 전에 꼭 읽어주세요!" },
      item3: {
        summary: "자주 묻는 질문 (FAQ)",
        content: (
          <ul className="space-y-4">
            <li><strong className="text-amber-400">Q1. 서비스 이용 요금은 얼마인가요?</strong><br/>A: 현재 구글 애드센스 심사 기간 동안 전 세계 모든 이용자에게 제한 없이 '100% 무료'로 제공되고 있습니다.</li>
            <li><strong className="text-amber-400">Q2. 내가 입력한 고민이나 개인정보가 서버에 저장되나요?</strong><br/>A: 시야(SYA) AI 주역은 사용자의 개인정보와 고민 입력 내용을 서버에 별도로 저장하지 않으므로 안심하고 자유롭게 이용하실 수 있습니다.</li>
            <li><strong className="text-amber-400">Q3. 결과를 얼마나 신뢰해야 하나요?</strong><br/>A: 주역 괘상과 AI의 해석은 절대적인 미래를 예언하는 것이 아닌, 현재 상황을 새로운 시각으로 바라보게 돕는 '통찰의 도구(Decision Support Tool)'입니다. 최종 결정과 행동의 주체는 언제나 자기 자신입니다.</li>
          </ul>
        ),
      },
    },
    EN: {
      title: "📖 SYA AI I Ching User Guide & FAQ",
      item1: { summary: "What is I Ching?", title: "🌓 The Dawn of Change: The Story of the I Ching and the 64 Hexagrams" },
      item2: { summary: "Tips for Asking Questions & How to Use", title: "🔮 Essential Reading Before You Begin!" },
      item3: {
        summary: "Frequently Asked Questions (FAQ)",
        content: (
          <ul className="space-y-4">
            <li><strong className="text-amber-400">Q1. How much does the service cost?</strong><br/>A: During the current Google AdSense review period, the service is provided 100% free of charge to all users worldwide without restrictions.</li>
            <li><strong className="text-amber-400">Q2. Is my input or personal information stored on the server?</strong><br/>A: SYA AI I Ching does not store user personal information or input content on the server, so you can use it with confidence.</li>
            <li><strong className="text-amber-400">Q3. How much should I trust the results?</strong><br/>A: The I Ching hexagrams and AI interpretation are not prophecies of the absolute future, but rather a 'Decision Support Tool' to help you view your current situation from a new perspective. The subject of final decisions and actions is always yourself.</li>
          </ul>
        ),
      },
    },
  };

  const activeT = t[lang];

  const accordionItems = [
    { icon: <BookOpen className="w-5 h-5 text-amber-500" />, summary: activeT.item1.summary, content: ( <> <h3 className='font-bold text-lg mb-2 text-white'>{activeT.item1.title}</h3> {modalContent.content1} </> ) },
    { icon: <AlertCircle className="w-5 h-5 text-amber-500" />, summary: activeT.item2.summary, content: ( <> <h3 className='font-bold text-lg mb-2 text-white'>{activeT.item2.title}</h3> {modalContent.content2} </> ) },
    { icon: <HelpCircle className="w-5 h-5 text-amber-500" />, summary: activeT.item3.summary, content: activeT.item3.content },
  ];

  return (
    <section className="px-6 py-10 border-t border-white/10 mt-10">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        {activeT.title}
      </h2>
      <div className="space-y-3">
        {accordionItems.map((item, index) => (
          <details key={index} className="group bg-slate-800/50 border border-white/10 rounded-xl overflow-hidden hover:bg-slate-800 transition-colors">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-slate-100 hover:text-white">
              <div className="flex items-center gap-3">
                {item.icon}
                {item.summary}
              </div>
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <div className="p-4 pt-0 text-slate-300 text-sm leading-relaxed border-t border-white/5">
              {item.content}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
