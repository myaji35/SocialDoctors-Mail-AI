'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardShell from '@/components/saas-dashboard/DashboardShell';

const navItems = [
  { label: '대시보드', href: '/saas/apps/task-flow/dashboard', active: true },
  { label: '칸반', href: '#' },
  { label: '간트 차트', href: '#' },
  { label: '팀', href: '#' },
];

const kanban = {
  '할 일': [
    { id: 1, title: '랜딩페이지 디자인 검토', priority: '높음', assignee: '김디자' },
    { id: 2, title: 'API 문서 작성', priority: '보통', assignee: '이개발' },
  ],
  '진행중': [
    { id: 3, title: '결제 모듈 연동', priority: '높음', assignee: '박백엔' },
    { id: 4, title: 'SEO 최적화', priority: '낮음', assignee: '최마케' },
  ],
  '완료': [
    { id: 5, title: '회원가입 플로우 개선', priority: '높음', assignee: '이개발' },
  ],
};

export default function TaskFlowDashboard() {
  const { status } = useSession();
  const router = useRouter();
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/sign-in?callbackUrl=/saas/apps/task-flow/dashboard');
  }, [status, router]);

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center text-gray-500">로딩 중...</div>;

  return (
    <DashboardShell appName="Task Flow" appSlug="task-flow" themeColor="sky" navItems={navItems}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: '전체 태스크', value: '48개', change: '3개 완료 오늘' },
          { label: '진행중', value: '12개', change: '2명 작업중' },
          { label: '이번주 완료', value: '23개', change: '+8개 전주 대비' },
          { label: '팀 멤버', value: '6명', change: '모두 활성' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs mt-1 text-sky-600 font-semibold">{s.change}</p>
          </div>
        ))}
      </div>

      {/* 칸반 보드 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {Object.entries(kanban).map(([col, tasks]) => (
          <div key={col} className="bg-gray-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-gray-700">{col}</h3>
              <span className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-500 font-semibold">{tasks.length}</span>
            </div>
            <div className="space-y-2">
              {tasks.map((task) => (
                <div key={task.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow">
                  <p className="text-sm font-medium text-gray-800 mb-2">{task.title}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${task.priority === '높음' ? 'bg-red-100 text-red-700' : task.priority === '보통' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                      {task.priority}
                    </span>
                    <div className="w-6 h-6 bg-sky-100 rounded-full flex items-center justify-center text-xs font-bold text-sky-700">
                      {task.assignee[0]}
                    </div>
                  </div>
                </div>
              ))}
              <button className="w-full py-2 text-xs text-gray-400 hover:text-sky-600 hover:bg-white rounded-lg transition-colors border-2 border-dashed border-gray-200 hover:border-sky-300">
                + 태스크 추가
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-bold text-gray-900 mb-4">빠른 태스크 추가</h2>
        <div className="flex gap-3">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="태스크 제목을 입력하세요..."
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sky-400"
            onKeyDown={(e) => e.key === 'Enter' && setNewTask('')}
          />
          <select className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sky-400 text-gray-600">
            <option>할 일</option>
            <option>진행중</option>
          </select>
          <button
            onClick={() => setNewTask('')}
            className="px-5 py-2.5 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 transition-colors"
          >
            추가
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
