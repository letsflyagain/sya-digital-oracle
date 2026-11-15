"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Search, ArrowLeft } from "lucide-react";
import ichingData from "@/data/i-ching.json";
import { useLanguage } from "../context/LanguageContext";

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

export default function HexagramsPageIndex() {
  const { language, toggleLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const isKo = language === "ko";

  const hexagramList = Object.values(typedIchingData).sort(
    (a, b) => a.hexagram_number - b.hexagram_number
  );

  const filteredHexagrams = hexagramList.filter((item) => {
    const data = isKo ? item.ko : item.en;
    const query = searchQuery.toLowerCase();
    return (
      item.hexagram_number.toString().includes(query) ||
      data.name.toLowerCase().includes(query) ||
      data.chinese_name.includes(query) ||
      data.gwa_name.toLowerCase().includes(query) ||
      data.judgment.text.toLowerCase().includes(query)
    );
  });

  return (
    <div className="bg-slate-700 h-screen w-full overflow-y-auto relative z-50 text-slate-100">
      <div className="w-full max-w-md mx-auto bg-slate-700 border-x border-white/10 shadow-2xl min-h-full flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-slate-700/95 backdrop-blur-md border-b border-white/25 px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white flex items-center gap-1 text-xs font-bold"
            >
              <ArrowLeft size={16} />
              <span>{isKo ? "메인" : "Home"}</span>
            </Link>
            <h1 className="text-lg font-bold tracking-tight flex items-center gap-1.5 truncate">
              <BookOpen className="text-amber-400 shrink-0" size={20} />
              <span className="truncate">{isKo ? "주역 64괘 백과사전" : "I Ching Encyclopedia"}</span>
            </h1>
          </div>
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1 rounded-full border border-white/30 text-xs text-white hover:bg-white/10 transition-colors cursor-pointer font-bold shrink-0"
          >
            {isKo ? "EN" : "KO"}
          </button>
        </header>

        {/* Intro & Search */}
        <div className="p-4 bg-slate-800/40 border-b border-white/10 space-y-3">
          <p className="text-xs text-slate-300 leading-relaxed">
            {isKo
              ? "주역(周易) 64가지 괘상의 괘사, 단전, 상전, 효사 원문과 해설을 한눈에 확인하세요."
              : "Explore judgments, commentaries, images, and lines for all 64 hexagrams of the I Ching."}
          </p>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder={isKo ? "번호, 괘 이름, 키워드 검색..." : "Search number, name..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/90 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>
        </div>

        {/* Hexagram Cards List */}
        <main className="flex-1 p-4 space-y-3 pb-24">
          <div className="text-[11px] text-slate-400 px-1">
            {isKo ? `검색 결과: 총 ${filteredHexagrams.length}개 괘` : `${filteredHexagrams.length} hexagrams found`}
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {filteredHexagrams.map((hex) => {
              const data = isKo ? hex.ko : hex.en;
              return (
                <Link
                  key={hex.hexagram_number}
                  href={`/hexagrams/${hex.hexagram_number}`}
                  className="group p-3.5 bg-slate-800/60 hover:bg-slate-800 border border-white/10 hover:border-amber-400/50 rounded-xl transition-all flex flex-col justify-between space-y-2 shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs shrink-0">
                        {hex.hexagram_number}
                      </span>
                      <div>
                        <h3 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
                          {data.name} <span className="text-[11px] text-slate-400 font-normal">({data.chinese_name})</span>
                        </h3>
                        <p className="text-[11px] text-slate-400">{data.gwa_name}</p>
                      </div>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 bg-white/5 rounded text-slate-300 font-mono">
                      {hex.binary_code}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {data.judgment.text}
                  </p>

                  <div className="flex justify-end items-center text-[11px] text-amber-400 font-semibold">
                    <span>{isKo ? "상세 해설 보기 →" : "View Details →"}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </main>

        {/* Footer */}
        <footer className="p-4 border-t border-white/10 bg-slate-800/30 text-slate-400 text-xs space-y-3 pb-24">
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="hover:text-emerald-400 transition-colors">
              {isKo ? "메인 오라클" : "Main Oracle"}
            </Link>
            <span>|</span>
            <Link href="/privacy" className="hover:text-emerald-400 transition-colors">
              {isKo ? "개인정보처리방침" : "Privacy Policy"}
            </Link>
            <span>|</span>
            <Link href="/terms" className="hover:text-emerald-400 transition-colors">
              {isKo ? "이용약관" : "Terms of Service"}
            </Link>
          </div>
          <p className="text-[11px]">© 2026 SYA AI I-Ching. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
