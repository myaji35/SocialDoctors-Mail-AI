'use client';

import { useState } from 'react';
import { PLATFORMS, FacebookTokenGuide } from './ChannelRegisterModal';

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

interface ChannelEditModalProps {
  channel: SnsChannel;
  onClose: () => void;
  onSuccess: () => void;
}

const PLATFORM_LABELS: Record<string, string> = {
  FACEBOOK: 'Facebook', INSTAGRAM: 'Instagram', THREADS: 'Threads',
  TIKTOK: 'TikTok', X: 'X', YOUTUBE: 'YouTube',
};

const PLATFORM_ICONS: Record<string, string> = {
  FACEBOOK: 'f', INSTAGRAM: '◈', THREADS: '@',
  TIKTOK: '♪', X: '𝕏', YOUTUBE: '▶',
};

const PLATFORM_COLORS: Record<string, string> = {
  FACEBOOK: 'bg-blue-600', INSTAGRAM: 'bg-gradient-to-br from-purple-500 to-pink-500',
  THREADS: 'bg-gray-900', TIKTOK: 'bg-black',
  X: 'bg-gray-800', YOUTUBE: 'bg-red-600',
};

export default function ChannelEditModal({ channel, onClose, onSuccess }: ChannelEditModalProps) {
  const [form, setForm] = useState({
    channelName: channel.channelName,
    accessToken: '',
    tokenExpiresAt: channel.tokenExpiresAt?.split('T')[0] ?? '',
  });
  const [showToken, setShowToken] = useState(false);
  const [showTokenGuide, setShowTokenGuide] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const platformInfo = PLATFORMS.find(p => p.id === channel.platform);

  const handleSave = async () => {
    if (!form.channelName.trim()) {
      setError('채널 이름은 필수입니다.');
      return;
    }

    const body: Record<string, unknown> = {};
    if (form.channelName !== channel.channelName) body.channelName = form.channelName;
    if (form.accessToken) body.accessToken = form.accessToken;
    if (form.tokenExpiresAt) body.tokenExpiresAt = form.tokenExpiresAt;

    if (Object.keys(body).length === 0) { onClose(); return; }

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/social-pulse/channels/${channel.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? '저장에 실패했습니다.');
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError('');
    try {
      const res = await fetch(`/api/social-pulse/channels/${channel.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('삭제에 실패했습니다.');
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '네트워크 오류가 발생했습니다.');
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  /* ── 삭제 확인 다이얼로그 ── */
  if (showDeleteConfirm) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth={2} className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">채널 삭제</h3>
              <p className="text-sm text-gray-500 mt-0.5">
                &apos;{channel.channelName}&apos; 채널을 삭제합니다.
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-5">이 채널의 발행 이력은 유지됩니다.</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => { setShowDeleteConfirm(false); setError(''); }}
              className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold py-2.5 rounded-xl transition-colors"
            >
              {deleting ? '삭제 중...' : '삭제하기'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── 메인 편집 모달 ── */
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">

        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b px-6 pt-5 pb-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-base font-bold shrink-0 ${
                  PLATFORM_COLORS[channel.platform] ?? 'bg-gray-500'
                }`}
              >
                {PLATFORM_ICONS[channel.platform] ?? channel.platform[0]}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 leading-tight">{channel.channelName}</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {PLATFORM_LABELS[channel.platform] ?? channel.platform} · {channel.clientName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                channel.status === 'ACTIVE'
                  ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
                  : 'bg-gray-100 text-gray-500 ring-1 ring-gray-200'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${channel.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-400'}`} />
                {channel.status === 'ACTIVE' ? '활성' : '비활성'}
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* 읽기 전용 정보 */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">채널 정보</h3>
            <div className="space-y-0 divide-y divide-gray-200/60">
              <div className="flex justify-between items-center py-2.5">
                <span className="text-sm text-gray-600">페이지 ID</span>
                <code className="font-mono text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{channel.pageId}</code>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="text-sm text-gray-600">등록일</span>
                <span className="text-sm font-semibold text-gray-900">{new Date(channel.createdAt).toLocaleDateString('ko-KR')}</span>
              </div>
              {channel.tokenExpiresAt && (
                <div className="flex justify-between items-center py-2.5">
                  <span className="text-sm text-gray-600">토큰 만료</span>
                  <span className="text-sm font-semibold text-gray-900">{new Date(channel.tokenExpiresAt).toLocaleDateString('ko-KR')}</span>
                </div>
              )}
            </div>
          </div>

          {/* 편집 가능 필드 */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-blue-600">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              <h3 className="text-sm font-bold text-gray-900">편집</h3>
            </div>

            {/* 채널 표시 이름 */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                채널 표시 이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.channelName}
                onChange={e => setForm(f => ({ ...f, channelName: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 액세스 토큰 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-800">
                  액세스 토큰 <span className="text-gray-500 font-normal text-xs">(새 토큰으로 교체)</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowToken(s => !s)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  {showToken ? '숨기기' : '보기'}
                </button>
              </div>
              <textarea
                placeholder="비워두면 기존 토큰이 유지됩니다"
                value={form.accessToken}
                onChange={e => setForm(f => ({ ...f, accessToken: e.target.value.trim() }))}
                rows={showToken ? 3 : 2}
                className="w-full border border-gray-300 rounded-lg px-3.5 py-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono resize-none"
                style={{ WebkitTextSecurity: showToken ? 'none' : 'disc' } as React.CSSProperties}
              />
              <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1.5">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-green-600">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
                비워두면 기존 토큰이 유지됩니다.
              </p>
            </div>

            {/* 토큰 가이드 (Facebook/Instagram) */}
            {platformInfo && (platformInfo.id === 'FACEBOOK' || platformInfo.id === 'INSTAGRAM') && (
              <div>
                <button
                  type="button"
                  onClick={() => setShowTokenGuide(g => !g)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                    showTokenGuide
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 16v-4M12 8h.01"/>
                    </svg>
                    토큰 발급 가이드 보기
                  </span>
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`w-4 h-4 transition-transform ${showTokenGuide ? 'rotate-180' : ''}`}
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
                {showTokenGuide && (
                  <div className="mt-3 bg-white border border-blue-200 rounded-xl p-4 shadow-sm">
                    <FacebookTokenGuide />
                  </div>
                )}
              </div>
            )}

            {/* 토큰 만료일 */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                토큰 만료일 <span className="text-gray-500 font-normal text-xs">(선택)</span>
              </label>
              <input
                type="date"
                value={form.tokenExpiresAt}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setForm(f => ({ ...f, tokenExpiresAt: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 rounded-lg flex items-start gap-2">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0 mt-0.5">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              {error}
            </div>
          )}

          {/* 버튼 */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? '저장 중...' : '저장하기'}
            </button>
          </div>

          {/* 위험 영역: 삭제 */}
          <div className="border-t pt-4 mt-2">
            <div className="bg-red-50/60 rounded-xl px-4 py-3">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2.5 text-red-600 hover:text-red-700 text-sm font-semibold transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                이 채널 삭제
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
