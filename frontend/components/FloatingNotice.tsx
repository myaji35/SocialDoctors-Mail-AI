'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function FloatingNotice() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 페이지 로드 후 잠시 후에 표시
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:block"
    >
      {/* 풍선 말풍선 */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-xs border-2 border-blue-200">
        {/* 왼쪽 화살표 */}
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-r-[12px] border-r-blue-200"></div>
        <div className="absolute -left-[10px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[10px] border-r-white"></div>

        {/* 아이콘 */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-xl">ℹ️</span>
          </div>

          {/* 메시지 */}
          <div className="flex-1">
            <h3 className="text-base font-bold text-gray-900 mb-2">알림</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              해당 프로젝트는 <strong className="text-blue-600">기획단계</strong> 입니다.
              <br />
              표현된 내용은 서비스 내용과 상이할 수 있습니다.
            </p>
          </div>
        </div>

        {/* 애니메이션 효과 - 깜빡이는 점 */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full shadow-lg"
        />
      </div>
    </motion.div>
  );
}
