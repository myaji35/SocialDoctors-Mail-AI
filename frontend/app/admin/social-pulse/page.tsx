'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import PostStatusBadge from '@/components/social-pulse/PostStatusBadge';
import ChannelRegisterModal from '@/components/social-pulse/ChannelRegisterModal';
import PostComposer from '@/components/social-pulse/PostComposer';

interface SnsChannel {
  id: string;
  clientName: string;
  clientSlug: string;
  platform: string;
  channelName: string;
  pageId: string;
  status: string;
  tokenExpiresAt: string | null;
  createdAt: string;
}

interface SocialPost {
  id: string;
  content: string;
  platform: string;
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'FAILED';
  channelId: string | null;
  externalPostId: string | null;
  publishedAt: string | null;
  scheduledAt: string | null;
  createdAt: string;
  channel?: { channelName: string; clientName: string } | null;
}

const PLATFORM_ICONS: Record<string, string> = {
  FACEBOOK:  'f',
  INSTAGRAM: '◈',
  THREADS:   '@',
  TIKTOK:    '♪',
  X:         '𝕏',
  YOUTUBE:   '▶',
};

const PLATFORM_COLORS: Record<string, string> = {
  FACEBOOK:  'bg-blue-600',
  INSTAGRAM: 'bg-gradient-to-br from-purple-500 to-pink-500',
  THREADS:   'bg-gray-900',
  TIKTOK:    'bg-black',
  X:         'bg-gray-800',
  YOUTUBE:   'bg-red-600',
};

const PLATFORM_LABELS: Record<string, string> = {
  FACEBOOK:  'Facebook',
  INSTAGRAM: 'Instagram',
  THREADS:   'Threads',
  TIKTOK:    'TikTok',
  X:         'X',
  YOUTUBE:   'YouTube',
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

export default function SocialPulsePage() {
  const [channels, setChannels] = useState<SnsChannel[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [selectedClientSlug, setSelectedClientSlug] = useState<string | null>(null);
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [showComposer, setShowComposer] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PUBLISHED' | 'SCHEDULED' | 'FAILED' | 'DRAFT'>('ALL');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadChannels = useCallback(async () => {
    try {
      const res = await fetch('/api/social-pulse/channels');
      const data = await res.json();
      setChannels(data.channels ?? []);
    } catch {
      showToast('채널 목록을 불러오지 못했습니다.', 'error');
    }
  }, []);

  const loadPosts = useCallback(async () => {
    try {
      const res = await fetch('/api/social-pulse/posts?limit=30');
      const data = await res.json();
      setPosts(data.posts ?? []);
    } catch {
      showToast('포스트 목록을 불러오지 못했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChannels();
    loadPosts();
  }, [loadChannels, loadPosts]);

  const handleToggleChannel = async (channel: SnsChannel) => {
    const newStatus = channel.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await fetch(`/api/social-pulse/channels/${channel.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    loadChannels();
    showToast(`채널이 ${newStatus === 'ACTIVE' ? '활성화' : '비활성화'}되었습니다.`);
  };

  // 클라이언트 목록 (중복 제거)
  const clients = Array.from(
    new Map(channels.map(c => [c.clientSlug, { slug: c.clientSlug, name: c.clientName }])).values()
  );

  const filteredChannels = selectedClientSlug
    ? channels.filter(c => c.clientSlug === selectedClientSlug)
    : channels;

  const filteredPosts =
    activeTab === 'ALL' ? posts : posts.filter(p => p.status === activeTab);

  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === 'PUBLISHED').length,
    scheduled: posts.filter(p => p.status === 'SCHEDULED').length,
    failed: posts.filter(p => p.status === 'FAILED').length,
    draft: posts.filter(p => p.status === 'DRAFT').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 토스트 */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* 헤더 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-gray-400 hover:text-gray-600 text-sm">
              ← 어드민
            </Link>
            <span className="text-gray-300">/</span>
            <h1 className="text-xl font-bold text-gray-900">Social Publishing Hub</h1>
          </div>
          <button
            onClick={() => setShowComposer(true)}
            disabled={channels.filter(c => c.status === 'ACTIVE').length === 0}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + 새 포스트 작성
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6">
        {/* 좌측: 채널 목록 */}
        <div className="w-64 shrink-0 space-y-4">
          {/* 클라이언트 필터 */}
          <div className="bg-white rounded-xl border p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              클라이언트
            </h3>
            <button
              onClick={() => setSelectedClientSlug(null)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm mb-1 ${
                selectedClientSlug === null
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              전체 보기
            </button>
            {clients.map(c => (
              <button
                key={c.slug}
                onClick={() => setSelectedClientSlug(c.slug)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-sm mb-1 ${
                  selectedClientSlug === c.slug
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* 채널 카드들 */}
          <div className="bg-white rounded-xl border p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                채널 ({filteredChannels.length})
              </h3>
              <button
                onClick={() => setShowChannelModal(true)}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                + 추가
              </button>
            </div>

            {filteredChannels.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">등록된 채널 없음</p>
            ) : (
              <div className="space-y-2">
                {filteredChannels.map(channel => (
                  <div key={channel.id} className="flex items-center gap-2 group">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 ${
                        PLATFORM_COLORS[channel.platform] ?? 'bg-gray-500'
                      }`}
                    >
                      {PLATFORM_ICONS[channel.platform] ?? channel.platform[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate">{channel.channelName}</p>
                      <p className="text-xs text-gray-400">{channel.clientName}</p>
                    </div>
                    <button
                      onClick={() => handleToggleChannel(channel)}
                      className={`w-8 h-4 rounded-full transition-colors shrink-0 ${
                        channel.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                      title={channel.status === 'ACTIVE' ? '활성 (클릭하여 비활성화)' : '비활성'}
                    >
                      <div
                        className={`w-3.5 h-3.5 bg-white rounded-full shadow transition-transform mx-0.5 ${
                          channel.status === 'ACTIVE' ? 'translate-x-3.5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 우측: 포스트 현황 */}
        <div className="flex-1 space-y-4">
          {/* 통계 카드 */}
          <div className="grid grid-cols-5 gap-3">
            {[
              { key: 'ALL', label: '전체', value: stats.total, color: 'text-gray-700' },
              { key: 'PUBLISHED', label: '발행됨', value: stats.published, color: 'text-green-700' },
              { key: 'SCHEDULED', label: '예약됨', value: stats.scheduled, color: 'text-blue-700' },
              { key: 'FAILED', label: '실패', value: stats.failed, color: 'text-red-700' },
              { key: 'DRAFT', label: '초안', value: stats.draft, color: 'text-gray-500' },
            ].map(stat => (
              <button
                key={stat.key}
                onClick={() => setActiveTab(stat.key as typeof activeTab)}
                className={`bg-white rounded-xl border p-4 text-center transition-all ${
                  activeTab === stat.key ? 'ring-2 ring-blue-500' : 'hover:shadow-sm'
                }`}
              >
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </button>
            ))}
          </div>

          {/* 포스트 목록 */}
          <div className="bg-white rounded-xl border">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-gray-900">
                {activeTab === 'ALL' ? '전체 포스트' : `${activeTab} 포스트`}
              </h2>
            </div>

            {loading ? (
              <div className="p-8 text-center text-gray-400 text-sm">불러오는 중...</div>
            ) : filteredPosts.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-400 text-sm mb-3">아직 포스트가 없습니다.</p>
                {channels.filter(c => c.status === 'ACTIVE').length > 0 && (
                  <button
                    onClick={() => setShowComposer(true)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    첫 포스트 작성하기 →
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y">
                {filteredPosts.map(post => (
                  <div key={post.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0 mt-0.5 ${
                          PLATFORM_COLORS[post.platform] ?? 'bg-gray-500'
                        }`}
                      >
                        {PLATFORM_ICONS[post.platform] ?? post.platform[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <PostStatusBadge status={post.status} />
                          <span className="text-xs text-gray-400">
                            {post.publishedAt
                              ? timeAgo(post.publishedAt)
                              : post.scheduledAt
                              ? new Date(post.scheduledAt).toLocaleString('ko-KR', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : timeAgo(post.createdAt)}
                          </span>
                          {post.externalPostId && (
                            <span className="text-xs text-gray-300 font-mono truncate max-w-32">
                              {post.externalPostId}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">{post.content}</p>
                        {post.channel && (
                          <p className="text-xs text-gray-400 mt-1">
                            {post.channel.clientName} · {post.channel.channelName}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 모달들 */}
      {showChannelModal && (
        <ChannelRegisterModal
          onClose={() => setShowChannelModal(false)}
          onSuccess={() => {
            loadChannels();
            showToast('채널이 등록되었습니다.');
          }}
        />
      )}

      {showComposer && (
        <PostComposer
          channels={channels}
          onClose={() => setShowComposer(false)}
          onSuccess={() => {
            loadPosts();
            showToast('포스트가 발행되었습니다!');
          }}
        />
      )}
    </div>
  );
}
