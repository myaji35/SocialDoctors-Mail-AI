'use client';

import { useState } from 'react';

interface Channel {
  id: string;
  clientName: string;
  channelName: string;
  platform: string;
  status: string;
}

interface PostComposerProps {
  channels: Channel[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function PostComposer({ channels, onClose, onSuccess }: PostComposerProps) {
  const [selectedChannelId, setSelectedChannelId] = useState(channels[0]?.id ?? '');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [mockMode, setMockMode] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [error, setError] = useState('');

  const PLATFORM_LIMITS: Record<string, { maxChars: number; requiresMedia: boolean; videoRequired?: boolean }> = {
    FACEBOOK:  { maxChars: 500,  requiresMedia: false },
    INSTAGRAM: { maxChars: 300,  requiresMedia: true },
    THREADS:   { maxChars: 500,  requiresMedia: false },
    TIKTOK:    { maxChars: 300,  requiresMedia: true, videoRequired: true },
    X:         { maxChars: 280,  requiresMedia: false },
    YOUTUBE:   { maxChars: 500,  requiresMedia: true },
  };

  const activeChannels = channels.filter(c => c.status === 'ACTIVE');
  const selectedChannel = channels.find(c => c.id === selectedChannelId);
  const platformLimit = PLATFORM_LIMITS[selectedChannel?.platform ?? 'FACEBOOK'] ?? PLATFORM_LIMITS['FACEBOOK'];

  const handleGenerateCopy = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/social-pulse/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt, platform: selectedChannel?.platform }),
      });
      const data = await res.json();
      if (data.copy) setContent(data.copy);
    } catch {
      setError('AI 카피 생성에 실패했습니다.');
    } finally {
      setAiLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!selectedChannelId || !content.trim()) return;
    setPublishLoading(true);
    setError('');

    try {
      const res = await fetch('/api/social-pulse/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelId: selectedChannelId,
          content: content.trim(),
          imageUrl: imageUrl.trim() || undefined,
          videoUrl: videoUrl.trim() || undefined,
          scheduledAt: isScheduled && scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
          mockMode,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? '발행 실패');
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '발행 중 오류가 발생했습니다.');
    } finally {
      setPublishLoading(false);
    }
  };

  const platformIcon: Record<string, string> = {
    FACEBOOK:  'f',
    INSTAGRAM: '◈',
    THREADS:   '@',
    TIKTOK:    '♪',
    X:         '𝕏',
    YOUTUBE:   '▶',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-gray-900">새 포스트 작성</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* 채널 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">채널 선택</label>
            <select
              value={selectedChannelId}
              onChange={e => setSelectedChannelId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {activeChannels.map(c => (
                <option key={c.id} value={c.id}>
                  {platformIcon[c.platform] ?? c.platform} {c.clientName} - {c.channelName}
                </option>
              ))}
            </select>
          </div>

          {/* AI 카피 생성 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">AI 카피 생성</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="홍보 주제를 입력하세요..."
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleGenerateCopy()}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleGenerateCopy}
                disabled={aiLoading || !aiPrompt.trim()}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              >
                {aiLoading ? '생성 중...' : 'AI 생성'}
              </button>
            </div>
          </div>

          {/* TikTok 미디어 필수 안내 */}
          {selectedChannel?.platform === 'TIKTOK' && (
            <div className="bg-orange-50 border border-orange-200 text-orange-800 text-xs rounded-lg px-3 py-2">
              TikTok은 이미지 또는 영상 URL이 필수입니다. 텍스트 전용 포스팅은 지원하지 않습니다.
            </div>
          )}
          {selectedChannel?.platform === 'INSTAGRAM' && (
            <div className="bg-pink-50 border border-pink-200 text-pink-800 text-xs rounded-lg px-3 py-2">
              Instagram은 이미지 URL이 필수입니다.
            </div>
          )}

          {/* 포스트 내용 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">포스트 내용</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="내용을 입력하거나 AI로 생성하세요..."
              rows={6}
              maxLength={platformLimit.maxChars}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 resize-none transition-colors ${
                content.length > platformLimit.maxChars * 0.9
                  ? 'border-orange-400 focus:ring-orange-400'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            <p className={`text-xs text-right mt-1 ${content.length >= platformLimit.maxChars ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
              {content.length}/{platformLimit.maxChars}
              {selectedChannel?.platform && ` (${selectedChannel.platform})`}
            </p>
          </div>

          {/* 이미지 URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이미지 URL{' '}
              <span className={platformLimit.requiresMedia && !platformLimit.videoRequired ? 'text-red-500' : 'text-gray-400'}>
                {platformLimit.requiresMedia && !platformLimit.videoRequired ? '(필수)' : '(선택)'}
              </span>
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 영상 URL (TikTok 등) */}
          {(selectedChannel?.platform === 'TIKTOK' || selectedChannel?.platform === 'YOUTUBE') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                영상 URL{' '}
                <span className={selectedChannel.platform === 'TIKTOK' ? 'text-red-500' : 'text-gray-400'}>
                  {selectedChannel.platform === 'TIKTOK' ? '(이미지 또는 영상 필수)' : '(선택)'}
                </span>
              </label>
              <input
                type="url"
                placeholder="https://... (MP4)"
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* 발행 시간 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">발행 시간</label>
            <div className="flex items-center gap-4 mb-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  checked={!isScheduled}
                  onChange={() => setIsScheduled(false)}
                  className="accent-blue-600"
                />
                즉시 발행
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  checked={isScheduled}
                  onChange={() => setIsScheduled(true)}
                  className="accent-blue-600"
                />
                예약 발행
              </label>
            </div>
            {isScheduled && (
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={e => setScheduledAt(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

          {/* 테스트 모드 */}
          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
            <input
              type="checkbox"
              id="mockMode"
              checked={mockMode}
              onChange={e => setMockMode(e.target.checked)}
              className="accent-yellow-500"
            />
            <label htmlFor="mockMode" className="text-sm text-yellow-800 cursor-pointer">
              테스트 모드 (실제 SNS에 발행하지 않음)
            </label>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          {/* 버튼 */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={publishLoading || !content.trim() || !selectedChannelId}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              {publishLoading ? '발행 중...' : isScheduled ? '예약 설정' : '발행하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
