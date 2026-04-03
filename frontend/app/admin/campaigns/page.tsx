'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

/* ── Types ───────────────────────────────────────────────────────── */

interface CampaignItem {
  id: string;
  type: string;
  platform?: string;
  status: string;
}

interface Campaign {
  id: string;
  callerApp: string;
  clientName: string;
  clientSlug: string;
  type: string;
  status: string;
  title: string;
  description?: string | null;
  budget: number;
  platforms: string[];
  postsCount: number;
  cardNewsCount: number;
  requestedAt: string;
  approvedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
  items: CampaignItem[];
}

interface Stats {
  total: number;
  totalBudget: number;
  totalPosts: number;
  totalCardNews: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
  topCallerApps: Array<{ callerApp: string; count: number }>;
}

/* ── Status helpers ──────────────────────────────────────────────── */

const STATUS_LABEL: Record<string, string> = {
  REQUESTED: '요청',
  APPROVED: '승인',
  IN_PROGRESS: '진행중',
  COMPLETED: '완료',
  CANCELED: '취소',
};

const STATUS_BADGE: Record<string, string> = {
  REQUESTED: 'bg-yellow-500 text-white',
  APPROVED: 'bg-blue-500 text-white',
  IN_PROGRESS: 'bg-purple-600 text-white',
  COMPLETED: 'bg-green-600 text-white',
  CANCELED: 'bg-red-500 text-white',
};

const TYPE_LABEL: Record<string, string> = {
  SNS_POST: 'SNS 포스팅',
  CARD_NEWS: '카드뉴스',
  AI_COPY: 'AI 카피',
  FULL_PACKAGE: '풀 패키지',
};

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  REQUESTED: ['APPROVED', 'CANCELED'],
  APPROVED: ['IN_PROGRESS', 'CANCELED'],
  IN_PROGRESS: ['COMPLETED', 'CANCELED'],
  COMPLETED: ['CANCELED'],
  CANCELED: [],
};

/* ── Feather-style SVG Icons ─────────────────────────────────────── */

function IconArrowLeft({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function IconBriefcase({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
    </svg>
  );
}

function IconActivity({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function IconCheckCircle({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function IconDollarSign({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  );
}

function IconRefresh({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
    </svg>
  );
}

/* ── Formatters ──────────────────────────────────────────────────── */

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function formatBudget(amount: number) {
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(amount % 10000 === 0 ? 0 : 1)}만원`;
  }
  return `${amount.toLocaleString('ko-KR')}원`;
}

/* ── Main Component ──────────────────────────────────────────────── */

export default function AdminCampaignsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  /* ── Auth check ────────────────────────────────────────────────── */
  useEffect(() => {
    fetch('/api/admin/auth/check', { credentials: 'include' })
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          window.location.href = '/admin';
        }
      })
      .catch(() => {
        window.location.href = '/admin';
      });
  }, []);

  /* ── Data fetching ─────────────────────────────────────────────── */
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [statsRes, campaignsRes] = await Promise.all([
        fetch('/api/campaigns/stats', { credentials: 'include' }),
        fetch('/api/campaigns?limit=50', { credentials: 'include' }),
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
      }
      if (campaignsRes.ok) {
        const data = await campaignsRes.json();
        setCampaigns(data.campaigns ?? []);
      }
    } catch (err) {
      console.error('Failed to fetch campaign data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  /* ── Status update ─────────────────────────────────────────────── */
  const handleStatusChange = async (campaignId: string, newStatus: string) => {
    if (updatingId) return;
    setUpdatingId(campaignId);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        await fetchData();
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error ?? '상태 변경에 실패했습니다.');
      }
    } catch {
      alert('상태 변경 중 오류가 발생했습니다.');
    } finally {
      setUpdatingId(null);
    }
  };

  /* ── Loading / unauth guard ────────────────────────────────────── */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A1E0]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#00A1E0] mb-3 transition-colors"
            >
              <IconArrowLeft className="w-4 h-4" />
              관리자 대시보드
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">홍보대행 관리</h1>
            <p className="mt-1 text-gray-600 text-sm">
              외부 프로젝트 캠페인 요청을 관리하고 상태를 추적합니다
            </p>
          </div>
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <IconRefresh className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            새로고침
          </button>
        </div>

        {isLoading && !stats ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A1E0]" />
          </div>
        ) : (
          <>
            {/* ── KPI Cards ──────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <IconBriefcase className="w-5 h-5 text-[#00A1E0]" />
                  </div>
                  <span className="text-xs font-semibold text-gray-600">총 캠페인</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.total ?? 0}
                  <span className="text-sm font-normal text-gray-500 ml-1">건</span>
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-purple-50">
                    <IconActivity className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-xs font-semibold text-gray-600">진행중</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {(stats?.byStatus?.IN_PROGRESS ?? 0) + (stats?.byStatus?.APPROVED ?? 0)}
                  <span className="text-sm font-normal text-gray-500 ml-1">건</span>
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-green-50">
                    <IconCheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-xs font-semibold text-gray-600">완료</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.byStatus?.COMPLETED ?? 0}
                  <span className="text-sm font-normal text-gray-500 ml-1">건</span>
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-yellow-50">
                    <IconDollarSign className="w-5 h-5 text-yellow-600" />
                  </div>
                  <span className="text-xs font-semibold text-gray-600">총 예산</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatBudget(stats?.totalBudget ?? 0)}
                </p>
              </motion.div>
            </div>

            {/* ── callerApp Stats Table ──────────────────────────── */}
            {stats && stats.topCallerApps.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl border border-gray-200 mb-8"
              >
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900">프로젝트별 통계</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                          프로젝트 (callerApp)
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">
                          캠페인 수
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {stats.topCallerApps.map((app) => (
                        <tr key={app.callerApp} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-3 text-sm font-medium text-gray-900">
                            {app.callerApp}
                          </td>
                          <td className="px-6 py-3 text-sm text-gray-700 text-right">
                            {app.count}건
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ── Campaign List ──────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-xl border border-gray-200"
            >
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">최근 캠페인 목록</h2>
                <span className="text-xs font-medium text-gray-500">
                  총 {campaigns.length}건
                </span>
              </div>

              {campaigns.length === 0 ? (
                <div className="px-6 py-16 text-center text-gray-500 text-sm">
                  등록된 캠페인이 없습니다.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                          제목
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                          프로젝트
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                          유형
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                          상태
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                          플랫폼
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">
                          예산
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                          생성일
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                          작업
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {campaigns.map((c) => {
                        const transitions = ALLOWED_TRANSITIONS[c.status] ?? [];
                        const nextPositive = transitions.find((t) => t !== 'CANCELED');
                        return (
                          <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                            {/* Title + client */}
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900 max-w-[240px] truncate">
                                {c.title}
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                {c.clientName}
                              </div>
                            </td>

                            {/* callerApp */}
                            <td className="px-6 py-4 text-sm text-gray-700">
                              {c.callerApp}
                            </td>

                            {/* Type */}
                            <td className="px-6 py-4">
                              <span className="text-xs text-gray-700">
                                {TYPE_LABEL[c.type] ?? c.type}
                              </span>
                            </td>

                            {/* Status badge */}
                            <td className="px-6 py-4">
                              <span
                                className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE[c.status] ?? 'bg-gray-500 text-white'}`}
                              >
                                {STATUS_LABEL[c.status] ?? c.status}
                              </span>
                            </td>

                            {/* Platforms */}
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                {c.platforms.map((p) => (
                                  <span
                                    key={p}
                                    className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-gray-600 text-white"
                                  >
                                    {p}
                                  </span>
                                ))}
                              </div>
                            </td>

                            {/* Budget */}
                            <td className="px-6 py-4 text-sm text-gray-700 text-right whitespace-nowrap">
                              {formatBudget(c.budget)}
                            </td>

                            {/* Date */}
                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                              {formatDate(c.createdAt)}
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                {nextPositive && (
                                  <button
                                    disabled={updatingId === c.id}
                                    onClick={() => handleStatusChange(c.id, nextPositive)}
                                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#00A1E0] text-white hover:bg-[#0090c8] transition-colors disabled:opacity-50"
                                  >
                                    {updatingId === c.id
                                      ? '...'
                                      : STATUS_LABEL[nextPositive] ?? nextPositive}
                                  </button>
                                )}
                                {transitions.includes('CANCELED') && c.status !== 'CANCELED' && (
                                  <button
                                    disabled={updatingId === c.id}
                                    onClick={() => {
                                      if (confirm('이 캠페인을 취소하시겠습니까?')) {
                                        handleStatusChange(c.id, 'CANCELED');
                                      }
                                    }}
                                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-red-300 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                                  >
                                    취소
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
