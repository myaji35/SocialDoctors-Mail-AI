'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import CardNewsStatusBadge from '@/components/card-news/CardNewsStatusBadge';

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

interface SnsChannel {
  id: string;
  channelName: string;
  clientName: string;
  platform: string;
}

interface CardNewsDetail {
  id: string;
  title: string;
  topic: string;
  templateType: string;
  status: string;
  slideCount: number;
  brandColor: string | null;
  subColor: string | null;
  logoUrl: string | null;
  channelId: string | null;
  postId: string | null;
  callerApp: string | null;
  createdAt: string;
  publishedAt: string | null;
  slides: CardSlide[];
  channel: SnsChannel | null;
}

interface InsightsData {
  reach: number;
  impressions: number;
  likes: number;
  shares: number;
  comments: number;
  clicks: number;
  engagement_rate: number;
  fetched_at: string;
}

const TEMPLATE_LABELS: Record<string, string> = {
  SERVICE_INTRO: '서비스 소개', EDUCATION: '교육 콘텐츠', EVENT: '이벤트', CUSTOM: '커스텀',
};

const ROLE_LABELS: Record<string, string> = {
  HOOK: 'Hook', PROBLEM: 'Problem', SOLUTION: 'Solution',
  FEATURE: 'Feature', PROOF: 'Proof', CTA: 'CTA', INFO: 'Info',
};

export default function CardNewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [cardNews, setCardNews] = useState<CardNewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [rendering, setRendering] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // 발행 모달 상태
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishChannelId, setPublishChannelId] = useState('');
  const [publishCaption, setPublishCaption] = useState('');
  const [channels, setChannels] = useState<SnsChannel[]>([]);

  // 성과 데이터
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadCardNews = useCallback(async () => {
    try {
      const res = await fetch(`/api/card-news/${id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCardNews(data);
      setPublishCaption(`${data.title}\n\n#카드뉴스 #SocialDoctors`);
      if (data.channelId) setPublishChannelId(data.channelId);
    } catch {
      showToast('카드뉴스를 불러오지 못했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadChannels = useCallback(async () => {
    try {
      const res = await fetch('/api/social-pulse/channels');
      const data = await res.json();
      setChannels((data.channels ?? []).filter((c: { status: string }) => c.status === 'ACTIVE'));
    } catch { /* 채널 로드 실패 무시 */ }
  }, []);

  const loadInsights = useCallback(async () => {
    if (!cardNews?.postId) return;
    setInsightsLoading(true);
    try {
      const res = await fetch(`/api/card-news/${id}/insights`);
      if (res.ok) {
        const data = await res.json();
        setInsights(data);
      }
    } catch { /* insights 실패 무시 */ }
    finally { setInsightsLoading(false); }
  }, [id, cardNews?.postId]);

  useEffect(() => { loadCardNews(); loadChannels(); }, [loadCardNews, loadChannels]);
  useEffect(() => { if (cardNews?.status === 'PUBLISHED') loadInsights(); }, [cardNews?.status, loadInsights]);

  // 렌더링
  const handleRender = async () => {
    setRendering(true);
    try {
      const res = await fetch(`/api/card-news/${id}/render`, { method: 'POST' });
      if (!res.ok) throw new Error();
      showToast('이미지 렌더링 완료!');
      loadCardNews();
    } catch {
      showToast('렌더링에 실패했습니다.', 'error');
    } finally {
      setRendering(false);
    }
  };

  // 발행
  const handlePublish = async () => {
    setPublishing(true);
    try {
      const res = await fetch(`/api/card-news/${id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelId: publishChannelId || undefined,
          caption: publishCaption,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      showToast('SNS 발행 완료!');
      setShowPublishModal(false);
      loadCardNews();
    } catch (err) {
      showToast(err instanceof Error ? err.message : '발행에 실패했습니다.', 'error');
    } finally {
      setPublishing(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">불러오는 중...</div>;
  if (!cardNews) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">카드뉴스를 찾을 수 없습니다.</div>;

  const hasImages = cardNews.slides.some(s => s.imageUrl);

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-white text-sm shadow-lg ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
          {toast.msg}
        </div>
      )}

      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/admin/card-news" className="text-gray-500 hover:text-gray-700 text-sm">← 목록</Link>
            <h1 className="text-xl font-bold text-gray-900">{cardNews.title}</h1>
            <CardNewsStatusBadge status={cardNews.status} />
            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
              {TEMPLATE_LABELS[cardNews.templateType] ?? cardNews.templateType}
            </span>
          </div>
          <div className="flex gap-2">
            {cardNews.status === 'DRAFT' && (
              <button onClick={handleRender} disabled={rendering} className="px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50" style={{ background: '#3B82F6' }}>
                {rendering ? '렌더링 중...' : '이미지 생성'}
              </button>
            )}
            {(cardNews.status === 'RENDERED' || hasImages) && cardNews.status !== 'PUBLISHED' && (
              <button onClick={() => setShowPublishModal(true)} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: '#22C55E' }}>
                SNS 발행
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* 메타 정보 카드 */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-5 gap-4 text-xs">
            <div>
              <span className="text-gray-500">주제</span>
              <div className="text-gray-900 font-semibold mt-1">{cardNews.topic}</div>
            </div>
            <div>
              <span className="text-gray-500">슬라이드</span>
              <div className="text-gray-900 font-semibold mt-1">{cardNews.slideCount}장</div>
            </div>
            <div>
              <span className="text-gray-500">채널</span>
              <div className="text-gray-900 font-semibold mt-1">{cardNews.channel ? `${cardNews.channel.clientName} · ${cardNews.channel.channelName}` : '미지정'}</div>
            </div>
            <div>
              <span className="text-gray-500">생성일</span>
              <div className="text-gray-900 font-semibold mt-1">{new Date(cardNews.createdAt).toLocaleDateString('ko-KR')}</div>
            </div>
            <div>
              <span className="text-gray-500">발행일</span>
              <div className="text-gray-900 font-semibold mt-1">{cardNews.publishedAt ? new Date(cardNews.publishedAt).toLocaleDateString('ko-KR') : '-'}</div>
            </div>
          </div>
        </div>

        {/* 성과 평가 (발행된 경우) */}
        {cardNews.status === 'PUBLISHED' && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-900">발행 성과</h2>
              <button
                onClick={loadInsights}
                disabled={insightsLoading}
                className="text-xs font-semibold text-[#00A1E0] hover:underline disabled:opacity-50"
              >
                {insightsLoading ? '갱신 중...' : '성과 갱신'}
              </button>
            </div>
            {insights ? (
              <div className="grid grid-cols-6 gap-4">
                {[
                  { label: '도달', value: insights.reach, color: '#3B82F6' },
                  { label: '노출', value: insights.impressions, color: '#8B5CF6' },
                  { label: '좋아요', value: insights.likes, color: '#EF4444' },
                  { label: '공유', value: insights.shares, color: '#22C55E' },
                  { label: '댓글', value: insights.comments, color: '#F59E0B' },
                  { label: '참여율', value: `${insights.engagement_rate.toFixed(1)}%`, color: '#00A1E0' },
                ].map((m) => (
                  <div key={m.label} className="text-center">
                    <div className="text-2xl font-bold" style={{ color: m.color }}>
                      {typeof m.value === 'number' ? m.value.toLocaleString() : m.value}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{m.label}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400 text-sm">
                {insightsLoading ? '성과 데이터를 불러오는 중...' : '발행 후 성과 데이터가 수집되면 여기에 표시됩니다.'}
              </div>
            )}
            {insights?.fetched_at && (
              <div className="text-xs text-gray-400 mt-3 text-right">
                마지막 갱신: {new Date(insights.fetched_at).toLocaleString('ko-KR')}
              </div>
            )}
          </div>
        )}

        {/* 슬라이드 그리드 */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 mb-3">슬라이드 ({cardNews.slideCount}장)</h2>
          <div className="grid grid-cols-3 gap-4">
            {cardNews.slides.map((slide) => (
              <motion.div
                key={slide.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                {/* 이미지 */}
                <div
                  className="aspect-square flex flex-col justify-center items-center p-6 text-center"
                  style={{
                    background: slide.imageUrl
                      ? `url(${slide.imageUrl}) center/cover`
                      : (slide.bgColor ?? (cardNews.brandColor || '#E5E7EB')),
                    color: slide.imageUrl ? 'transparent' : 'white',
                  }}
                >
                  {!slide.imageUrl && (
                    <>
                      <div className="text-xs opacity-60 mb-2">{ROLE_LABELS[slide.role]}</div>
                      <div className="text-lg font-bold">{slide.headline}</div>
                    </>
                  )}
                </div>
                {/* 메타 */}
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-gray-900">{slide.slideOrder}.</span>
                    <span className="text-xs px-1.5 py-0.5 rounded text-white font-semibold" style={{ background: '#6B7280' }}>
                      {ROLE_LABELS[slide.role]}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-gray-900 truncate">{slide.headline}</div>
                  {slide.bodyText && <div className="text-xs text-gray-500 mt-1 truncate">{slide.bodyText}</div>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 발행 모달 */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">SNS 발행</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">발행 채널</label>
                <select
                  value={publishChannelId}
                  onChange={e => setPublishChannelId(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:border-[#00A1E0] focus:ring-1 focus:ring-[#00A1E0]"
                >
                  <option value="">채널 선택...</option>
                  {channels.map(ch => (
                    <option key={ch.id} value={ch.id}>{ch.clientName} - {ch.channelName} ({ch.platform})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">포스팅 본문</label>
                <textarea
                  value={publishCaption}
                  onChange={e => setPublishCaption(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#00A1E0] focus:ring-1 focus:ring-[#00A1E0]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowPublishModal(false)} className="px-4 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50">
                취소
              </button>
              <button
                onClick={handlePublish}
                disabled={publishing || !publishChannelId}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
                style={{ background: '#22C55E' }}
              >
                {publishing ? '발행 중...' : '발행하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
