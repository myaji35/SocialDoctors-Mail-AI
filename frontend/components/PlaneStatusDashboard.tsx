'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface PlaneIssue {
  id: string;
  name: string;
  description_html?: string;
  state: string;
  state_detail?: {
    id: string;
    name: string;
    color: string;
    group: string;
  };
  priority?: string;
  created_at: string;
  updated_at: string;
}

interface PlaneState {
  id: string;
  name: string;
  color: string;
  group: string;
}

export default function PlaneStatusDashboard() {
  const [issues, setIssues] = useState<PlaneIssue[]>([]);
  const [states, setStates] = useState<PlaneState[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Fetch issues and states in parallel
      const [issuesRes, statesRes] = await Promise.all([
        fetch('/api/plane/issues'),
        fetch('/api/plane/states')
      ]);

      const issuesData = await issuesRes.json();
      const statesData = await statesRes.json();

      if (issuesData.success) {
        setIssues(issuesData.data);
      }

      if (statesData.success) {
        setStates(statesData.data);
      }
    } catch (error) {
      console.error('Failed to fetch Plane data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Group issues by state
  const getIssuesByState = (stateId: string) => {
    return issues.filter(issue => issue.state === stateId);
  };

  // Calculate statistics
  const totalIssues = issues.length;
  const saasIssues = issues.filter(issue => issue.name.includes('[SaaS]'));
  const completedIssues = issues.filter(issue => {
    const state = states.find(s => s.id === issue.state);
    return state?.group === 'completed';
  });

  const progressPercentage = totalIssues > 0
    ? Math.round((completedIssues.length / totalIssues) * 100)
    : 0;

  // Get priority color
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Get priority label
  const getPriorityLabel = (priority?: string) => {
    switch (priority) {
      case 'urgent':
        return '🔴 긴급';
      case 'high':
        return '🟠 높음';
      case 'medium':
        return '🟡 보통';
      case 'low':
        return '🟢 낮음';
      default:
        return '⚪ 없음';
    }
  };

  // Filter states by group
  const filteredStates = selectedGroup === 'all'
    ? states
    : states.filter(s => s.group === selectedGroup);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="text-blue-600">✈️ Plane</span> 프로젝트 현황
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            실시간 프로젝트 관리 및 이슈 트래킹 대시보드
          </p>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Plane 데이터를 불러오는 중...</p>
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
              >
                <div className="text-3xl mb-2">📊</div>
                <div className="text-2xl font-bold text-gray-900">{totalIssues}</div>
                <div className="text-sm text-gray-600">전체 이슈</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
              >
                <div className="text-3xl mb-2">🚀</div>
                <div className="text-2xl font-bold text-gray-900">{saasIssues.length}</div>
                <div className="text-sm text-gray-600">SaaS 제품</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
              >
                <div className="text-3xl mb-2">✅</div>
                <div className="text-2xl font-bold text-gray-900">{completedIssues.length}</div>
                <div className="text-sm text-gray-600">완료된 작업</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
              >
                <div className="text-3xl mb-2">📈</div>
                <div className="text-2xl font-bold text-gray-900">{progressPercentage}%</div>
                <div className="text-sm text-gray-600">진행률</div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${progressPercentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-blue-600 h-2 rounded-full"
                  />
                </div>
              </motion.div>
            </div>

            {/* Filter Buttons */}
            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={() => setSelectedGroup('all')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  selectedGroup === 'all'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                전체
              </button>
              <button
                onClick={() => setSelectedGroup('backlog')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  selectedGroup === 'backlog'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                백로그
              </button>
              <button
                onClick={() => setSelectedGroup('started')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  selectedGroup === 'started'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                진행중
              </button>
              <button
                onClick={() => setSelectedGroup('completed')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  selectedGroup === 'completed'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                완료
              </button>
            </div>

            {/* Issues by State */}
            <div className="space-y-8">
              {filteredStates.map((state, index) => {
                const stateIssues = getIssuesByState(state.id);
                if (stateIssues.length === 0) return null;

                return (
                  <motion.div
                    key={state.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                  >
                    {/* State Header */}
                    <div
                      className="px-6 py-4 border-b border-gray-200"
                      style={{ backgroundColor: `${state.color}20` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: state.color }}
                          />
                          <h3 className="text-xl font-bold text-gray-900">{state.name}</h3>
                          <span className="px-3 py-1 bg-white rounded-full text-sm font-semibold text-gray-700 border border-gray-200">
                            {stateIssues.length}개
                          </span>
                        </div>
                        <span className="text-sm text-gray-500 uppercase font-semibold">
                          {state.group}
                        </span>
                      </div>
                    </div>

                    {/* Issues List */}
                    <div className="divide-y divide-gray-100">
                      {stateIssues.map((issue) => (
                        <div key={issue.id} className="p-6 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-lg font-semibold text-gray-900">
                                  {issue.name}
                                </h4>
                                {issue.priority && (
                                  <span className={`px-2 py-1 text-xs font-semibold rounded-md border ${getPriorityColor(issue.priority)}`}>
                                    {getPriorityLabel(issue.priority)}
                                  </span>
                                )}
                              </div>
                              {issue.description_html && (
                                <div
                                  className="text-sm text-gray-600 mb-3 line-clamp-2"
                                  dangerouslySetInnerHTML={{ __html: issue.description_html }}
                                />
                              )}
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>생성: {new Date(issue.created_at).toLocaleDateString('ko-KR')}</span>
                                <span>•</span>
                                <span>업데이트: {new Date(issue.updated_at).toLocaleDateString('ko-KR')}</span>
                              </div>
                            </div>
                            <a
                              href={`http://34.158.192.195/testgraph/projects/SOCIA/issues/${issue.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-4 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg transition-colors text-sm"
                            >
                              ✈️ 보기
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {filteredStates.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg">해당 그룹에 이슈가 없습니다.</p>
              </div>
            )}

            {/* Refresh Button */}
            <div className="text-center mt-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchData}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                🔄 새로고침
              </motion.button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
