'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardShell from '@/components/saas-dashboard/DashboardShell';

interface Post {
  id: string;
  platform: string;
  content: string;
  scheduledAt: string | null;
  status: string;
}

const navItems = [
  { label: '대시보드', href: '/saas/apps/social-pulse/dashboard', active: true },
  { label: '게시물 예약', href: '#' },
  { label: 'AI 카피', href: '#' },
  { label: '통합 인박스', href: '#' },
  { label: '분석', href: '#' },
];

const PLATFORM_LABEL: Record<string, string> = {
  FACEBOOK: 'Facebook',
  INSTAGRAM: 'Instagram',
  X: 'X',
  YOUTUBE: 'YouTube',
};

const STATUS_LABEL: Record<string, string> = {
  DRAFT: '초안',
  SCHEDULED: '예약됨',
  PUBLISHED: '발행됨',
  FAILED: '실패',
};

export default function SocialPulseDashboard() {
  const { status } = useSession();
  const router = useRouter();
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [generating, setGenerating] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [monthlyCount, setMonthlyCount] = useState(0);
  const [newPost, setNewPost] = useState({ platform: 'FACEBOOK', content: '', scheduledAt: '' });
  const [showNewPost, setShowNewPost] = useState(false);
  const [savingPost, setSavingPost] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/sign-in?callbackUrl=/saas/apps/social-pulse/dashboard');
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/social-pulse/posts')
        .then((r) => r.json())
        .then((d) => {
          setPosts(d.posts ?? []);
          setMonthlyCount(d.monthlyCount ?? 0);
        })
        .catch(() => {});
    }
  }, [status]);

  const generateCopy = async () => {
    if (!aiPrompt.trim()) return;
    setGenerating(true);
    setAiResult('');
    try {
      const res = await fetch('/api/social-pulse/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt, platform: 'FACEBOOK' }),
      });
      const data = await res.json();
      setAiResult(data.copy ?? '생성 실패. 다시 시도해주세요.');
    } catch {
      setAiResult('네트워크 오류가 발생했습니다.');
    } finally {
      setGenerating(false);
    }
  };

  const addPost = async () => {
    if (!newPost.content.trim()) return;
    setSavingPost(true);
    try {
      const res = await fetch('/api/social-pulse/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });
      const data = await res.json();
      if (data.post) {
        setPosts((prev) => [data.post, ...prev]);
        setNewPost({ platform: 'FACEBOOK', content: '', scheduledAt: '' });
        setShowNewPost(false);
        setMonthlyCount((n) => n + 1);
      }
    } catch {
      // ignore
    } finally {
      setSavingPost(false);
    }
  };

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center text-gray-500">로딩 중...</div>;

  return (
    <DashboardShell appName="Social Pulse" appSlug="social-pulse" themeColor="blue" navItems={navItems}>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: '이번달 게시물', value: String(monthlyCount), change: '실시간' },
          { label: '총 게시물', value: String(posts.length), change: '누적' },
          { label: '예약됨', value: String(posts.filter(p => p.status === 'SCHEDULED').length), change: '대기중' },
          { label: 'AI 카피 생성', value: '실시간', change: 'Gemini AI' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs mt-1 font-semibold text-blue-600">{s.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 예약 게시물 */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">게시물 관리</h2>
            <button
              onClick={() => setShowNewPost((v) => !v)}
              className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + 새 게시물
            </button>
          </div>

          {showNewPost && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100 space-y-2">
              <select
                value={newPost.platform}
                onChange={(e) => setNewPost((p) => ({ ...p, platform: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
              >
                <option value="FACEBOOK">Facebook</option>
                <option value="INSTAGRAM">Instagram</option>
                <option value="X">X (Twitter)</option>
                <option value="YOUTUBE">YouTube</option>
              </select>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost((p) => ({ ...p, content: e.target.value }))}
                placeholder="게시물 내용을 입력하세요..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 resize-none"
              />
              <input
                type="datetime-local"
                value={newPost.scheduledAt}
                onChange={(e) => setNewPost((p) => ({ ...p, scheduledAt: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
              />
              <button
                onClick={addPost}
                disabled={savingPost || !newPost.content.trim()}
                className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {savingPost ? '저장 중...' : '저장'}
              </button>
            </div>
          )}

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {posts.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">게시물이 없습니다. 새 게시물을 추가해보세요.</p>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold flex-shrink-0 ${
                    post.platform === 'FACEBOOK' ? 'bg-blue-100 text-blue-700' :
                    post.platform === 'INSTAGRAM' ? 'bg-pink-100 text-pink-700' :
                    post.platform === 'YOUTUBE' ? 'bg-red-100 text-red-700' :
                    'bg-gray-200 text-gray-700'
                  }`}>{PLATFORM_LABEL[post.platform] ?? post.platform}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate">{post.content}</p>
                    {post.scheduledAt && (
                      <p className="text-xs text-gray-400 mt-1">{new Date(post.scheduledAt).toLocaleString('ko-KR')}</p>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                    post.status === 'SCHEDULED' ? 'bg-yellow-100 text-yellow-700' :
                    post.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>{STATUS_LABEL[post.status] ?? post.status}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI 카피 생성 */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">AI 카피 생성 <span className="text-xs text-blue-500 font-normal">Gemini AI 탑재</span></h2>
          <div className="space-y-3">
            <input
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="제품/서비스를 입력하세요 (예: 여름 신발 세일)"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
              onKeyDown={(e) => e.key === 'Enter' && generateCopy()}
            />
            <button
              onClick={generateCopy}
              disabled={generating || !aiPrompt.trim()}
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {generating ? '생성 중...' : '카피 생성하기'}
            </button>
            {aiResult && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-900 whitespace-pre-line">{aiResult}</p>
                <button
                  onClick={() => navigator.clipboard.writeText(aiResult)}
                  className="mt-2 text-xs text-blue-600 hover:underline"
                >
                  복사하기
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 채널 연동 */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">채널 연동</h2>
          <div className="space-y-2">
            {[
              { name: 'Facebook Page', connected: false },
              { name: 'Instagram Business', connected: false },
              { name: 'X (Twitter)', connected: false },
              { name: 'YouTube', connected: false },
            ].map((ch) => (
              <div key={ch.name} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{ch.name}</span>
                <button className="text-xs px-3 py-1 bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 border border-gray-200 rounded-lg transition-colors">
                  연동하기
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">* 채널 연동은 프리미엄 플랜에서 실제 발행됩니다.</p>
        </div>

        {/* 통합 인박스 */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">통합 인박스 <span className="text-xs text-gray-400">최근 댓글/DM</span></h2>
          <div className="space-y-3">
            {[
              { platform: 'Instagram', user: '@kim_style', msg: '이 제품 재입고 언제 되나요? 😍', time: '5분 전' },
              { platform: 'Facebook', user: '이민지', msg: '배송은 얼마나 걸리나요?', time: '23분 전' },
              { platform: 'X', user: '@startup_kr', msg: '정말 좋은 서비스네요 👍', time: '1시간 전' },
            ].map((msg, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 flex-shrink-0">
                  {msg.user[1]?.toUpperCase() ?? '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-700">{msg.user}</span>
                    <span className="text-xs text-gray-400">{msg.platform}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{msg.msg}</p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{msg.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
