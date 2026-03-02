'use client';

import { useState } from 'react';

interface ChannelRegisterModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

/* ── 지원 플랫폼 정의 ─────────────────────────────── */
export const PLATFORMS = [
  {
    id: 'FACEBOOK',
    label: 'Facebook',
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#1877F2">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.033 4.388 11.029 10.125 11.927v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796v8.437C19.612 23.102 24 18.105 24 12.073z"/>
      </svg>
    ),
    color: 'border-blue-400 bg-blue-50',
    activeColor: 'ring-2 ring-blue-500 border-blue-500 bg-blue-50',
    available: true,
    idLabel: 'Facebook 페이지 ID',
    idPlaceholder: '예: 123456789012345',
    tokenLabel: 'Facebook 페이지 액세스 토큰',
    tokenPrefix: 'EAA',
    tokenHint: 'Meta for Developers → Graph API 탐색기에서 발급',
  },
  {
    id: 'INSTAGRAM',
    label: 'Instagram',
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="url(#ig-gradient)">
        <defs>
          <linearGradient id="ig-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FD5949"/>
            <stop offset="50%" stopColor="#D6249F"/>
            <stop offset="100%" stopColor="#285AEB"/>
          </linearGradient>
        </defs>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
    color: 'border-pink-400 bg-pink-50',
    activeColor: 'ring-2 ring-pink-500 border-pink-500 bg-pink-50',
    available: true,
    idLabel: 'Instagram Business 계정 ID',
    idPlaceholder: '예: 17841400000000000',
    tokenLabel: 'Instagram 페이지 액세스 토큰',
    tokenPrefix: 'EAA',
    tokenHint: 'Facebook과 동일한 Meta 앱에서 instagram_content_publish 권한으로 발급',
  },
  {
    id: 'THREADS',
    label: 'Threads',
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#000">
        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.068c0-3.518.85-6.372 2.495-8.423C5.845 1.34 8.598.159 12.186.135h.007c3.588.024 6.341 1.205 8.184 3.510C22.021 5.696 22.871 8.55 22.871 12.068c0 3.518-.85 6.372-2.494 8.423C18.733 22.661 15.98 23.842 12.186 24zm-.007-22.5h-.007c-3.13.021-5.54 1.024-7.165 2.984C3.568 6.3 2.75 8.847 2.75 12.068c0 3.221.818 5.768 2.257 7.584 1.625 1.960 4.035 2.963 7.165 2.984h.007c3.13-.021 5.54-1.024 7.165-2.984 1.439-1.816 2.257-4.363 2.257-7.584 0-3.221-.818-5.768-2.257-7.584C17.719 2.524 15.309 1.521 12.179 1.5zM12 17.25c-2.9 0-5.25-2.35-5.25-5.25S9.1 6.75 12 6.75c1.658 0 3.14.77 4.125 1.98l-1.15 1.025A3.739 3.739 0 0012 8.25c-2.07 0-3.75 1.68-3.75 3.75s1.68 3.75 3.75 3.75c1.65 0 3.048-.997 3.623-2.417H12v-1.5h5.25v.75c0 2.9-2.35 5.25-5.25 5.25z"/>
      </svg>
    ),
    color: 'border-gray-400 bg-gray-50',
    activeColor: 'ring-2 ring-gray-800 border-gray-800 bg-gray-100',
    available: true,
    idLabel: 'Threads 사용자 ID',
    idPlaceholder: '예: 123456789',
    tokenLabel: 'Threads 액세스 토큰',
    tokenPrefix: '',
    tokenHint: 'Meta for Developers → Threads API → threads_content_publish 권한 필요',
  },
  {
    id: 'TIKTOK',
    label: 'TikTok',
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#000">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.83a8.2 8.2 0 004.79 1.54V6.9a4.85 4.85 0 01-1.02-.21z"/>
      </svg>
    ),
    color: 'border-gray-900 bg-gray-50',
    activeColor: 'ring-2 ring-gray-900 border-gray-900 bg-gray-100',
    available: true,
    idLabel: 'TikTok Creator ID',
    idPlaceholder: '예: 6890000000000000',
    tokenLabel: 'TikTok OAuth 2.0 Access Token',
    tokenPrefix: 'act.',
    tokenHint: 'developers.tiktok.com → OAuth 2.0 PKCE → video.publish 권한 필요',
  },
  {
    id: 'X',
    label: 'X (Twitter)',
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#000">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    color: 'border-gray-300 bg-gray-50',
    activeColor: 'ring-2 ring-gray-700 border-gray-700 bg-gray-50',
    available: true,
    idLabel: 'X (Twitter) 사용자 ID',
    idPlaceholder: '예: 1234567890',
    tokenLabel: 'X OAuth 2.0 Bearer Token',
    tokenPrefix: '',
    tokenHint: 'developer.twitter.com → OAuth 2.0 → tweet.write 권한 / Free tier: 월 1,500 트윗',
  },
  {
    id: 'YOUTUBE',
    label: 'YouTube',
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#FF0000">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    color: 'border-red-300 bg-red-50',
    activeColor: 'ring-2 ring-red-500 border-red-500 bg-red-50',
    available: false,
    idLabel: '',
    idPlaceholder: '',
    tokenLabel: '',
    tokenPrefix: '',
    tokenHint: '',
  },
];

/* ── 단계별 Facebook 가이드 ──────────────────────────── */
const FacebookPageIdGuide = () => (
  <div className="space-y-4 text-sm text-gray-700">
    <p className="font-semibold text-gray-900">Facebook 페이지 ID 찾는 방법</p>

    <div className="space-y-3">
      {[
        {
          step: 1,
          title: 'Facebook에 로그인',
          desc: 'facebook.com 에서 페이지를 관리하는 계정으로 로그인합니다.',
          highlight: null,
        },
        {
          step: 2,
          title: '관리하는 페이지로 이동',
          desc: '좌측 메뉴 → "페이지" 클릭 → 해당 페이지 선택',
          highlight: null,
        },
        {
          step: 3,
          title: '페이지 정보(About) 탭으로 이동',
          desc: '페이지 상단 메뉴에서 "정보" 또는 "About" 클릭',
          highlight: null,
        },
        {
          step: 4,
          title: '페이지 ID 확인',
          desc: '페이지 정보 하단 스크롤 → "페이지 ID" 항목에서 숫자를 복사합니다.',
          highlight: '예: 123456789012345',
        },
      ].map(({ step, title, desc, highlight }) => (
        <div key={step} className="flex gap-3">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold mt-0.5">
            {step}
          </div>
          <div>
            <p className="font-medium text-gray-800">{title}</p>
            <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
            {highlight && (
              <code className="inline-block mt-1 text-xs bg-gray-100 text-blue-700 px-2 py-0.5 rounded font-mono">
                {highlight}
              </code>
            )}
          </div>
        </div>
      ))}
    </div>

    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
      💡 <strong>빠른 방법:</strong> 브라우저 주소창에서 페이지 URL을 확인하세요.
      <br />
      <code className="font-mono">facebook.com/<strong>페이지이름</strong></code> 형태라면
      아래 방법으로도 ID를 찾을 수 있습니다.
      <br />
      <a
        href="https://www.facebook.com/help/1601732493643079"
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-blue-700 mt-1 inline-block"
      >
        Facebook 공식 도움말 보기 →
      </a>
    </div>
  </div>
);

export const FacebookTokenGuide = () => (
  <div className="space-y-4 text-sm text-gray-700">
    <p className="font-semibold text-gray-900">Facebook 페이지 액세스 토큰 발급 방법</p>

    <div className="space-y-3">
      {[
        {
          step: 1,
          title: 'Meta for Developers 접속',
          desc: 'developers.facebook.com 에 접속하고 로그인합니다.',
          link: 'https://developers.facebook.com',
          linkText: 'developers.facebook.com 열기 →',
        },
        {
          step: 2,
          title: '앱 선택 또는 생성',
          desc: '"내 앱" → 기존 앱 선택 (없으면 "앱 만들기" → "비즈니스" 선택)',
          link: null,
          linkText: null,
        },
        {
          step: 3,
          title: 'Graph API 탐색기 열기',
          desc: '상단 메뉴 → "도구" → "Graph API 탐색기" 클릭',
          link: 'https://developers.facebook.com/tools/explorer/',
          linkText: 'Graph API 탐색기 바로가기 →',
        },
        {
          step: 4,
          title: '페이지 액세스 토큰 생성',
          desc: '우측 상단 드롭다운에서 앱 선택 → "사용자 또는 페이지" 드롭다운 → 관리할 페이지 선택',
          link: null,
          linkText: null,
        },
        {
          step: 5,
          title: '권한 추가 후 토큰 생성',
          desc: '"권한 추가" 버튼 클릭 → pages_manage_posts, pages_read_engagement 선택 → "토큰 생성" 클릭',
          link: null,
          linkText: null,
        },
        {
          step: 6,
          title: '토큰 복사',
          desc: '생성된 토큰(EAAxxxxx... 로 시작)을 복사해서 아래 입력란에 붙여넣으세요.',
          link: null,
          linkText: null,
        },
      ].map(({ step, title, desc, link, linkText }) => (
        <div key={step} className="flex gap-3">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold mt-0.5">
            {step}
          </div>
          <div>
            <p className="font-medium text-gray-800">{title}</p>
            <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-1 text-xs text-blue-600 underline hover:text-blue-800"
              >
                {linkText}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>

    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
      ⚠️ <strong>주의:</strong> 단기 토큰(Short-lived, 약 1시간)은 곧 만료됩니다.
      <br />
      장기 토큰(Long-lived, 60일)을 발급받으려면 Graph API에서
      <code className="font-mono mx-1">oauth/access_token</code>
      엔드포인트를 통해 교환하세요.
      <br />
      <a
        href="https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived"
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-amber-700 mt-1 inline-block"
      >
        장기 토큰 발급 가이드 →
      </a>
    </div>
  </div>
);

/* ── 메인 컴포넌트 ─────────────────────────────────── */
export default function ChannelRegisterModal({ onClose, onSuccess }: ChannelRegisterModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [form, setForm] = useState({
    clientName: '',
    clientSlug: '',
    platform: 'FACEBOOK',
    channelName: '',
    pageId: '',
    accessToken: '',
    tokenExpiresAt: '',
  });
  const [showPageIdGuide, setShowPageIdGuide] = useState(false);
  const [showTokenGuide, setShowTokenGuide] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedPlatform = PLATFORMS.find(p => p.id === form.platform)!;

  /* ── 슬러그 자동 생성 ── */
  const handleClientNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    setForm(f => ({ ...f, clientName: name, clientSlug: slug }));
  };

  /* ── 최종 제출 ── */
  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/social-pulse/channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? '등록 실패');
      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
    } finally {
      setLoading(false);
    }
  };

  /* ── 단계별 진행 가능 여부 ── */
  const canProceed = () => {
    if (step === 1) return !!form.platform && PLATFORMS.find(p => p.id === form.platform)?.available;
    if (step === 2) return form.clientName.trim() && form.channelName.trim() && form.pageId.trim();
    if (step === 3) return form.accessToken.trim().length > 20;
    return false;
  };

  /* ── 진행 표시 바 ── */
  const StepIndicator = () => (
    <div className="flex items-center gap-1 mb-6">
      {[
        { n: 1, label: '플랫폼' },
        { n: 2, label: '페이지 정보' },
        { n: 3, label: '액세스 토큰' },
        { n: 4, label: '완료' },
      ].map(({ n, label }, i) => (
        <div key={n} className="flex items-center flex-1">
          <div className="flex flex-col items-center gap-1 flex-1">
            <div
              className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
                step > n
                  ? 'bg-green-500 text-white'
                  : step === n
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              {step > n ? (
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 111.414-1.414L8.414 12.172l7.879-7.879a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              ) : (
                n
              )}
            </div>
            <span className={`text-[10px] font-medium whitespace-nowrap ${step === n ? 'text-blue-600' : 'text-gray-400'}`}>
              {label}
            </span>
          </div>
          {i < 3 && (
            <div className={`h-0.5 w-4 mx-0.5 mb-4 transition-colors ${step > n ? 'bg-green-400' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );

  /* ── STEP 1: 플랫폼 선택 ── */
  const Step1 = () => (
    <div className="space-y-4">
      <div>
        <p className="text-base font-semibold text-gray-900 mb-1">어떤 SNS에 포스팅할까요?</p>
        <p className="text-sm text-gray-500">연동할 소셜 미디어 플랫폼을 선택하세요.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {PLATFORMS.map(platform => (
          <button
            key={platform.id}
            type="button"
            disabled={!platform.available}
            onClick={() => setForm(f => ({ ...f, platform: platform.id }))}
            className={`relative border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${
              !platform.available
                ? 'border-gray-200 bg-gray-50 opacity-40 cursor-not-allowed'
                : form.platform === platform.id
                ? platform.activeColor
                : `${platform.color} hover:shadow-md cursor-pointer`
            }`}
          >
            {!platform.available && (
              <span className="absolute top-2 right-2 text-[10px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-full font-medium">
                준비중
              </span>
            )}
            {platform.icon}
            <span className="text-sm font-semibold text-gray-800">{platform.label}</span>
            {form.platform === platform.id && platform.available && (
              <span className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                <svg viewBox="0 0 20 20" fill="white" className="w-3 h-3">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 111.414-1.414L8.414 12.172l7.879-7.879a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 플랫폼별 준비사항 안내 */}
      {form.platform === 'FACEBOOK' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
          <p className="font-semibold mb-1">Facebook 연동 준비사항</p>
          <ul className="space-y-1 text-xs text-blue-700 list-disc list-inside">
            <li>페이지 관리자 계정 + Meta for Developers 앱</li>
            <li>필요 권한: <code>pages_manage_posts</code>, <code>pages_read_engagement</code></li>
          </ul>
        </div>
      )}
      {form.platform === 'INSTAGRAM' && (
        <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 text-sm text-pink-800">
          <p className="font-semibold mb-1">Instagram 연동 준비사항</p>
          <ul className="space-y-1 text-xs text-pink-700 list-disc list-inside">
            <li>Instagram Business 또는 Creator 계정 (개인 계정 불가)</li>
            <li>Facebook 페이지와 연결된 상태여야 합니다</li>
            <li>필요 권한: <code>instagram_content_publish</code>, <code>instagram_basic</code></li>
            <li>이미지 포스팅 시 imageUrl 필수</li>
          </ul>
        </div>
      )}
      {form.platform === 'THREADS' && (
        <div className="bg-gray-50 border border-gray-300 rounded-xl p-4 text-sm text-gray-800">
          <p className="font-semibold mb-1">Threads 연동 준비사항</p>
          <ul className="space-y-1 text-xs text-gray-600 list-disc list-inside">
            <li>Instagram 계정이 있으면 동일한 Meta 앱에서 추가 가능</li>
            <li>필요 권한: <code>threads_basic</code>, <code>threads_content_publish</code></li>
            <li>최대 500자 텍스트 (이미지 선택)</li>
          </ul>
        </div>
      )}
      {form.platform === 'TIKTOK' && (
        <div className="bg-gray-50 border border-gray-900/20 rounded-xl p-4 text-sm text-gray-800">
          <p className="font-semibold mb-1">TikTok 연동 준비사항</p>
          <ul className="space-y-1 text-xs text-gray-600 list-disc list-inside">
            <li>TikTok 비즈니스/크리에이터 계정 필요</li>
            <li>developers.tiktok.com에서 앱 생성 후 OAuth 2.0 PKCE 인증</li>
            <li>필요 권한: <code>video.publish</code>, <code>video.upload</code></li>
            <li className="font-semibold text-orange-600">이미지 또는 영상 URL 필수 (텍스트 전용 불가)</li>
          </ul>
        </div>
      )}
      {form.platform === 'X' && (
        <div className="bg-gray-50 border border-gray-300 rounded-xl p-4 text-sm text-gray-800">
          <p className="font-semibold mb-1">X (Twitter) 연동 준비사항</p>
          <ul className="space-y-1 text-xs text-gray-600 list-disc list-inside">
            <li>developer.twitter.com에서 앱 생성 + OAuth 2.0 PKCE 인증</li>
            <li>필요 권한: <code>tweet.write</code>, <code>users.read</code></li>
            <li>Free tier: 월 1,500 트윗 쓰기 / Basic tier: $100/월</li>
            <li>최대 280자</li>
          </ul>
        </div>
      )}
    </div>
  );

  /* ── STEP 2: 페이지 정보 입력 ── */
  const Step2 = () => (
    <div className="space-y-4">
      <div>
        <p className="text-base font-semibold text-gray-900 mb-1">
          {selectedPlatform.label} 페이지 정보 입력
        </p>
        <p className="text-sm text-gray-500">채널 이름과 페이지 ID를 입력해주세요.</p>
      </div>

      {/* 채널 이름 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          브랜드/서비스 이름 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="예: SocialDoctors, 타운인"
          value={form.clientName}
          onChange={e => handleClientNameChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        {form.clientSlug && (
          <p className="text-xs text-gray-400 mt-1">슬러그: <code>{form.clientSlug}</code></p>
        )}
      </div>

      {/* 채널 표시명 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          채널 표시 이름 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="예: SocialDoctors 공식 페이지"
          value={form.channelName}
          onChange={e => setForm(f => ({ ...f, channelName: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* 페이지 ID */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-gray-700">
            {selectedPlatform.idLabel} <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={() => setShowPageIdGuide(g => !g)}
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 underline"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
            </svg>
            어디서 찾나요?
          </button>
        </div>

        <input
          type="text"
          placeholder={selectedPlatform.idPlaceholder}
          value={form.pageId}
          onChange={e => setForm(f => ({ ...f, pageId: e.target.value.trim() }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          required
        />

        {/* 인라인 가이드 */}
        {showPageIdGuide && (
          <div className="mt-3 bg-white border border-blue-200 rounded-xl p-4 shadow-sm">
            <FacebookPageIdGuide />
          </div>
        )}
      </div>
    </div>
  );

  /* ── STEP 3: 액세스 토큰 입력 ── */
  const Step3 = () => (
    <div className="space-y-4">
      <div>
        <p className="text-base font-semibold text-gray-900 mb-1">페이지 액세스 토큰 입력</p>
        <p className="text-sm text-gray-500">Meta Developers에서 발급받은 토큰을 붙여넣으세요.</p>
      </div>

      {/* 플랫폼별 토큰 힌트 */}
      {selectedPlatform.tokenHint && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
          <span className="font-semibold">발급 방법:</span> {selectedPlatform.tokenHint}
        </div>
      )}

      {/* Facebook/Instagram 가이드 토글 */}
      {(form.platform === 'FACEBOOK' || form.platform === 'INSTAGRAM') && (
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
              토큰 발급 단계별 가이드 보기
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

      {/* 토큰 입력 */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-gray-700">
            {selectedPlatform.tokenLabel} <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={() => setShowToken(s => !s)}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            {showToken ? '숨기기' : '보기'}
          </button>
        </div>
        <textarea
          placeholder="EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxx..."
          value={form.accessToken}
          onChange={e => setForm(f => ({ ...f, accessToken: e.target.value.trim() }))}
          rows={showToken ? 4 : 2}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono resize-none"
          style={{ WebkitTextSecurity: showToken ? 'none' : 'disc' } as React.CSSProperties}
          required
        />
        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-green-500">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
          </svg>
          AES-256 암호화로 안전하게 저장됩니다.
        </p>
      </div>

      {/* 만료일 (선택) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          토큰 만료일 <span className="text-gray-400 font-normal">(선택)</span>
        </label>
        <input
          type="date"
          value={form.tokenExpiresAt}
          min={new Date().toISOString().split('T')[0]}
          onChange={e => setForm(f => ({ ...f, tokenExpiresAt: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-400 mt-1">
          장기 토큰(Long-lived)은 발급일로부터 60일 후로 설정하세요.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 rounded-lg flex items-start gap-2">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0 mt-0.5">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
          </svg>
          {error}
        </div>
      )}
    </div>
  );

  /* ── STEP 4: 완료 ── */
  const Step4 = () => (
    <div className="flex flex-col items-center text-center py-4 space-y-4">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={2.5} className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <div>
        <p className="text-xl font-bold text-gray-900">채널 등록 완료!</p>
        <p className="text-sm text-gray-500 mt-1">
          <strong>{form.channelName}</strong>이(가) 성공적으로 연동되었습니다.
        </p>
      </div>

      <div className="w-full bg-gray-50 rounded-xl border p-4 text-left space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">브랜드</span>
          <span className="font-medium text-gray-800">{form.clientName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">채널명</span>
          <span className="font-medium text-gray-800">{form.channelName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">플랫폼</span>
          <span className="font-medium text-gray-800">{selectedPlatform.label}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">페이지 ID</span>
          <code className="font-mono text-blue-700 text-xs">{form.pageId}</code>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700 w-full text-left">
        <p className="font-semibold mb-1">다음 단계</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>좌측 채널 목록에서 토글이 <strong>활성화</strong> 상태인지 확인하세요.</li>
          <li>우측 상단 <strong>"+ 새 포스트 작성"</strong> 버튼으로 첫 포스팅을 시작하세요!</li>
        </ul>
      </div>

      <button
        type="button"
        onClick={() => { onSuccess(); onClose(); }}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        SNS 발행 관리로 돌아가기
      </button>
    </div>
  );

  /* ── 렌더 ── */
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">

        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b px-6 pt-6 pb-4 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">SNS 채널 연동</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
          <StepIndicator />
        </div>

        {/* 본문 */}
        <div className="px-6 py-4">
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 />}
          {step === 4 && <Step4 />}
        </div>

        {/* 하단 버튼 (완료 단계 제외) */}
        {step < 4 && (
          <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex gap-3">
            <button
              type="button"
              onClick={() => step > 1 ? setStep(s => (s - 1) as 1 | 2 | 3 | 4) : onClose()}
              className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
            >
              {step === 1 ? '취소' : '← 이전'}
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(s => (s + 1) as 1 | 2 | 3 | 4)}
                disabled={!canProceed()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-xl transition-colors"
              >
                다음 →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !canProceed()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    등록 중...
                  </>
                ) : (
                  '채널 등록하기 ✓'
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
