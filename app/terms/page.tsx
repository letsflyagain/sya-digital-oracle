"use client";

import { useLanguage } from "../context/LanguageContext";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TermsOfService() {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-slate-700 h-screen w-full overflow-y-auto relative z-50">
      <div className="w-full max-w-md mx-auto bg-slate-700 border-x border-white/10 shadow-2xl min-h-full">
        
        {/* Header with Close button */}
        <div className="sticky top-0 z-50 bg-slate-700/95 backdrop-blur-md border-b border-white/20 px-6 py-4 flex items-center justify-between">
          <h2 className="text-white text-xl font-bold">
            {language === "ko" ? "이용약관" : "Terms of Service"}
          </h2>
          <button
            onClick={() => router.push("/")}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Main */}
        <main className="p-6 space-y-6 text-slate-100 pb-20">
          {language === "ko" ? (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-emerald-400">이용약관 (Terms of Service)</h1>
              
              <h2 className="text-xl font-semibold text-white">제1조 (목적)</h2>
              <p>본 약관은 시야(SYA) AI 주역(이하 '서비스')이 제공하는 AI 기반 디지털 척전 주역 오라클 서비스의 이용 조건 및 절차, 이용자와 서비스 간의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.</p>

              <h2 className="text-xl font-semibold text-white">제2조 (용어의 정의)</h2>
              <ul className="list-decimal pl-5 space-y-2">
                <li>'서비스'란 이용자가 입력한 질문과 동전 척전 알고리즘을 바탕으로 주역 괘상을 산출하고 AI 해석을 제공하는 웹 기반 오라클 플랫폼을 의미합니다.</li>
                <li>'이용자'란 본 사이트에 접속하여 본 약관에 따라 서비스를 이용하는 모든 방문자를 의미합니다.</li>
              </ul>

              <h2 className="text-xl font-semibold text-white">제3조 (약관의 효력 및 변경)</h2>
              <ul className="list-decimal pl-5 space-y-2">
                <li>본 약관은 서비스 화면에 게시함으로써 효력이 발생합니다.</li>
                <li>서비스는 필요한 경우 관련 법령을 위배하지 않는 범위 내에서 본 약관을 개정할 수 있으며, 변경된 약관은 사이트에 공지함으로써 효력이 발생합니다.</li>
              </ul>

              <h2 className="text-xl font-semibold text-white">제4조 (서비스의 제공 및 변경)</h2>
              <ul className="list-decimal pl-5 space-y-2">
                <li>서비스는 회원가입 없이 전 세계 모든 이용자에게 무료로 제공됩니다.</li>
                <li>서비스는 24시간 제공을 원칙으로 하나, 시스템 점검, 교체, 고장 또는 운영상 필요에 따라 일시적으로 중단될 수 있습니다.</li>
                <li>서비스의 내용, UI, AI 알고리즘 및 해석 방식은 서비스 향상을 위해 사전 통지 없이 변경될 수 있습니다.</li>
              </ul>

              <h2 className="text-xl font-semibold text-white">제5조 (면책 조항 및 책임의 한계)</h2>
              <ul className="list-decimal pl-5 space-y-2">
                <li>본 서비스가 제공하는 주역 괘상 및 AI 기반 해석 결과는 개인의 의사결정을 돕기 위한 참고용 및 엔터테인먼트적 성격의 통찰 도구(Decision Support Tool)일 뿐이며, 절대적인 미래 예언이나 전문적인 법률·의료·금융 자문을 대체할 수 없습니다.</li>
                <li>이용자가 본 서비스의 해석 결과를 바탕으로 행한 모든 결정, 행동 및 그로 인해 발생한 결과에 대한 최종 책임은 이용자 본인에게 있으며, 서비스는 이에 대해 어떠한 법적 책임도 지지 않습니다.</li>
                <li>서비스는 천재지변, AI 모델의 생성 지연, 제3자 서버 장애 등 불가항력으로 인하여 서비스를 제공할 수 없는 경우 책임이 면제됩니다.</li>
              </ul>

              <h2 className="text-xl font-semibold text-white">제6조 (이용자의 의무 및 금지행위)</h2>
              <p>이용자는 다음 각 호의 행위를 하여서는 안 됩니다.</p>
              <ul className="list-decimal pl-5 space-y-2">
                <li>서비스의 안정적 운영을 방해하는 자동화 프로그램(봇, 크롤러 등)의 무단 사용</li>
                <li>서비스의 시스템 및 서버에 과도한 부하를 일으키는 행위</li>
                <li>법령 및 공공질서, 미풍양속에 반하는 내용을 서비스 입력창에 입력하는 행위</li>
              </ul>

              <h2 className="text-xl font-semibold text-white">제7조 (지적재산권의 귀속)</h2>
              <ul className="list-decimal pl-5 space-y-2">
                <li>서비스가 자체 제작한 디자인, 상표, 코드, 알고리즘 체계 등에 대한 지적재산권은 서비스에 귀속됩니다.</li>
                <li>이용자는 서비스를 이용함으로써 얻은 정보를 서비스의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.</li>
              </ul>

              <h2 className="text-xl font-semibold text-white">제8조 (광고의 게재)</h2>
              <p>서비스는 운영과 관련된 광고(구글 애드센스 등)를 서비스 화면에 게재할 수 있으며, 이용자는 서비스 이용 시 노출되는 광고 게재에 동의하는 것으로 간주합니다.</p>

              <h2 className="text-xl font-semibold text-white">부칙</h2>
              <p>본 약관은 2026년 8월 1일부터 시행됩니다.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-emerald-400">Terms of Service</h1>
              
              <h2 className="text-xl font-semibold text-white">Article 1 (Purpose)</h2>
              <p>These Terms of Service ("Terms") govern the access and use of the AI-powered digital I Ching oracle platform provided by SYA AI I-Ching ("Service"). By accessing or using the Service, you agree to be bound by these Terms.</p>

              <h2 className="text-xl font-semibold text-white">Article 2 (Definitions)</h2>
              <ul className="list-decimal pl-5 space-y-2">
                <li>"Service" refers to the web-based platform that generates I Ching hexagrams through a digital coin-toss algorithm and provides AI-generated interpretations based on user inputs.</li>
                <li>"User" refers to any visitor who accesses the website and uses the Service under these Terms.</li>
              </ul>

              <h2 className="text-xl font-semibold text-white">Article 3 (Service Provision and Modifications)</h2>
              <ul className="list-decimal pl-5 space-y-2">
                <li>The Service is provided free of charge without requiring account registration.</li>
                <li>The Service operates 24/7 in principle, but may be temporarily suspended for maintenance, server upgrades, or technical issues.</li>
                <li>The Service features, UI, and AI interpretation models may be modified or updated at any time without prior notice to improve service quality.</li>
              </ul>

              <h2 className="text-xl font-semibold text-white">Article 4 (Disclaimer and Limitation of Liability)</h2>
              <ul className="list-decimal pl-5 space-y-2">
                <li>The I Ching hexagrams and AI-generated interpretations provided by this Service are intended solely for personal reflection, insight, and entertainment purposes. They DO NOT constitute professional legal, medical, financial, or psychological advice, nor do they guarantee future predictions.</li>
                <li>The User assumes full responsibility for any choices, decisions, or actions taken based on the information provided by the Service. The Service expressly disclaims any legal liability for outcomes resulting from the use of this Service.</li>
                <li>The Service shall not be liable for any service interruptions caused by force majeure, third-party infrastructure failures, or latency in AI response generation.</li>
              </ul>

              <h2 className="text-xl font-semibold text-white">Article 5 (User Obligations and Restrictions)</h2>
              <p>Users shall not engage in any of the following activities:</p>
              <ul className="list-decimal pl-5 space-y-2">
                <li>Using unauthorized automated software, bots, or crawlers that interfere with the normal operation of the Service.</li>
                <li>Imposing an unreasonable or disproportionately large load on the Service's servers or network infrastructure.</li>
                <li>Submitting illegal, harmful, offensive, or malicious content into the input fields.</li>
              </ul>

              <h2 className="text-xl font-semibold text-white">Article 6 (Intellectual Property)</h2>
              <p>All intellectual property rights related to the Service's design, branding, code, algorithm structure, and custom elements belong exclusively to SYA Digital Oracle. Users may not copy, reproduce, distribute, or create derivative works for commercial purposes without prior written consent.</p>

              <h2 className="text-xl font-semibold text-white">Article 7 (Third-Party Advertisements)</h2>
              <p>The Service may display third-party advertisements (such as Google AdSense). By using the Service, Users agree to the display of such advertisements.</p>

              <h2 className="text-xl font-semibold text-white">Supplementary Provisions</h2>
              <p>These Terms are effective as of August 1, 2026.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
