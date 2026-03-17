'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import CardNewsStatusBadge from '@/components/card-news/CardNewsStatusBadge';

interface Template {
  type: string;
  name: string;
  description: string;
  slideCount: number;
  roles: string[];
}

interface CardSlide {
  id: string;
  slideOrder: number;
  role: string;
  headline: string;
  bodyText: string | null;
  keyPoints: string[];
  imageUrl: string | null;
  bgColor: string | null;
}

interface CardNews {
  id: string;
  title: string;
  status: string;
  slideCount: number;
  slides: CardSlide[];
}

const ROLE_ICONS: Record<string, string> = {
  HOOK: '🎯', PROBLEM: '❓', SOLUTION: '💡',
  FEATURE: '⚙', PROOF: '📊', CTA: '📢', INFO: 'ℹ',
};

const ROLE_LABELS: Record<string, string> = {
  HOOK: 'Hook', PROBLEM: 'Problem', SOLUTION: 'Solution',
  FEATURE: 'Feature', PROOF: 'Proof', CTA: 'CTA', INFO: 'Info',
};

export default function CardNewsCreatePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1 state
  const [templates, setTemplates] = useState<Template[]>([]);
  const [topic, setTopic] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('SERVICE_INTRO');
  const [brandColor, setBrandColor] = useState('#00A1E0');
  const [subColor, setSubColor] = useState('#16325C');
  const [logoUrl, setLogoUrl] = useState('');
  const [showBrandSettings, setShowBrandSettings] = useState(false);

  // Step 2-3 state
  const [cardNews, setCardNews] = useState<CardNews | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [editSlides, setEditSlides] = useState<CardSlide[]>([]);

  // Step 3 state
  const [renderResult, setRenderResult] = useState<{ slideOrder: number; imageUrl: string }[] | null>(null);
  const [renderTime, setRenderTime] = useState(0);

  useEffect(() => {
    fetch('/api/card-news/templates')
      .then(r => r.json())
      .then(setTemplates)
      .catch(() => {});
  }, []);

  // Step 1 → AI 콘텐츠 생성
  const handleGenerateContent = async () => {
    if (!topic.trim()) { setError('주제를 입력하세요.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/card-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          templateType: selectedTemplate,
          brandColor,
          subColor,
          logoUrl: logoUrl || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? '생성에 실패했습니다.');
      }
      const data: CardNews = await res.json();
      setCardNews(data);
      setEditSlides(data.slides);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : '생성 실패');
    } finally {
      setLoading(false);
    }
  };

  // Step 2 → 슬라이드 수정 저장
  const handleSaveEdits = async () => {
    if (!cardNews) return;
    setLoading(true);
    try {
      await fetch(`/api/card-news/${cardNews.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slides: editSlides.map(s => ({
            id: s.id,
            headline: s.headline,
            bodyText: s.bodyText,
            keyPoints: s.keyPoints,
            bgColor: s.bgColor,
          })),
        }),
      });
    } catch { /* 편집 저장 실패는 무시 */ }
    setLoading(false);
  };

  // Step 2 → 이미지 렌더링
  const handleRender = async () => {
    if (!cardNews) return;
    await handleSaveEdits();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/card-news/${cardNews.id}/render`, { method: 'POST' });
      if (!res.ok) throw new Error('렌더링에 실패했습니다.');
      const data = await res.json();
      setRenderResult(data.slides);
      setRenderTime(data.renderTime);
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : '렌더링 실패');
    } finally {
      setLoading(false);
    }
  };

  // 슬라이드 편집 핸들러
  const updateSlide = (index: number, field: string, value: string | string[]) => {
    setEditSlides(prev => prev.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    ));
  };

  const steps = [
    { num: 1, label: '주제 & 템플릿' },
    { num: 2, label: '편집' },
    { num: 3, label: '렌더링 & 발행' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3 max-w-7xl mx-auto">
          <button onClick={() => router.push('/admin/card-news')} className="text-gray-500 hover:text-gray-700 text-sm">
            ← 목록
          </button>
          <h1 className="text-xl font-bold text-gray-900">카드뉴스 만들기</h1>
          {cardNews && <CardNewsStatusBadge status={cardNews.status} />}
        </div>
      </div>

      {/* Stepper */}
      <div className="max-w-3xl mx-auto px-6 py-6">
        <div className="flex items-center gap-0 mb-8">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= s.num ? 'text-white' : 'bg-gray-200 text-gray-500'
              }`}
                style={step >= s.num ? { background: '#00A1E0' } : {}}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span className={`ml-2 text-xs font-semibold ${step >= s.num ? 'text-gray-900' : 'text-gray-400'}`}>
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 ${step > s.num ? 'bg-[#00A1E0]' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ── Step 1: 주제 & 템플릿 ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="space-y-6">
                {/* 주제 입력 */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">주제</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder="예: CertiGraph AI 학습 플래너로 자격증 한 번에 합격"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00A1E0] focus:ring-1 focus:ring-[#00A1E0]"
                  />
                </div>

                {/* 템플릿 선택 */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">템플릿</label>
                  <div className="grid grid-cols-3 gap-3">
                    {templates.map(t => (
                      <button
                        key={t.type}
                        onClick={() => setSelectedTemplate(t.type)}
                        className={`p-4 rounded-lg border-2 text-left transition-colors ${
                          selectedTemplate === t.type
                            ? 'border-[#00A1E0] bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{t.slideCount}슬라이드</div>
                        <div className="text-xs text-gray-400 mt-1 line-clamp-2">{t.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 브랜드 설정 (접을 수 있음) */}
                <div>
                  <button
                    onClick={() => setShowBrandSettings(!showBrandSettings)}
                    className="text-xs font-semibold text-gray-600 hover:text-gray-800 flex items-center gap-1"
                  >
                    {showBrandSettings ? '▼' : '▶'} 브랜드 설정
                  </button>
                  {showBrandSettings && (
                    <div className="mt-3 grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">메인 컬러</label>
                        <div className="flex items-center gap-2">
                          <input type="color" value={brandColor} onChange={e => setBrandColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                          <input
                            type="text"
                            value={brandColor}
                            onChange={e => setBrandColor(e.target.value)}
                            className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#00A1E0] focus:ring-1 focus:ring-[#00A1E0]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">보조 컬러</label>
                        <div className="flex items-center gap-2">
                          <input type="color" value={subColor} onChange={e => setSubColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                          <input
                            type="text"
                            value={subColor}
                            onChange={e => setSubColor(e.target.value)}
                            className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#00A1E0] focus:ring-1 focus:ring-[#00A1E0]"
                          />
                        </div>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">로고 URL (선택)</label>
                        <input
                          type="text"
                          value={logoUrl}
                          onChange={e => setLogoUrl(e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00A1E0] focus:ring-1 focus:ring-[#00A1E0]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleGenerateContent}
                    disabled={loading}
                    className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
                    style={{ background: '#00A1E0' }}
                  >
                    {loading ? 'AI 콘텐츠 생성 중...' : 'AI로 콘텐츠 생성 →'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: 슬라이드 편집 ── */}
          {step === 2 && editSlides.length > 0 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="flex gap-4" style={{ minHeight: '600px' }}>
                {/* 좌: 슬라이드 목록 */}
                <div className="w-48 space-y-2 flex-shrink-0">
                  {editSlides.map((slide, i) => (
                    <button
                      key={slide.id}
                      onClick={() => setActiveSlide(i)}
                      className={`w-full p-3 rounded-lg text-left text-xs transition-colors ${
                        activeSlide === i
                          ? 'border-2 border-[#00A1E0] bg-blue-50'
                          : 'border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{ROLE_ICONS[slide.role] ?? '📄'}</span>
                        <span className="font-semibold text-gray-900">{slide.slideOrder}.</span>
                        <span className="text-gray-500">{ROLE_LABELS[slide.role] ?? slide.role}</span>
                      </div>
                      <div className="mt-1 text-gray-600 truncate">{slide.headline}</div>
                    </button>
                  ))}
                </div>

                {/* 중앙: 미리보기 */}
                <div className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full max-w-sm aspect-square rounded-lg flex flex-col justify-center items-center p-8 text-center"
                    style={{
                      background: editSlides[activeSlide]?.bgColor
                        ?? (['HOOK', 'CTA'].includes(editSlides[activeSlide]?.role) ? brandColor : '#F8F9FA'),
                      color: ['HOOK', 'CTA', 'SOLUTION'].includes(editSlides[activeSlide]?.role) ? 'white' : '#1A1A2E',
                    }}
                  >
                    <div className="text-xs opacity-60 mb-4">{editSlides[activeSlide]?.role}</div>
                    <div className="text-2xl font-bold mb-4">{editSlides[activeSlide]?.headline}</div>
                    {editSlides[activeSlide]?.bodyText && (
                      <div className="text-sm opacity-80 mb-4">{editSlides[activeSlide]?.bodyText}</div>
                    )}
                    {editSlides[activeSlide]?.keyPoints?.length > 0 && (
                      <div className="space-y-2 text-sm">
                        {editSlides[activeSlide].keyPoints.map((kp, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ background: 'currentColor', opacity: 0.4 }} />
                            {kp}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mt-3 text-xs text-gray-400">
                    {activeSlide + 1} / {editSlides.length}
                  </div>
                </div>

                {/* 우: 속성 편집 */}
                <div className="w-72 space-y-4 flex-shrink-0">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">제목</label>
                    <input
                      type="text"
                      value={editSlides[activeSlide]?.headline ?? ''}
                      onChange={e => updateSlide(activeSlide, 'headline', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#00A1E0] focus:ring-1 focus:ring-[#00A1E0]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">본문</label>
                    <textarea
                      value={editSlides[activeSlide]?.bodyText ?? ''}
                      onChange={e => updateSlide(activeSlide, 'bodyText', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00A1E0] focus:ring-1 focus:ring-[#00A1E0]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">키포인트</label>
                    {editSlides[activeSlide]?.keyPoints?.map((kp, i) => (
                      <input
                        key={i}
                        type="text"
                        value={kp}
                        onChange={e => {
                          const newKp = [...(editSlides[activeSlide]?.keyPoints ?? [])];
                          newKp[i] = e.target.value;
                          updateSlide(activeSlide, 'keyPoints', newKp);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 mb-2 focus:outline-none focus:border-[#00A1E0] focus:ring-1 focus:ring-[#00A1E0]"
                      />
                    ))}
                    {(editSlides[activeSlide]?.keyPoints?.length ?? 0) < 3 && (
                      <button
                        onClick={() => updateSlide(activeSlide, 'keyPoints', [...(editSlides[activeSlide]?.keyPoints ?? []), ''])}
                        className="text-xs text-[#00A1E0] font-semibold"
                      >
                        + 키포인트 추가
                      </button>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">배경색 (오버라이드)</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={editSlides[activeSlide]?.bgColor ?? brandColor} onChange={e => updateSlide(activeSlide, 'bgColor', e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                      <input
                        type="text"
                        value={editSlides[activeSlide]?.bgColor ?? ''}
                        onChange={e => updateSlide(activeSlide, 'bgColor', e.target.value)}
                        placeholder="기본 사용"
                        className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00A1E0] focus:ring-1 focus:ring-[#00A1E0]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button onClick={() => setStep(1)} className="px-4 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50">
                  ← 뒤로
                </button>
                <button
                  onClick={handleRender}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
                  style={{ background: '#00A1E0' }}
                >
                  {loading ? '이미지 생성 중...' : '이미지 생성 →'}
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: 렌더링 결과 & 발행 ── */}
          {step === 3 && renderResult && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="space-y-6">
                {/* 렌더링 결과 */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900">렌더링 결과</h3>
                    <span className="text-xs text-gray-500">렌더링 시간: {(renderTime / 1000).toFixed(1)}초</span>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {renderResult.map(r => (
                      <div key={r.slideOrder} className="flex-shrink-0">
                        <div
                          className="w-32 h-32 rounded-lg border border-gray-200 bg-cover bg-center"
                          style={{ backgroundImage: `url(${r.imageUrl})` }}
                        />
                        <div className="text-xs text-gray-400 text-center mt-1">슬라이드 {r.slideOrder}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 완료 안내 */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-sm font-semibold text-green-700 mb-1">이미지 생성 완료</div>
                  <div className="text-xs text-green-600">
                    카드뉴스 상세 페이지에서 SNS 발행, 이미지 다운로드, 성과 확인이 가능합니다.
                  </div>
                </div>

                <div className="flex justify-between">
                  <button onClick={() => setStep(2)} className="px-4 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50">
                    ← 편집으로
                  </button>
                  <button
                    onClick={() => router.push(`/admin/card-news/${cardNews?.id}`)}
                    className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white"
                    style={{ background: '#00A1E0' }}
                  >
                    상세 페이지로 이동 →
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
