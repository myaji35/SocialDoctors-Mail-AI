'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface SaasProduct {
  id: string;
  name: string;
  overview: string;
  url: string;
  testUrl?: string | null;
  partners: string[];
  thumbnail?: string | null;
  category: string;
  isActive: boolean;
  launchDate?: string | null;
  fundingTarget?: number | null;
  fundingRaised?: number | null;
  fundingEquity?: number | null;
  planeIssueId?: string | null;
  planeProjectId?: string | null;
}

const SAAS_APPS = [
  { slug: 'social-pulse', name: 'Social Pulse', desc: '소셜 미디어 자동화' },
  { slug: 'partner-hub', name: 'Partner Hub', desc: '파트너 관리' },
  { slug: 'content-ai', name: 'Content AI', desc: 'AI 콘텐츠 생성' },
  { slug: 'insight-board', name: 'Insight Board', desc: 'BI 대시보드' },
  { slug: 'crm-pro', name: 'CRM Pro', desc: '고객 관계 관리' },
  { slug: 'pay-flow', name: 'Pay Flow', desc: '통합 결제 시스템' },
  { slug: 'mail-rocket', name: 'Mail Rocket', desc: '이메일 마케팅' },
  { slug: 'shop-builder', name: 'Shop Builder', desc: '커머스 빌더' },
  { slug: 'form-wizard', name: 'Form Wizard', desc: '설문/폼 빌더' },
  { slug: 'task-flow', name: 'Task Flow', desc: '프로젝트 관리' },
];

const CATEGORIES = ['AI', '마케팅', '파트너 관리', '분석', 'CRM', '결제', '이메일', '커머스', '설문', '프로젝트 관리', '기타'];

// ── 공통 폼 행 레이아웃 ──────────────────────────────────────────
function FormRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 py-5 border-b border-gray-200 last:border-0">
      <div className="sm:w-52 shrink-0 pt-0.5">
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        {hint && <p className="mt-0.5 text-xs text-gray-400 leading-relaxed">{hint}</p>}
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

// ── 섹션 카드 ────────────────────────────────────────────────────
function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-gray-50">
        <span className="text-gray-500">{icon}</span>
        <h2 className="text-base font-bold text-gray-900">{title}</h2>
      </div>
      <div className="px-6 divide-y divide-gray-100">{children}</div>
    </div>
  );
}

// ── 입력 공통 스타일 ─────────────────────────────────────────────
const inputCls =
  'w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white';

export default function MarketplaceAdminPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<SaasProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [form, setForm] = useState({
    name: '',
    overview: '',
    url: '',
    testUrl: '',
    category: '',
    launchDate: '',
    fundingTarget: '',
    fundingRaised: '',
    fundingEquity: '',
    planeProjectId: '',
    partners: '',
  });

  const [linkedApps, setLinkedApps] = useState<string[]>([]);

  useEffect(() => { fetchProduct(); }, [id]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/saas/${id}`);
      const result = await res.json();
      if (result.success) {
        const p: SaasProduct = result.data;
        setProduct(p);
        setForm({
          name: p.name ?? '',
          overview: p.overview ?? '',
          url: p.url ?? '',
          testUrl: p.testUrl ?? '',
          category: p.category ?? '',
          launchDate: p.launchDate ? p.launchDate.split('T')[0] : '',
          fundingTarget: p.fundingTarget != null ? String(p.fundingTarget) : '',
          fundingRaised: p.fundingRaised != null ? String(p.fundingRaised) : '',
          fundingEquity: p.fundingEquity != null ? String(p.fundingEquity) : '',
          planeProjectId: p.planeProjectId ?? '',
          partners: (p.partners ?? []).filter(s => !SAAS_APPS.find(a => a.slug === s)).join(', '),
        });
        setLinkedApps(SAAS_APPS.filter(a => (p.partners ?? []).includes(a.slug)).map(a => a.slug));
      }
    } catch (err) {
      console.error('Failed to fetch product:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleLinkedApp = (slug: string) => {
    setLinkedApps(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const manualPartners = form.partners.split(',').map(p => p.trim()).filter(Boolean);
      const allPartners = [...new Set([...manualPartners, ...linkedApps])];

      const body = {
        name: form.name,
        overview: form.overview,
        url: form.url,
        testUrl: form.testUrl || null,
        category: form.category,
        partners: allPartners,
        launchDate: form.launchDate || null,
        fundingTarget: form.fundingTarget !== '' ? Number(form.fundingTarget) : null,
        fundingRaised: form.fundingRaised !== '' ? Number(form.fundingRaised) : 0,
        fundingEquity: form.fundingEquity !== '' ? Number(form.fundingEquity) : null,
        planeProjectId: form.planeProjectId || null,
        planeIssueId: product?.planeIssueId ?? null,
        thumbnail: product?.thumbnail ?? null,
      };

      const res = await fetch(`/api/saas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      if (result.success) {
        setSaveMessage({ type: 'success', text: '저장되었습니다.' });
        setProduct(result.data);
      } else {
        setSaveMessage({ type: 'error', text: result.error ?? '저장 실패' });
      }
    } catch {
      setSaveMessage({ type: 'error', text: '네트워크 오류가 발생했습니다.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  // ── 펀딩 진행률 ──────────────────────────────────────────────
  const fundingProgress =
    form.fundingTarget && Number(form.fundingTarget) > 0
      ? Math.min(100, (Number(form.fundingRaised) / Number(form.fundingTarget)) * 100)
      : 0;

  // ── D-Day 계산 ───────────────────────────────────────────────
  const dDay = form.launchDate
    ? (() => {
        const diff = Math.ceil((new Date(form.launchDate).getTime() - Date.now()) / 86400000);
        return diff > 0 ? `D-${diff}` : diff === 0 ? 'D-Day' : `D+${Math.abs(diff)}`;
      })()
    : null;

  // ── 로딩 ─────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">제품을 찾을 수 없습니다.</p>
          <Link href="/" className="text-blue-600 hover:underline text-sm">홈으로 돌아가기</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Sticky Top Bar ── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* 브레드크럼 */}
          <div className="flex items-center gap-2 text-sm">
            <Link href="/#saas" className="text-gray-400 hover:text-gray-600 transition-colors flex items-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-500">마켓플레이스 관리</span>
            <span className="text-gray-300">/</span>
            <span className="font-semibold text-gray-800 truncate max-w-40">{product.name}</span>
          </div>

          {/* 액션 */}
          <div className="flex items-center gap-3">
            {saveMessage && (
              <span className={`text-sm font-medium ${saveMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                {saveMessage.text}
              </span>
            )}
            <Link
              href={`/saas/${id}`}
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-gray-300 hover:text-gray-800 transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
              </svg>
              미리보기
            </Link>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
            >
              {isSaving ? (
                <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />저장 중</>
              ) : (
                <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>저장</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">

        {/* ── 1. 기본 정보 ── */}
        <Section
          title="기본 정보"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          }
        >
          <FormRow label="프로젝트명">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="예: CertiGraph"
              className={inputCls}
            />
          </FormRow>

          <FormRow label="카테고리">
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={inputCls}
            >
              <option value="">선택하세요</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </FormRow>

          <FormRow label="상세 설명" hint="마켓플레이스 카드 하단에 노출되는 서비스 소개문입니다.">
            <textarea
              name="overview"
              value={form.overview}
              onChange={handleChange}
              rows={5}
              placeholder="서비스 핵심 가치와 특장점을 입력하세요..."
              className={`${inputCls} resize-none`}
            />
            <p className="mt-1.5 text-xs text-gray-400 text-right">{form.overview.length}자</p>
          </FormRow>

          <FormRow label="파트너" hint="조직명 또는 팀명을 쉼표로 구분해 입력하세요.">
            <input
              type="text"
              name="partners"
              value={form.partners}
              onChange={handleChange}
              placeholder="Gagahoho, Inc., SocialDoctors"
              className={inputCls}
            />
          </FormRow>
        </Section>

        {/* ── 2. URL 관리 ── */}
        <Section
          title="URL 관리"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </svg>
          }
        >
          <FormRow label="서비스 URL" hint={`외부 서비스: https://... \n내부 경로: /saas/apps/...`}>
            <input
              type="text"
              name="url"
              value={form.url}
              onChange={handleChange}
              placeholder="https://exams.townin.net"
              className={`${inputCls} font-mono`}
            />
          </FormRow>

          <FormRow label="테스트 URL" hint="스테이징 또는 데모 서버 주소 (선택)">
            <input
              type="text"
              name="testUrl"
              value={form.testUrl}
              onChange={handleChange}
              placeholder="https://staging.example.com"
              className={`${inputCls} font-mono`}
            />
          </FormRow>
        </Section>

        {/* ── 3. 런칭 일정 ── */}
        <Section
          title="런칭 일정"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          }
        >
          <FormRow label="런칭 예정일" hint="공개 서비스 출시 예정일을 선택하세요.">
            <div className="flex items-center gap-4">
              <input
                type="date"
                name="launchDate"
                value={form.launchDate}
                onChange={handleChange}
                className={`${inputCls} max-w-xs`}
              />
              {dDay && (
                <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${
                  dDay === 'D-Day'
                    ? 'bg-green-600 text-white'
                    : dDay.startsWith('D-')
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {dDay}
                </span>
              )}
            </div>
          </FormRow>
        </Section>

        {/* ── 4. 펀딩 규모 ── */}
        <Section
          title="펀딩 규모"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
          }
        >
          {/* 진행률 바 */}
          {form.fundingTarget && Number(form.fundingTarget) > 0 && (
            <div className="py-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">모집 진행률</span>
                <span className="text-sm font-bold text-blue-600">{fundingProgress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${fundingProgress}%` }}
                />
              </div>
              <div className="flex justify-between mt-1.5 text-xs text-gray-400">
                <span>{Number(form.fundingRaised || 0).toLocaleString('ko-KR')}원 모집</span>
                <span>목표 {Number(form.fundingTarget).toLocaleString('ko-KR')}원</span>
              </div>
            </div>
          )}

          <FormRow label="모집 예정 금액" hint="투자 목표 금액 (원 단위)">
            <div className="relative max-w-xs">
              <input
                type="number"
                name="fundingTarget"
                value={form.fundingTarget}
                onChange={handleChange}
                placeholder="50000000"
                className={`${inputCls} pr-10`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">₩</span>
            </div>
            {form.fundingTarget && (
              <p className="mt-1.5 text-xs text-gray-500 font-medium">
                = {Number(form.fundingTarget).toLocaleString('ko-KR')}원
              </p>
            )}
          </FormRow>

          <FormRow label="모집 금액" hint="현재까지 실제 모집된 금액 (원 단위)">
            <div className="relative max-w-xs">
              <input
                type="number"
                name="fundingRaised"
                value={form.fundingRaised}
                onChange={handleChange}
                placeholder="0"
                className={`${inputCls} pr-10`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">₩</span>
            </div>
            {form.fundingRaised && (
              <p className="mt-1.5 text-xs text-gray-500 font-medium">
                = {Number(form.fundingRaised).toLocaleString('ko-KR')}원
              </p>
            )}
          </FormRow>

          <FormRow label="오픈 지분" hint="투자자에게 제공하는 지분 비율">
            <div className="relative max-w-48">
              <input
                type="number"
                name="fundingEquity"
                value={form.fundingEquity}
                onChange={handleChange}
                placeholder="10"
                min="0"
                max="100"
                step="0.1"
                className={`${inputCls} pr-10`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">%</span>
            </div>
          </FormRow>
        </Section>

        {/* ── 5. 10 SaaS 대시보드 연결 ── */}
        <Section
          title="10 SaaS 대시보드 연결"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
          }
        >
          <FormRow label="Plane 프로젝트 ID" hint="이슈 트래킹 연동에 사용되는 프로젝트 식별자">
            <input
              type="text"
              name="planeProjectId"
              value={form.planeProjectId}
              onChange={handleChange}
              placeholder="SOCIA"
              className={`${inputCls} max-w-40 font-mono uppercase`}
            />
          </FormRow>

          <FormRow label="연결할 SaaS 앱" hint="이 제품과 연동할 앱을 선택하세요. 선택한 앱의 slug가 파트너 목록에 추가됩니다.">
            <div className="grid grid-cols-2 gap-2">
              {SAAS_APPS.map(app => {
                const on = linkedApps.includes(app.slug);
                return (
                  <button
                    key={app.slug}
                    type="button"
                    onClick={() => toggleLinkedApp(app.slug)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 text-left transition-all ${
                      on
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div>
                      <p className={`text-sm font-semibold ${on ? 'text-blue-700' : 'text-gray-700'}`}>{app.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{app.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-3 ${
                      on ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}>
                      {on && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            {linkedApps.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {linkedApps.map(slug => (
                  <Link
                    key={slug}
                    href={`/saas/apps/${slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-all"
                  >
                    {SAAS_APPS.find(a => a.slug === slug)?.name}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                      <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </Link>
                ))}
              </div>
            )}
          </FormRow>
        </Section>

        {/* ── 하단 저장 버튼 ── */}
        <div className="flex items-center justify-end gap-3 pb-12">
          <Link
            href={`/saas/${id}`}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-gray-300 hover:text-gray-800 transition-all"
          >
            취소
          </Link>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
          >
            {isSaving ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />저장 중...</>
            ) : (
              '변경사항 저장'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
