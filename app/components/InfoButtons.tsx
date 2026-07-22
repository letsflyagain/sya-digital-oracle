"use client";

import { useState } from "react";
import { HelpCircle, AlertCircle, X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, content }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-0 md:p-4 bg-slate-700/80 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div className="bg-slate-700 w-full min-h-[50vh] md:h-auto md:max-h-[90vh] md:max-w-md md:rounded-2xl md:mt-10 overflow-hidden shadow-2xl flex flex-col border-x border-white/10" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/20 bg-slate-700/90 sticky top-0">
          <h2 className="text-lg font-bold text-white truncate mr-4">{title}</h2>
          <button onClick={onClose} className="text-white hover:text-slate-200 p-1"><X size={24} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 text-slate-200 space-y-4">
          {content}
        </div>
      </div>
    </div>
  );
};

interface InfoButtonsProps {
  currentLang: "KO" | "EN";
}

export default function InfoButtons({ currentLang }: InfoButtonsProps) {
  const [isIChingOpen, setIsIChingOpen] = useState(false);
  const [isBeforeOpen, setIsBeforeOpen] = useState(false);

  const t = {
    KO: {
      btn1: "주역이란?",
      btn2: "시작 전 꼭 읽어보세요",
      title1: "🌓 변화의 서막: 주역(周易)과 64괘의 형성 과정",

      content1: (
        <>
          <blockquote className="border-l-4 border-amber-500 pl-4 py-2 bg-slate-800 italic text-slate-200">
            "주역은 미래를 맞히는 단순한 점술서가 아닙니다. 끊임없이 요동치는 삶이라는 바다 위에서, 우리가 균형을 잡고 앞으로 나아갈 수 있도록 돕는 따뜻한 지혜의 지도입니다."
          </blockquote>
          <p>안녕하세요! 주역(周易)이라는 깊고 신비로운 세계에 오신 것을 환영합니다. 주역을 한마디로 정의하면 '변화(易)에 대한 주나라(周)의 기록'입니다. 이 넓고 깊은 동양 철학의 뿌리가 어떻게 64개의 괘로 완성되었는지, 그 재미있는 탄생 비화를 3단계로 나누어 들려드릴게요.</p>
          <h4 className="font-bold text-amber-500 mt-4">1. 온 세상의 시작, 음(陰)과 양(陽)의 탄생</h4>
          <p>주역의 출발점은 아주 단순합니다. 옛 선현들은 우주의 근본인 태극(太極)에서 두 가지 성질의 에너지가 나왔다고 보았습니다.<br/>- 하나는 어둡고, 차갑고, 부드럽게 가라앉는 음(陰, ⚋)<br/>- 다른 하나는 밝고, 따뜻하고, 강하게 뻗어 나가는 양(陽, ⚊)<br/>마치 컴퓨터가 0과 1의 이진법으로 거대한 디지털 세상을 만드는 것처럼, 동양 철학은 이 음과 양이라는 딱 두 개의 기호로 우주 만물의 모든 변화를 설명하기 시작했습니다.</p>
          <h4 className="font-bold text-amber-500 mt-4">2. 복희씨의 관찰력, 자연을 닮은 '8괘'를 빚다</h4>
          <p>먼 옛날, 전설 속의 성인 복희씨는 하늘과 땅, 새의 발자국, 거북이 등껍질 등 대자연을 유심히 관찰했습니다. 그리고 음(⚋)과 양(⚊)을 세 줄로 쌓아 올려 8개의 기본 괘(8괘)를 만들었습니다. 이 8괘는 하늘(乾), 땅(坤), 물(坎), 불(離)처럼 우리를 둘러싼 대자연의 여덟 가지 얼굴을 상징합니다.</p>
          <div className="my-4 p-4 bg-slate-800/50 rounded-lg border border-white/10 text-sm">
            <h5 className="font-bold text-amber-400 mb-2">팔괘(八卦): 만물을 구성하는 8가지 자연의 기운</h5>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <li><strong className="text-emerald-400">건(乾, ☰)</strong> : 하늘(天) - 강건함과 창조적 원동력</li>
              <li><strong className="text-emerald-400">태(兌, ☱)</strong> : 못(澤) - 기쁨과 자유로운 소통</li>
              <li><strong className="text-emerald-400">리(離, ☲)</strong> : 불(火) - 밝은 지혜와 열정적인 명료함</li>
              <li><strong className="text-emerald-400">진(震, ☳)</strong> : 천둥(雷) - 새로운 시작과 역동적인 움직임</li>
              <li><strong className="text-emerald-400">손(巽, ☴)</strong> : 바람(風) - 은은한 스며듦과 유연한 순응</li>
              <li><strong className="text-emerald-400">감(坎, ☵)</strong> : 물(水) - 깊은 지혜와 난관을 헤쳐나가는 유연함</li>
              <li><strong className="text-emerald-400">간(艮, ☶)</strong> : 산(山) - 차분한 고요와 전략적 멈춤</li>
              <li><strong className="text-emerald-400">곤(坤, ☷)</strong> : 땅(地) - 포용력과 유순한 수용성</li>
            </ul>
          </div>
          <h4 className="font-bold text-amber-500 mt-4">3. 문왕과 주공의 깊은 고뇌, 인생을 닮은 '64괘'를 완성하다</h4>
          <p>세월이 흘러 주나라를 세운 문왕은 폭군에 의해 유리라는 감옥에 갇히는 고초를 겪었습니다. 그는 좁은 감옥 안에서 인간사의 수많은 굴곡을 묵묵히 명상했습니다. '하늘과 땅만으로 우리 복잡한 인생을 다 설명할 수 있을까?' 고민하던 문왕은 8괘 위에 8괘를 한 번 더 얹었습니다. (8x8=64) 그렇게 해서 탄생한 64괘는 우리 삶에서 마주하는 64가지 거대한 변화의 흐름을 뜻하게 되었습니다. 여기에 문왕이 괘 전체의 뜻인 '괘사'를 쓰고, 그의 지혜로운 아들 주공이 한 줄 한 줄의 구체적인 움직임을 뜻하는 '효사'를 덧붙이면서 비로소 주역이 완성되었습니다.</p>
          <h4 className="font-bold text-amber-500 mt-4">4. 삼천양지(參天兩地)의 수학적 원리</h4>
          <p>디지털 오라클은 동전 3개를 던지는 전통 주역 점법을 확률 로직으로 완벽하게 구현했습니다. 하늘을 뜻하는 앞면(양)은 3점, 땅을 뜻하는 뒷면(음)은 2점으로 계산되며, 동전 3개를 던져 나오는 점수의 합계에 따라 4가지 효(爻)가 결정됩니다.<br/>
          * 3 + 3 + 3 = 9 : 노양(老陽) - 변화하는 양효<br/>
          * 3 + 3 + 2 = 8 : 소음(少陰) - 정지된 음효<br/>
          * 3 + 2 + 2 = 7 : 소양(少陽) - 정지된 양효<br/>
          * 2 + 2 + 2 = 6 : 노음(老陰) - 변화하는 음효<br/>
          이 수학적 확률에 기반하여 아래에서부터 위로 6개의 효가 정교하게 쌓여 당신의 점괘를 완성합니다.</p>
        </>
      ),
      title2: "🔮 시작하기 전에 꼭 읽어주세요!",
      content2: (
        <>
          <blockquote className="border-l-4 border-amber-500 pl-4 py-2 bg-slate-800 italic text-slate-200">
            "주역은 삶의 길을 비추는 등불이지만, 그 길을 걸어가는 주인공은 오직 당신입니다."
          </blockquote>
          <h4 className="font-bold text-green-400 mt-4 underline">💡 주역점을 100% 활용하는 팁</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="underline">하나의 질문에 집중하세요:</strong> 모호한 질문에는 모호한 답이 나옵니다. 구체적이고 명확한 하나의 질문을 미리 머릿속에 정리해 주세요.</li>
            <li><strong className="underline">깊은 호흡으로 마음을 비우세요:</strong> 점을 치기 전, 잠시 눈을 감고 깊이 숨을 쉬며 혼란스러운 생각을 가라앉혀 주세요. 고요한 마음에 진실한 괘가 찾아옵니다.</li>
            <li><strong className="underline">스스로의 직관을 믿으세요:</strong> 책이나 텍스트에 적힌 풀이는 시작일 뿐입니다. 내 삶의 맥락에 맞추어 스스로 느끼는 직관과 통찰을 더해 깊이 있게 해석해 보세요.</li>
            <li><strong className="underline">여정의 기록을 남기세요:</strong> 오늘의 질문과 괘, 그리고 훗날 깨달은 결과를 꼭 기록해 두세요. 시간이 흐를수록 당신만의 훌륭한 인생 노트가 될 것입니다.</li>
            <li><strong className="underline">꾸준히 공부하는 즐거움을 누리세요:</strong> 64괘의 기본 원리를 틈틈이 학습해 보세요.</li>
          </ul>
                      <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-950/30 mt-4">
                        <h4 className="font-bold text-red-400 underline">⚠️ 절대 잊지 말아야 할 주의사항</h4>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                          <li><strong className="underline">맹목적인 의존은 절대 금물입니다:</strong> 주역은 당신의 결정을 돕는 조언자일 뿐입니다. 인생의 모든 최종 결정과 그에 따른 책임은 온전히 자기 자신에게 있습니다.</li>
                          <li><strong className="underline">같은 질문을 반복해 묻지 마세요:</strong> 내가 원하는 답이 나오지 않았다고 해서 같은 문제로 연속해서 점을 치는 것은 주역을 모독하는 일이며, 오히려 마음의 혼란만 가중시킵니다.</li>
                          <li><strong className="underline">타인의 사생활을 훔쳐보지 마세요:</strong> 동의 없이 다른 사람의 운명이나 속마음을 함부로 점치는 것은 엄격한 윤리적 결례입니다. 타인의 프라이버시를 반드시 존중해 주세요.</li>
                          <li><strong className="underline">보고 싶은 것만 보려는 편향을 경계하세요:</strong> 아프고 쓴 조언이라 할지라도 객관적인 시각에서 귀를 기울여야 진짜 성장의 기회를 만날 수 있습니다.</li>
                          <li><strong className="underline">현실의 전문가를 먼저 만나세요:</strong> 인생의 중대한 결정(의료, 법률, 투자 등)일수록 주역에만 매달리지 말고, 반드시 해당 분야의 현실 전문가와 먼저 상담하셔야 합니다.</li>
                        </ul>
                      </div>
        </>
      ),
    },
    EN: {
      btn1: "What is I Ching?",
      btn2: "Read Before You Begin",
      title1: "🌓 The Dawn of Change: The Story of the I Ching and the 64 Hexagrams",
      content1: (
        <>
          <blockquote className="border-l-4 border-amber-500 pl-4 py-2 bg-slate-800 italic text-slate-200">
            "The I Ching is not a mere book of fortune-telling. It is a warm, guiding map of wisdom, helping us find our balance and inner peace amidst the turbulent, ever-shifting ocean of life."
          </blockquote>
          <p>Welcome to the deep, mysterious world of the I Ching. Here is the story of how this vast and deep oriental philosophy was completed into 64 hexagrams, divided into three stages.</p>
          <h4 className="font-bold text-amber-500 mt-4">1. The Cosmic Spark — The Dance of Yin and Yang</h4>
          <p>The entire philosophy begins with a surprisingly simple concept. Ancient sages believed that the primordial oneness of the universe, Taiji (the Great Ultimate), split into two fundamental, complementary energies:<br/>- Yin (陰, ⚋): Dark, cold, and yielding.<br/>- Yang (陽, ⚊): Bright, warm, and firm.<br/>Like binary code creating the digital world, Eastern philosophy uses these two symbols to explain all change in the universe.</p>
          <h4 className="font-bold text-amber-500 mt-4">2. Fu Xi’s Vision — Expressing Nature through the '8 Trigrams'</h4>
          <p>In ancient times, a legendary sage named Fu Xi looked up at the stars, down at the earth, and studied the footprints of birds and beasts. Inspired by nature, he stacked Yin and Yang lines in groups of three, creating the 8 Trigrams (Bagua) which represent the fundamental elements of nature such as Sky, Earth, Water, and Fire.</p>
          <div className="my-4 p-4 bg-slate-800/50 rounded-lg border border-white/10 text-sm">
            <h5 className="font-bold text-amber-400 mb-2">The Eight Trigrams (Bagua, 八卦): Eight Elemental Forces of Nature</h5>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <li><strong className="text-emerald-400">Qian (乾, ☰)</strong> : Heaven - Strength and Creative Force</li>
              <li><strong className="text-emerald-400">Dui (兌, ☱)</strong> : Lake - Joy and Open Communication</li>
              <li><strong className="text-emerald-400">Li (離, ☲)</strong> : Fire - Bright Wisdom and Clarity</li>
              <li><strong className="text-emerald-400">Zhen (震, ☳)</strong> : Thunder - Dynamic Movement and New Beginnings</li>
              <li><strong className="text-emerald-400">Xun (巽, ☴)</strong> : Wind - Gentle Penetration and Flexibility</li>
              <li><strong className="text-emerald-400">Kan (坎, ☵)</strong> : Water - Deep Wisdom and Adaptability through Peril</li>
              <li><strong className="text-emerald-400">Gen (艮, ☶)</strong> : Mountain - Tranquil Stillness and Strategic Halting</li>
              <li><strong className="text-emerald-400">Kun (坤, ☷)</strong> : Earth - Devotion and Receptive Nurturing</li>
            </ul>
          </div>
          <h4 className="font-bold text-amber-500 mt-4">3. King Wen’s Resilience — Mapping Human Destiny with the '64 Hexagrams'</h4>
          <p>King Wen of the Zhou Dynasty, while unjustly imprisoned, overlayed the 8 trigrams upon one another (8x8=64), creating the 64 Hexagrams. This rich matrix captures the 64 unique situations we encounter in life. King Wen wrote the poetic meanings for each hexagram (Guaci), and his brilliant son, the Duke of Zhou, wrote detailed explanations for each individual line (Yaoci).</p>
          <h4 className="font-bold text-amber-500 mt-4">4. The Mathematical Principle of "San-Chian-Liang-Di" (Three for Heaven, Two for Earth)</h4>
          <p>The Digital Oracle flawlessly replicates the traditional I Ching coin-tossing method through precise probability logic. The heads side (Yang), representing Heaven, is valued at 3 points, while the tails side (Yin), representing Earth, is valued at 2 points. The sum of the 3 coins determines one of the four types of lines (Xao):<br/>
          * 3 + 3 + 3 = 9 : Changing Yang (Old Yang)<br/>
          * 3 + 3 + 2 = 8 : Static Yin (Young Yin)<br/>
          * 3 + 2 + 2 = 7 : Static Yang (Young Yang)<br/>
          * 2 + 2 + 2 = 6 : Changing Yin (Old Yin)<br/>
          Based on this mathematical probability, six lines are sequentially built from bottom to top to reveal your final answer.</p>
        </>
      ),
      title2: "🔮 Essential Reading Before You Begin!",
      content2: (
        <>
          <blockquote className="border-l-4 border-amber-500 pl-4 py-2 bg-slate-800 italic text-slate-200">
            "The I Ching is a lantern that lights your path, but you are the only one who must walk it."
          </blockquote>
          <h4 className="font-bold text-green-400 mt-4 underline">💡 Tips for Getting the Most Out of Your Reading</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="underline">Focus on a single, clear question:</strong> Vague questions lead to vague answers.</li>
            <li><strong className="underline">Clear your mind with a deep breath:</strong> Take a deep breath to calm any mental clutter.</li>
            <li><strong className="underline">Trust your own intuition:</strong> Blend the written words with your own intuition.</li>
            <li><strong className="underline">Keep a journal of your journey:</strong> Write down your questions, hexagrams, and outcomes.</li>
            <li><strong className="underline">Embrace the joy of continuous learning:</strong> Take time to study the fundamental principles.</li>
          </ul>
          <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-950/30 mt-4">
            <h4 className="font-bold text-red-400 underline">⚠️ Important Warnings to Keep in Mind</h4>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong className="underline">Never depend blindly on the readings:</strong> The final choice—and the responsibility for your life—is always yours alone.</li>
              <li><strong className="underline">Do not repeat the same question:</strong> Asking the same question repeatedly just because you didn't get the answer you wanted will only cloud your judgment.</li>
              <li><strong className="underline">Do not pry into the lives of others:</strong> Casting a reading about someone else without their consent is an ethical violation.</li>
              <li><strong className="underline">Beware of bias:</strong> Avoid reading only what you want to see. Welcome even the difficult advice.</li>
              <li><strong className="underline">Consult real-world experts:</strong> For critical life decisions (medical, legal, financial), always seek professional advice.</li>
            </ul>
          </div>
        </>
      ),
    },
  };

  const activeT = t[currentLang];

  return (
    <div className="flex gap-2 p-2">
      <button onClick={() => setIsIChingOpen(true)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition">
        <HelpCircle size={16} className="text-amber-500" />
        <span>{activeT.btn1}</span>
      </button>
      <button onClick={() => setIsBeforeOpen(true)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition">
        <AlertCircle size={16} className="text-amber-500" />
        <span>{activeT.btn2}</span>
      </button>

      <Modal isOpen={isIChingOpen} onClose={() => setIsIChingOpen(false)} title={activeT.title1} content={activeT.content1} />
      <Modal isOpen={isBeforeOpen} onClose={() => setIsBeforeOpen(false)} title={activeT.title2} content={activeT.content2} />
    </div>
  );
}
