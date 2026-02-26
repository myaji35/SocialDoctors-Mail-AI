'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';

interface SaasProduct {
  id: string;
  name: string;
  overview: string;
  url: string;
  partners: string[];
  thumbnail?: string;
  category: string;
  isActive?: boolean;
  planeIssueId?: string | null;
  planeProjectId?: string | null;
}

interface PlaneIssue {
  id: string;
  name: string;
  priority?: string;
  state_detail?: { name: string; color: string; group: string };
  created_at?: string;
}

interface FeedbackReply {
  id: string;
  author: string;
  content: string;
  isAdmin: boolean;
  createdAt: string;
}

interface Feedback {
  id: string;
  productId: string;
  author: string;
  content: string;
  rating: number;
  createdAt: string;
  authorKey?: string;
  replies?: FeedbackReply[];
}

// CertiGraph 프로젝트 기획 이슈 (Plane fallback)
const CERTIGRAPH_FALLBACK_ISSUES: PlaneIssue[] = [
  // Epic
  { id: 'cg-e1', name: '[Epic] PDF → Knowledge Graph 파이프라인 고도화', priority: 'urgent',
    state_detail: { name: '진행중', color: '#3B82F6', group: 'started' } },
  { id: 'cg-e2', name: '[Epic] 자격증 확장 — 요양보호사·간호조무사 추가', priority: 'high',
    state_detail: { name: '백로그', color: '#94A3B8', group: 'backlog' } },
  { id: 'cg-e3', name: '[Epic] SocialDoctors 파트너 채널 통합', priority: 'high',
    state_detail: { name: '백로그', color: '#94A3B8', group: 'backlog' } },
  { id: 'cg-e4', name: '[Epic] 결제 시스템 — Toss Payments 실연동', priority: 'urgent',
    state_detail: { name: '진행중', color: '#3B82F6', group: 'started' } },
  // Story
  { id: 'cg-s1', name: '[Story] 수험생 수요 조사 설문 → CRM 연동', priority: 'medium',
    state_detail: { name: '완료', color: '#22C55E', group: 'completed' } },
  { id: 'cg-s2', name: '[Story] Knowledge Graph 3D 시각화 성능 최적화', priority: 'high',
    state_detail: { name: '진행중', color: '#3B82F6', group: 'started' } },
  { id: 'cg-s3', name: '[Story] AI 합격 예측 모델 정확도 개선 (GPT-4o 전환)', priority: 'medium',
    state_detail: { name: '백로그', color: '#94A3B8', group: 'backlog' } },
  { id: 'cg-s4', name: '[Story] 오답노트 → SNS 공유 기능 (Social Pulse 연동)', priority: 'medium',
    state_detail: { name: '백로그', color: '#94A3B8', group: 'backlog' } },
  { id: 'cg-s5', name: '[Story] 파트너 레퍼럴 링크 → CertiGraph 첫 달 할인 자동 적용', priority: 'high',
    state_detail: { name: '진행중', color: '#3B82F6', group: 'started' } },
  // Task
  { id: 'cg-t1', name: '[Task] SQLite → PostgreSQL 프로덕션 마이그레이션', priority: 'urgent',
    state_detail: { name: '완료', color: '#22C55E', group: 'completed' } },
  { id: 'cg-t2', name: '[Task] Upstage OCR 파싱 정확도 95% → 99% 개선', priority: 'high',
    state_detail: { name: '진행중', color: '#3B82F6', group: 'started' } },
  { id: 'cg-t3', name: '[Task] 모바일 반응형 CBT UI 개선 (375px 대응)', priority: 'medium',
    state_detail: { name: '백로그', color: '#94A3B8', group: 'backlog' } },
  { id: 'cg-t4', name: '[Task] 펀딩 페이지 Toss 결제 버튼 실연동', priority: 'urgent',
    state_detail: { name: '진행중', color: '#3B82F6', group: 'started' } },
  { id: 'cg-t5', name: '[Task] 합격자 수기 수집 → Content AI 자동 블로그 생성', priority: 'medium',
    state_detail: { name: '백로그', color: '#94A3B8', group: 'backlog' } },
  { id: 'cg-t6', name: '[Task] 뉴스레터 수험생 시퀀스 Mail Rocket 세팅', priority: 'medium',
    state_detail: { name: '완료', color: '#22C55E', group: 'completed' } },
];

export default function SaasDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<SaasProduct | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackForm, setFeedbackForm] = useState({
    author: '',
    content: '',
    rating: 5,
  });
  const [authorKey, setAuthorKey] = useState<string>('');
  const [editingFeedbackId, setEditingFeedbackId] = useState<string | null>(null);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<string>('');
  const [investorCount] = useState(37);
  const maxInvestors = 100;
  const [planeIssues, setPlaneIssues] = useState<PlaneIssue[]>([]);
  const [planeLoading, setPlaneLoading] = useState(false);
  const [editingIssueId, setEditingIssueId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; priority: string; group: string }>({ name: '', priority: 'medium', group: 'backlog' });
  const [addingIssue, setAddingIssue] = useState(false);
  const [newIssueForm, setNewIssueForm] = useState({ name: '', priority: 'medium', group: 'backlog' });

  // 작성자 식별 키 생성/로드
  useEffect(() => {
    let key = localStorage.getItem('feedbackAuthorKey');
    if (!key) {
      key = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('feedbackAuthorKey', key);
    }
    setAuthorKey(key);
  }, []);

  useEffect(() => {
    fetchProduct();
    fetchFeedbacks();
    fetchPlaneIssues();
  }, [params.id]);

  const fetchPlaneIssues = async () => {
    setPlaneLoading(true);
    try {
      const res = await fetch('/api/plane/issues');
      const data = await res.json();
      if (data.success && data.data?.length > 0) {
        setPlaneIssues(data.data);
      } else {
        // Plane 응답 없음 → CertiGraph 기획 fallback 이슈
        setPlaneIssues(CERTIGRAPH_FALLBACK_ISSUES);
      }
    } catch {
      setPlaneIssues(CERTIGRAPH_FALLBACK_ISSUES);
    } finally {
      setPlaneLoading(false);
    }
  };

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/saas/${params.id}`);
      const result = await response.json();
      if (result.success) {
        setProduct(result.data);
      } else {
        alert('제품을 찾을 수 없습니다.');
        router.push('/');
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      alert('제품 정보를 불러오는데 실패했습니다.');
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch(`/api/feedback?productId=${params.id}`);
      const result = await response.json();
      if (result.success) {
        setFeedbacks(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch feedbacks:', error);
    }
  };

  // Plane 이슈 수정 시작
  const handleStartEditIssue = (issue: PlaneIssue) => {
    setEditingIssueId(issue.id);
    setEditForm({
      name: issue.name,
      priority: issue.priority || 'medium',
      group: issue.state_detail?.group || 'backlog',
    });
  };

  // Plane 이슈 수정 저장 (로컬 상태 업데이트)
  const handleSaveIssue = (id: string) => {
    const stateMap: Record<string, { name: string; color: string; group: string }> = {
      completed: { name: '완료', color: '#22C55E', group: 'completed' },
      started:   { name: '진행중', color: '#3B82F6', group: 'started' },
      backlog:   { name: '백로그', color: '#94A3B8', group: 'backlog' },
    };
    setPlaneIssues((prev) =>
      prev.map((issue) =>
        issue.id === id
          ? { ...issue, name: editForm.name, priority: editForm.priority, state_detail: stateMap[editForm.group] }
          : issue
      )
    );
    setEditingIssueId(null);
  };

  // Plane 이슈 삭제
  const handleDeleteIssue = (id: string) => {
    setPlaneIssues((prev) => prev.filter((issue) => issue.id !== id));
  };

  // 새 이슈 추가
  const handleAddIssue = () => {
    if (!newIssueForm.name.trim()) return;
    const stateMap: Record<string, { name: string; color: string; group: string }> = {
      completed: { name: '완료', color: '#22C55E', group: 'completed' },
      started:   { name: '진행중', color: '#3B82F6', group: 'started' },
      backlog:   { name: '백로그', color: '#94A3B8', group: 'backlog' },
    };
    const newIssue: PlaneIssue = {
      id: `local-${Date.now()}`,
      name: newIssueForm.name,
      priority: newIssueForm.priority,
      state_detail: stateMap[newIssueForm.group],
    };
    setPlaneIssues((prev) => [newIssue, ...prev]);
    setNewIssueForm({ name: '', priority: 'medium', group: 'backlog' });
    setAddingIssue(false);
  };

  // 이름 모자이크 처리 함수
  const maskName = (name: string): string => {
    if (name.length <= 2) {
      // 2글자 이하: 첫 글자만 표시
      return name[0] + '*';
    } else if (name.length === 3) {
      // 3글자: 첫 글자 + * + 마지막 글자
      return name[0] + '*' + name[2];
    } else {
      // 4글자 이상: 첫 글자 + ** + 마지막 글자
      return name[0] + '**' + name[name.length - 1];
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!feedbackForm.author || !feedbackForm.content) {
      alert('이름과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      if (editingFeedbackId) {
        // 수정 모드
        const response = await fetch(`/api/feedback/${editingFeedbackId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: feedbackForm.content,
            rating: feedbackForm.rating,
            authorKey,
          }),
        });

        const result = await response.json();
        if (result.success) {
          alert('피드백이 수정되었습니다!');
          setEditingFeedbackId(null);
          setFeedbackForm({ author: '', content: '', rating: 5 });
          fetchFeedbacks();
        } else {
          alert(result.error || '수정 실패');
        }
      } else {
        // 새 피드백 작성
        const response = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: params.id,
            ...feedbackForm,
            authorKey,
          }),
        });

        const result = await response.json();
        if (result.success) {
          alert('피드백이 등록되었습니다!');
          setFeedbackForm({ author: '', content: '', rating: 5 });
          fetchFeedbacks();
        }
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      alert('피드백 등록에 실패했습니다.');
    }
  };

  const handleEditFeedback = (feedback: Feedback) => {
    setEditingFeedbackId(feedback.id);
    setFeedbackForm({
      author: feedback.author,
      content: feedback.content,
      rating: feedback.rating,
    });
    // 폼으로 스크롤
    window.scrollTo({ top: document.getElementById('feedback-form')?.offsetTop || 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingFeedbackId(null);
    setFeedbackForm({ author: '', content: '', rating: 5 });
  };

  const handleDeleteFeedback = async (feedbackId: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/feedback/${feedbackId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorKey }),
      });

      const result = await response.json();
      if (result.success) {
        alert('피드백이 삭제되었습니다.');
        fetchFeedbacks();
      } else {
        alert(result.error || '삭제 실패');
      }
    } catch (error) {
      console.error('Failed to delete feedback:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleSubmitReply = async (feedbackId: string) => {
    if (!replyContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      const isAdmin = sessionStorage.getItem('adminAuth') === 'true';

      const response = await fetch(`/api/feedback/${feedbackId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: isAdmin ? '관리자' : '익명',
          content: replyContent,
          isAdmin,
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert('댓글이 등록되었습니다!');
        setReplyContent('');
        setReplyingToId(null);
        fetchFeedbacks();
      }
    } catch (error) {
      console.error('Failed to submit reply:', error);
      alert('댓글 등록에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={() => router.push('/')}
              className="mb-6 flex items-center text-white/80 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              홈으로 돌아가기
            </button>

            <span className="inline-block px-3 py-1 bg-white/20 text-white text-sm font-semibold rounded-full mb-4">
              {product.category}
            </span>

            <h1 className="text-5xl font-bold mb-4">{product.name}</h1>
            <p className="text-xl text-white/90 max-w-3xl">{product.overview}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white text-primary-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center"
              >
                웹사이트 방문하기
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Thumbnail */}
            {product.thumbnail && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
              >
                <img
                  src={product.thumbnail}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                />
              </motion.div>
            )}

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제품 소개</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {product.overview}
              </p>
            </motion.div>

            {/* Plane 프로젝트 현황 섹션 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    프로젝트 현황
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Plane 이슈 트래킹 기반 개발 로드맵</p>
                </div>
                <button
                  onClick={() => setAddingIssue(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  이슈 추가
                </button>
                {/* 진행률 요약 */}
                {!planeLoading && (() => {
                  const done = planeIssues.filter(i => i.state_detail?.group === 'completed').length;
                  const pct = planeIssues.length > 0 ? Math.round((done / planeIssues.length) * 100) : 0;
                  return (
                    <div className="text-right">
                      <p className="text-3xl font-bold text-blue-600">{pct}%</p>
                      <p className="text-xs text-gray-500">{done}/{planeIssues.length} 완료</p>
                    </div>
                  );
                })()}
              </div>

              {/* 진행률 바 */}
              {!planeLoading && (() => {
                const done = planeIssues.filter(i => i.state_detail?.group === 'completed').length;
                const pct = planeIssues.length > 0 ? Math.round((done / planeIssues.length) * 100) : 0;
                return (
                  <div className="mb-6">
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                      <span>진행 시작</span>
                      <span>완료</span>
                    </div>
                  </div>
                );
              })()}

              {/* 상태별 카운트 뱃지 */}
              {!planeLoading && (
                <div className="flex flex-wrap gap-3 mb-6">
                  {[
                    { group: 'completed', label: '완료', color: 'bg-green-100 text-green-700 border-green-200' },
                    { group: 'started', label: '진행중', color: 'bg-blue-100 text-blue-700 border-blue-200' },
                    { group: 'backlog', label: '백로그', color: 'bg-gray-100 text-gray-600 border-gray-200' },
                  ].map(({ group, label, color }) => {
                    const cnt = planeIssues.filter(i => i.state_detail?.group === group).length;
                    return (
                      <span key={group} className={`px-3 py-1 rounded-full text-sm font-semibold border ${color}`}>
                        {label} {cnt}건
                      </span>
                    );
                  })}
                </div>
              )}

              {/* 새 이슈 추가 폼 */}
              {addingIssue && (
                <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl space-y-3">
                  <p className="text-sm font-bold text-blue-800">새 이슈 추가</p>
                  <input
                    autoFocus
                    type="text"
                    value={newIssueForm.name}
                    onChange={(e) => setNewIssueForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="이슈 제목 입력 (예: [Task] 기능명)"
                    className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  />
                  <div className="flex gap-2">
                    <select
                      value={newIssueForm.priority}
                      onChange={(e) => setNewIssueForm((f) => ({ ...f, priority: e.target.value }))}
                      className="flex-1 px-3 py-2 border-2 border-blue-200 rounded-lg text-sm focus:outline-none"
                    >
                      <option value="urgent">긴급</option>
                      <option value="high">높음</option>
                      <option value="medium">보통</option>
                      <option value="low">낮음</option>
                    </select>
                    <select
                      value={newIssueForm.group}
                      onChange={(e) => setNewIssueForm((f) => ({ ...f, group: e.target.value }))}
                      className="flex-1 px-3 py-2 border-2 border-blue-200 rounded-lg text-sm focus:outline-none"
                    >
                      <option value="backlog">백로그</option>
                      <option value="started">진행중</option>
                      <option value="completed">완료</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleAddIssue} className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors">
                      추가
                    </button>
                    <button onClick={() => { setAddingIssue(false); setNewIssueForm({ name: '', priority: 'medium', group: 'backlog' }); }}
                      className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-semibold rounded-lg transition-colors">
                      취소
                    </button>
                  </div>
                </div>
              )}

              {planeLoading ? (
                <div className="text-center py-10">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                  <p className="mt-3 text-sm text-gray-500">Plane 데이터 불러오는 중...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {planeIssues.map((issue) => {
                    const group = issue.state_detail?.group || 'backlog';
                    const stateColor = issue.state_detail?.color || '#94A3B8';
                    const stateName = issue.state_detail?.name || '백로그';
                    const isEditing = editingIssueId === issue.id;

                    const priorityMap: Record<string, string> = {
                      urgent: 'bg-red-100 text-red-700',
                      high: 'bg-orange-100 text-orange-700',
                      medium: 'bg-yellow-100 text-yellow-700',
                      low: 'bg-green-100 text-green-700',
                    };
                    const priorityLabel: Record<string, string> = {
                      urgent: '긴급', high: '높음', medium: '보통', low: '낮음',
                    };

                    // 인라인 편집 모드
                    if (isEditing) {
                      return (
                        <div key={issue.id} className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-xl space-y-3">
                          <p className="text-xs font-bold text-yellow-700">이슈 수정</p>
                          <input
                            autoFocus
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                            className="w-full px-3 py-2 border-2 border-yellow-300 rounded-lg text-sm focus:outline-none focus:border-yellow-500"
                          />
                          <div className="flex gap-2">
                            <select
                              value={editForm.priority}
                              onChange={(e) => setEditForm((f) => ({ ...f, priority: e.target.value }))}
                              className="flex-1 px-3 py-2 border-2 border-yellow-200 rounded-lg text-sm focus:outline-none"
                            >
                              <option value="urgent">긴급</option>
                              <option value="high">높음</option>
                              <option value="medium">보통</option>
                              <option value="low">낮음</option>
                            </select>
                            <select
                              value={editForm.group}
                              onChange={(e) => setEditForm((f) => ({ ...f, group: e.target.value }))}
                              className="flex-1 px-3 py-2 border-2 border-yellow-200 rounded-lg text-sm focus:outline-none"
                            >
                              <option value="backlog">백로그</option>
                              <option value="started">진행중</option>
                              <option value="completed">완료</option>
                            </select>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleSaveIssue(issue.id)}
                              className="flex-1 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-bold rounded-lg transition-colors">
                              저장
                            </button>
                            <button onClick={() => setEditingIssueId(null)}
                              className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-semibold rounded-lg transition-colors">
                              취소
                            </button>
                          </div>
                        </div>
                      );
                    }

                    // 일반 표시 모드
                    return (
                      <div
                        key={issue.id}
                        className={`group flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
                          group === 'completed'
                            ? 'bg-green-50 border-green-100'
                            : group === 'started'
                            ? 'bg-blue-50 border-blue-100'
                            : 'bg-gray-50 border-gray-100'
                        }`}
                      >
                        {/* 상태 점 */}
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: stateColor }} />

                        {/* 이슈명 */}
                        <p className={`flex-1 text-sm font-medium ${group === 'completed' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                          {issue.name}
                        </p>

                        {/* 상태 배지 */}
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white border font-semibold"
                          style={{ color: stateColor, borderColor: stateColor + '40' }}>
                          {stateName}
                        </span>

                        {/* 우선순위 배지 */}
                        {issue.priority && issue.priority !== 'none' && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${priorityMap[issue.priority] || 'bg-gray-100 text-gray-600'}`}>
                            {priorityLabel[issue.priority] || issue.priority}
                          </span>
                        )}

                        {/* 수정/삭제 버튼 — hover 시 표시 */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleStartEditIssue(issue)}
                            title="수정"
                            className="p-1.5 rounded-lg hover:bg-yellow-100 text-gray-400 hover:text-yellow-600 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteIssue(issue.id)}
                            title="삭제"
                            className="p-1.5 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                              <path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                <span>Plane 프로젝트 기반 실시간 이슈 현황</span>
              </div>
            </motion.div>

            {/* Feedback Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">사용자 피드백</h2>

              {/* Feedback Form */}
              <form id="feedback-form" onSubmit={handleSubmitFeedback} className="mb-10 pb-10 border-b-2 border-gray-200">
                {editingFeedbackId && (
                  <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-yellow-800">피드백 수정 모드</p>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="text-sm text-yellow-700 hover:text-yellow-900 underline"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                )}
                <div className="bg-gray-50 rounded-xl p-8 space-y-6">
                  <div>
                    <label className="block text-lg font-bold text-gray-900 mb-3">
                      이름 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={feedbackForm.author}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, author: e.target.value })}
                      className="w-full px-5 py-4 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-base shadow-sm"
                      placeholder="예: 홍길동"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-bold text-gray-900 mb-3">
                      평점 <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3 items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                          className="text-5xl focus:outline-none hover:scale-110 transition-transform"
                        >
                          {star <= feedbackForm.rating ? '⭐' : '☆'}
                        </button>
                      ))}
                      <span className="ml-2 text-lg font-semibold text-gray-700">
                        {feedbackForm.rating}점
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-lg font-bold text-gray-900 mb-3">
                      피드백 내용 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={feedbackForm.content}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, content: e.target.value })}
                      className="w-full px-5 py-4 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-base resize-none shadow-sm leading-relaxed"
                      placeholder="제품에 대한 의견을 자유롭게 작성해주세요."
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      최소 10자 이상 작성해주세요
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
                  >
                    {editingFeedbackId ? '피드백 수정하기' : '피드백 등록하기'}
                  </button>
                </div>
              </form>

              {/* Feedback List */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  등록된 피드백 ({feedbacks.length})
                </h3>

                {feedbacks.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-lg text-gray-500 font-medium">아직 등록된 피드백이 없습니다.</p>
                    <p className="text-sm text-gray-400 mt-2">첫 번째 피드백을 남겨주세요!</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {feedbacks.map((feedback) => (
                      <motion.div
                        key={feedback.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-50 rounded-xl p-6 border-2 border-gray-100 hover:border-primary-200 transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-bold text-gray-900">{maskName(feedback.author)}</h4>
                            <div className="flex gap-1 mt-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star} className="text-xl">
                                  {star <= feedback.rating ? '⭐' : '☆'}
                                </span>
                              ))}
                              <span className="ml-2 text-sm font-semibold text-gray-600">
                                {feedback.rating}.0
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
                              {new Date(feedback.createdAt).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                            {feedback.authorKey === authorKey && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditFeedback(feedback)}
                                  className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
                                >
                                  수정
                                </button>
                                <button
                                  onClick={() => handleDeleteFeedback(feedback.id)}
                                  className="text-sm text-red-600 hover:text-red-800 font-semibold"
                                >
                                  삭제
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-base mb-4">
                          {feedback.content}
                        </p>

                        {/* Replies */}
                        {feedback.replies && feedback.replies.length > 0 && (
                          <div className="mt-4 space-y-3 border-t border-gray-200 pt-4">
                            {feedback.replies.map((reply) => (
                              <div
                                key={reply.id}
                                className={`pl-4 border-l-2 ${reply.isAdmin ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'} p-3 rounded`}
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={`text-sm font-bold ${reply.isAdmin ? 'text-blue-700' : 'text-gray-700'}`}>
                                    {reply.author}
                                    {reply.isAdmin && (
                                      <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded">관리자</span>
                                    )}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(reply.createdAt).toLocaleDateString('ko-KR')}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">{reply.content}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Reply Form */}
                        <div className="mt-4">
                          {replyingToId === feedback.id ? (
                            <div className="space-y-2">
                              <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm resize-none"
                                placeholder="댓글을 입력하세요..."
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleSubmitReply(feedback.id)}
                                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg"
                                >
                                  댓글 등록
                                </button>
                                <button
                                  onClick={() => {
                                    setReplyingToId(null);
                                    setReplyContent('');
                                  }}
                                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-semibold rounded-lg"
                                >
                                  취소
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setReplyingToId(feedback.id)}
                              className="text-sm text-gray-600 hover:text-gray-900 font-semibold"
                            >
                              💬 댓글 달기
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">제품 정보</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">카테고리</h4>
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                    {product.category}
                  </span>
                </div>

                {product.partners && product.partners.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 mb-2">참여 파트너</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.partners.map((partner, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm"
                        >
                          {partner}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">웹사이트</h4>
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 text-sm break-all underline"
                  >
                    {product.url}
                  </a>
                </div>
              </div>
            </motion.div>

            {/* SD Funding Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-lg p-6 border-2 border-purple-200"
            >
              <div className="text-center mb-4">
                <div className="inline-block bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold mb-3">
                  선착순 100명 한정
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  SD 펀딩
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  이 SaaS 개발에 투자하고 특별한 혜택을 받으세요
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-600 font-semibold">투자 진행률</span>
                    <span className="text-sm font-bold text-purple-600">{investorCount}/{maxInvestors}명</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(investorCount / maxInvestors) * 100}%` }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">
                    남은 자리: <span className="font-bold text-purple-600">{maxInvestors - investorCount}명</span>
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* 5만원 */}
                <div className="bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-2xl font-bold text-purple-600">5만원</h4>
                    <span className="text-xs font-semibold text-gray-600">3년 이용권</span>
                  </div>
                  <ul className="space-y-1.5 mb-3">
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0"></div>
                      <span className="text-gray-700 font-bold">3년간 무료 이용</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0"></div>
                      <span className="text-gray-700 font-bold">투자자 커뮤니티</span>
                    </li>
                  </ul>
                  <button className="w-full py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold rounded-lg text-sm transition-colors">
                    투자하기
                  </button>
                </div>

                {/* 10만원 - 인기 */}
                <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-4 shadow-lg text-white relative">
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-400 text-gray-900 px-3 py-0.5 rounded-full text-xs font-bold">인기</span>
                  </div>
                  <div className="flex justify-between items-center mb-3 mt-1">
                    <h4 className="text-2xl font-bold">10만원</h4>
                    <span className="text-xs font-semibold text-purple-100">3년 이용권 + 5% 배당</span>
                  </div>
                  <ul className="space-y-1.5 mb-3">
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0"></div>
                      <span className="font-bold">3년간 무료 이용</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0"></div>
                      <span className="font-bold">분기별 수익 5% 배당</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0"></div>
                      <span className="font-bold">투자 의결권 부여</span>
                    </li>
                  </ul>
                  <button className="w-full py-2 bg-white hover:bg-gray-100 text-purple-700 font-bold rounded-lg text-sm transition-colors">
                    투자하기
                  </button>
                </div>

                {/* 15만원 */}
                <div className="bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-2xl font-bold text-purple-600">15만원</h4>
                    <span className="text-xs font-semibold text-gray-600">3년 이용권 + 10% 배당</span>
                  </div>
                  <ul className="space-y-1.5 mb-3">
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0"></div>
                      <span className="text-gray-700 font-bold">3년간 무료 이용</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0"></div>
                      <span className="text-gray-700 font-bold">분기별 수익 10% 배당</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0"></div>
                      <span className="text-gray-700 font-bold">1:1 전담 매니저</span>
                    </li>
                  </ul>
                  <button className="w-full py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold rounded-lg text-sm transition-colors">
                    투자하기
                  </button>
                </div>
              </div>

              <div className="text-center text-xs text-gray-600 mt-4">
                <p>* 투자 신청 후 심사를 거쳐 최종 확정됩니다</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
