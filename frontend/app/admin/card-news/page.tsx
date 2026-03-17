'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import CardNewsStatusBadge from '@/components/card-news/CardNewsStatusBadge';

interface CardSlide {
  id: string;
  slideOrder: number;
  role: string;
  headline: string;
  imageUrl: string | null;
}

interface CardNewsItem {
  id: string;
  title: string;
  topic: string;
  templateType: string;
  status: string;
  slideCount: number;
  brandColor: string | null;
  callerApp: string | null;
  publishedAt: string | null;
  createdAt: string;
  slides: CardSlide[];
  channel?: { channelName: string; clientName: string } | null;
  insights?: { reach: number; likes: number; shares: number } | null;
}

interface Stats {
  draft: number;
  rendered: number;
  published: number;
}

const TEMPLATE_LABELS: Record<string, string> = {
  SERVICE_INTRO: '서비스 소개',
  EDUCATION: '교육 콘텐츠',
  EVENT: '이벤트',
  CUSTOM: '커스텀',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '방금 전';
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}

export default function CardNewsListPage() {
  const [items, setItems] = useState<CardNewsItem[]>([]);
  const [stats, setStats] = useState<Stats>({ draft: 0, rendered: 0, published: 0 });
  const [total, setTotal] = useState(0);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadCardNews = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.set('status', filterStatus);
      const res = await fetch(`/api/card-news?${params}`);
      const data = await res.json();
      setItems(data.items ?? []);
      setStats(data.stats ?? { draft: 0, rendered: 0, published: 0 });
      setTotal(data.total ?? 0);
    } catch {
      showToast('카드뉴스 목록을 불러오지 못했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    loadCardNews();
  }, [loadCardNews]);

  const handleDelete = async (id: string) => {
    if (!confirm('이 카드뉴스를 삭제하시겠습니까?')) return;
    try {
      await fetch(`/api/card-news/${id}`, { method: 'DELETE' });
      showToast('삭제되었습니다.');
      loadCardNews();
    } catch {
      showToast('삭제에 실패했습니다.', 'error');
    }
  };

  const statCards = [
    { label: '전체', value: total, color: '#16325C' },
    { label: '초안', value: stats.draft, color: '#6B7280' },
    { label: '렌더링', value: stats.rendered, color: '#3B82F6' },
    { label: '발행됨', value: stats.published, color: '#22C55E' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 토스트 */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-white text-sm shadow-lg ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
          {toast.msg}
        </div>
      )}

      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-gray-500 hover:text-gray-700 text-sm">
              ← Admin
            </Link>
            <h1 className="text-xl font-bold text-gray-900">카드뉴스 관리</h1>
          </div>
          <Link
            href="/admin/card-news/create"
            className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
            style={{ background: '#00A1E0' }}
          >
            + 새 카드뉴스 만들기
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* 통계 카드 */}
        <div className="grid grid-cols-4 gap-4">
          {statCards.map((card) => (
            <motion.div
              key={card.label}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer"
              onClick={() => setFilterStatus(card.label === '전체' ? '' : card.label === '초안' ? 'DRAFT' : card.label === '렌더링' ? 'RENDERED' : 'PUBLISHED')}
            >
              <div className="text-xs font-semibold text-gray-600 mb-1">{card.label}</div>
              <div className="text-2xl font-bold" style={{ color: card.color }}>{card.value}</div>
            </motion.div>
          ))}
        </div>

        {/* 필터 */}
        <div className="flex gap-2">
          {['', 'DRAFT', 'RENDERED', 'PUBLISHED', 'FAILED'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterStatus === s
                  ? 'text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
              style={filterStatus === s ? { background: '#00A1E0' } : {}}
            >
              {s === '' ? '전체' : s === 'DRAFT' ? '초안' : s === 'RENDERED' ? '렌더링됨' : s === 'PUBLISHED' ? '발행됨' : '실패'}
            </button>
          ))}
        </div>

        {/* 목록 */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">불러오는 중...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 mb-4">카드뉴스가 없습니다</div>
            <Link
              href="/admin/card-news/create"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ background: '#00A1E0' }}
            >
              첫 카드뉴스 만들기
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Link
                        href={`/admin/card-news/${item.id}`}
                        className="text-base font-semibold text-gray-900 hover:text-[#00A1E0] transition-colors"
                      >
                        {item.title}
                      </Link>
                      <CardNewsStatusBadge status={item.status} />
                      <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                        {TEMPLATE_LABELS[item.templateType] ?? item.templateType}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{item.slideCount} 슬라이드</span>
                      <span>{timeAgo(item.createdAt)}</span>
                      {item.channel && <span>{item.channel.clientName} · {item.channel.channelName}</span>}
                      {item.callerApp && <span className="text-purple-500">via {item.callerApp}</span>}
                    </div>

                    {/* 발행 성과 (있을 경우) */}
                    {item.status === 'PUBLISHED' && item.insights && (
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span>도달 <strong className="text-gray-700">{item.insights.reach.toLocaleString()}</strong></span>
                        <span>좋아요 <strong className="text-gray-700">{item.insights.likes.toLocaleString()}</strong></span>
                        <span>공유 <strong className="text-gray-700">{item.insights.shares.toLocaleString()}</strong></span>
                      </div>
                    )}
                  </div>

                  {/* 슬라이드 썸네일 미리보기 */}
                  <div className="flex gap-1 ml-4">
                    {item.slides.slice(0, 3).map((slide) => (
                      <div
                        key={slide.id}
                        className="w-12 h-12 rounded border border-gray-200 flex items-center justify-center text-xs"
                        style={{
                          background: slide.imageUrl ? `url(${slide.imageUrl}) center/cover` : (item.brandColor ?? '#E5E7EB'),
                          color: slide.imageUrl ? 'transparent' : 'white',
                        }}
                      >
                        {!slide.imageUrl && slide.slideOrder}
                      </div>
                    ))}
                    {item.slideCount > 3 && (
                      <div className="w-12 h-12 rounded border border-gray-200 flex items-center justify-center text-xs text-gray-400 bg-gray-50">
                        +{item.slideCount - 3}
                      </div>
                    )}
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <Link
                    href={`/admin/card-news/${item.id}`}
                    className="px-3 py-1.5 text-xs font-semibold rounded border border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    상세보기
                  </Link>
                  {item.status === 'RENDERED' && (
                    <button
                      className="px-3 py-1.5 text-xs font-semibold rounded text-white"
                      style={{ background: '#22C55E' }}
                      onClick={() => {/* TODO: 발행 모달 */}}
                    >
                      발행
                    </button>
                  )}
                  <button
                    className="px-3 py-1.5 text-xs font-semibold rounded border border-red-200 text-red-500 hover:bg-red-50 ml-auto"
                    onClick={() => handleDelete(item.id)}
                  >
                    삭제
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
