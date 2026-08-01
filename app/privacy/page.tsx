"use client";

import { useLanguage } from "../context/LanguageContext";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PrivacyPolicy() {
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
            {language === "ko" ? "개인정보처리방침" : "Privacy Policy"}
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
              <h1 className="text-2xl font-bold text-emerald-400">개인정보처리방침 (Privacy Policy)</h1>
              <p>시야(SYA) AI 주역(이하 '서비스')은 이용자의 개인정보를 중요시하며, "개인정보 보호법" 및 관련 법령을 준수하고 있습니다. 본 개인정보처리방침은 서비스가 이용자의 정보를 어떻게 수집, 이용, 보호하는지 알려드립니다.</p>
              
              <h2 className="text-xl font-semibold text-white">1. 수집하는 개인정보 항목 및 방법</h2>
              <p>본 서비스는 별도의 회원가입 없이 이용할 수 있는 무료 서비스입니다.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>서비스 이용 과정에서 사용자가 입력하는 고민 및 질문 내용은 서버에 저장되지 않으며, 점사 생성 후 즉시 파기됩니다.</li>
                <li>서비스 이용 과정에서 IP 주소, 쿠키(Cookie), 방문 일시, 서비스 이용 기록 등의 로그 정보가 자동 생성되어 수집될 수 있습니다.</li>
              </ul>

              <h2 className="text-xl font-semibold text-white">2. 개인정보의 수집 및 이용 목적</h2>
              <p>수집된 최소한의 정보는 다음의 목적을 위해 활용됩니다.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>서비스 제공 및 안정적인 시스템 운영</li>
                <li>접속 빈도 파악 및 서비스 이용에 대한 통계 분석</li>
                <li>구글 애드센스(Google AdSense) 등 타사 광고 네트워크를 통한 맞춤형 광고 제공</li>
              </ul>

              <h2 className="text-xl font-semibold text-white">3. 쿠키(Cookie)의 운용 및 거부</h2>
              <p>본 서비스는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>쿠키의 정의:</strong> 쿠키는 웹사이트를 운영하는데 이용되는 서버가 이용자의 브라우저에 보내는 아주 작은 텍스트 파일로서 이용자의 컴퓨터에 저장됩니다.</li>
                <li><strong>구글 애드센스 쿠키 사용 고지:</strong>
                  <ul className="list-circle pl-5 mt-1 space-y-1">
                    <li>구글을 포함한 타사 파트너사는 쿠키를 사용하여 이용자의 이전 방문 기록을 바탕으로 맞춤형 광고를 제공합니다.</li>
                    <li>구글의 광고 쿠키 사용으로 구글 및 파트너사는 이용자의 본 사이트 또는 다른 사이트 방문을 기반으로 적절한 광고를 게재할 수 있습니다.</li>
                  </ul>
                </li>
                <li><strong>쿠키 설정 거부 방법:</strong> 이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 웹 브라우저 옵션 설정을 통해 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 모든 쿠키의 저장을 거부할 수 있습니다.
                  <br/>(Chrome 예시: 설정 &gt; 개인정보 및 보안 &gt; 제3자 쿠키 차단)</li>
              </ul>

              <h2 className="text-xl font-semibold text-white">4. 개인정보의 제3자 제공</h2>
              <p>서비스는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 단, 법령의 규정에 의거하거나 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우는 예외로 합니다.</p>

              <h2 className="text-xl font-semibold text-white">5. 개인정보보호 문의 및 담당자</h2>
              <p>서비스 이용 중 발생하는 개인정보 보호 관련 문의사항은 아래 연락처로 문의해 주시기 바랍니다.</p>
              <ul className="list-none space-y-1">
                <li>- 서비스명: 시야(SYA) AI 주역</li>
                <li>- 이메일 문의: letsflyagain@gmail.com</li>
              </ul>
              <p className="text-sm text-slate-400 pt-2">공고일자: 2026년 8월 1일<br/>시행일자: 2026년 8월 1일</p>
            </div>
          ) : (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-emerald-400">Privacy Policy</h1>
              <p>SYA AI I-Ching ("we," "our," or "us") values your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website (https://syai-ching.com).</p>
              
              <h2 className="text-xl font-semibold text-white">1. Information We Collect</h2>
              <p>SYA Digital Oracle is a free-to-use service that does not require user registration.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>User Inputs:</strong> The questions and concerns you enter for the I Ching reading are NOT saved or stored on our servers. They are processed in real-time and immediately discarded.</li>
                <li><strong>Automatically Collected Data:</strong> Like most websites, we may automatically collect log data, including your IP address, browser type, operating system, access times, and pages viewed, to maintain service security and analyze usage trends.</li>
              </ul>

              <h2 className="text-xl font-semibold text-white">2. Use of Cookies and Third-Party Advertising (Google AdSense)</h2>
              <p>We use cookies to enhance your user experience and deliver relevant advertisements.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Cookies Overview:</strong> Cookies are small text files placed on your device by a web server to store your preferences and site activity.</li>
                <li><strong>Third-Party Advertising:</strong>
                  <ul className="list-circle pl-5 mt-1 space-y-1">
                    <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to our website or other websites.</li>
                    <li>Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to our sites and/or other sites on the Internet.</li>
                  </ul>
                </li>
                <li><strong>Opting Out of Cookies:</strong> Users may opt out of personalized advertising by visiting Google Ads Settings (https://adssettings.google.com). Alternatively, you can disable third-party cookies directly through your web browser settings.</li>
              </ul>

              <h2 className="text-xl font-semibold text-white">3. Data Sharing and Disclosure</h2>
              <p>We do not sell, trade, or otherwise transfer your personal information to outside parties, except as required by law or to comply with valid legal processes.</p>

              <h2 className="text-xl font-semibold text-white">4. Contact Us</h2>
              <p>If you have any questions or concerns regarding this Privacy Policy, please contact us at:</p>
              <ul className="list-none space-y-1">
                <li>- Service Name: SYA AI I-Ching</li>
                <li>- Email: letsflyagain@gmail.com</li>
              </ul>
              <p className="text-sm text-slate-400 pt-2">Effective Date: August 1, 2026</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}