import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft, Sparkles, Compass } from "lucide-react";
import ichingData from "@/data/i-ching.json";

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

export async function generateStaticParams() {
  return Array.from({ length: 64 }, (_, i) => ({
    id: (i + 1).toString(),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const hex = typedIchingData[resolvedParams.id];
  if (!hex) {
    return {
      title: "주역 64괘 상세 해설 | SYA Digital Oracle",
    };
  }

  const title = `${hex.ko.name} (${hex.ko.chinese_name}) - 주역 제${hex.hexagram_number}괘 백과사전`;
  const description = `${hex.ko.judgment.text} | 주역 64괘 중 제${hex.hexagram_number}괘 ${hex.ko.name}(${hex.ko.gwa_name})의 괘사, 단전, 상전, 효사 원문 및 상세 해설.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
  };
}

export default async function HexagramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const hex = typedIchingData[resolvedParams.id];

  if (!hex) {
    return (
      <div className="bg-slate-700 h-screen w-full overflow-y-auto text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-lg font-bold mb-4">해당 괘를 찾을 수 없습니다.</h1>
        <Link href="/hexagrams" className="px-4 py-2 bg-amber-500 rounded-lg text-slate-900 font-bold text-sm">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const ko = hex.ko;
  const en = hex.en;
  const lineKeys = Object.keys(ko.lines).sort((a, b) => Number(a) - Number(b));

  return (
    <div className="bg-slate-700 h-screen w-full overflow-y-auto relative z-50 text-slate-100">
      <div className="w-full max-w-md mx-auto bg-slate-700 border-x border-white/10 shadow-2xl min-h-full flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-slate-700/95 backdrop-blur-md border-b border-white/25 px-4 py-4 flex items-center justify-between">
          <Link
            href="/hexagrams"
            className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft size={16} />
            <span>백과사전 목록</span>
          </Link>
          <Link
            href="/"
            className="px-3 py-2 rounded-lg bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 text-xs font-bold hover:bg-emerald-500/35 transition-colors flex items-center gap-1.5"
          >
            <Sparkles size={14} />
            <span>AI 맞춤 풀이</span>
          </Link>
        </header>

        {/* Main Article Content */}
        <main className="flex-1 p-5 space-y-6 pb-24">
          {/* Title & Badge */}
          <div className="space-y-2 border-b border-white/10 pb-5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs">
                제 {hex.hexagram_number} 괘
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono text-[11px]">
                코드: {hex.binary_code}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              {ko.name} <span className="text-xl text-amber-400 font-normal">({ko.chinese_name})</span>
            </h1>
            <p className="text-sm text-slate-300 font-medium">
              대표 괘명: {ko.gwa_name}
            </p>
            <p className="text-xs text-slate-400 italic pt-1">
              English: <strong className="text-slate-200">{en.name}</strong> ({en.gwa_name}) - {en.chinese_name}
            </p>
          </div>

          {/* Judgment (괘사) */}
          <section className="space-y-3 bg-white/5 border border-white/10 rounded-xl p-4 shadow-inner">
            <h2 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <Compass size={16} />
              <span>괘사 (Judgment / 卦辭)</span>
            </h2>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-white leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5">
                {ko.judgment.text}
              </p>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {ko.judgment.comments}
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5">
              <p className="text-[11px] text-amber-300/80 font-bold uppercase tracking-wider">English Judgment</p>
              <p className="text-xs italic text-slate-300">{en.judgment.text}</p>
              <p className="text-[11px] text-slate-400">{en.judgment.comments}</p>
            </div>
          </section>

          {/* Tanjun (단전) */}
          <section className="space-y-2.5 bg-slate-800/50 border border-white/10 rounded-xl p-4">
            <h2 className="text-xs font-bold text-emerald-400">단전 (Tanjun / 彖傳 - 단사 해설)</h2>
            <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
              {ko.tanjun}
            </p>
            <div className="mt-2.5 pt-2.5 border-t border-white/5">
              <p className="text-[11px] text-slate-400 italic leading-relaxed">{en.tanjun}</p>
            </div>
          </section>

          {/* Sangjun (상전) */}
          <section className="space-y-2.5 bg-slate-800/50 border border-white/10 rounded-xl p-4">
            <h2 className="text-xs font-bold text-emerald-400">상전 (Sangjun / 象傳 - 상경 해설)</h2>
            <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
              {ko.sangjun}
            </p>
            <div className="mt-2.5 pt-2.5 border-t border-white/5">
              <p className="text-[11px] text-slate-400 italic leading-relaxed">{en.sangjun}</p>
            </div>
          </section>

          {/* Lines (효사) */}
          <section className="space-y-3 bg-white/5 border border-white/10 rounded-xl p-4">
            <h2 className="text-xs font-bold text-amber-400">효사 (Lines / 爻辭)</h2>
            <div className="space-y-4">
              {lineKeys.map((key) => {
                const lineKo = ko.lines[key];
                const lineEn = en.lines[key];
                return (
                  <div key={key} className="space-y-1.5 border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[11px]">
                        {key}효 (Line {key})
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-100 leading-relaxed">
                      {lineKo.text}
                    </p>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {lineKo.comments}
                    </p>
                    {lineEn && (
                      <div className="text-[11px] text-slate-400 italic pt-0.5 space-y-0.5">
                        <p>{lineEn.text}</p>
                        <p className="text-slate-500">{lineEn.comments}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Bottom CTA to AI Oracle */}
          <div className="p-6 bg-gradient-to-r from-emerald-900/40 via-slate-800 to-amber-900/40 border border-emerald-500/30 rounded-xl text-center space-y-3 shadow-xl my-6">
            <h3 className="text-base font-bold text-white">
              내 고민을 바탕으로 이 괘의 AI 맞춤 풀이 받아보기
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              지금 당신의 고민을 입력하시면, 전통 주역 알고리즘과 최신 AI가 결합하여 명쾌한 해답을 제시해 드립니다.
            </p>
            <div>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-bold text-xs rounded-xl transition-all shadow-[0_0_20px_rgba(52,211,153,0.3)]"
              >
                <Sparkles size={16} />
                <span>AI 주역 점괘 보러 가기</span>
              </Link>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-4 border-t border-white/10 bg-slate-800/30 text-slate-400 text-xs space-y-3 pb-24">
          <div className="flex flex-wrap gap-3">
            <Link href="/hexagrams" className="hover:text-emerald-400 transition-colors">
              📚 주역 64괘 백과사전
            </Link>
            <span>|</span>
            <Link href="/" className="hover:text-emerald-400 transition-colors">
              메인 오라클
            </Link>
            <span>|</span>
            <Link href="/privacy" className="hover:text-emerald-400 transition-colors">
              개인정보처리방침
            </Link>
          </div>
          <p className="text-[11px]">© 2026 SYA AI I-Ching. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
