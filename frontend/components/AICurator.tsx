'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AICurator() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '안녕하세요! 👋\n어떤 비즈니스 문제를 해결하고 싶으신가요?'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '죄송합니다. 응답을 생성하는 중 오류가 발생했습니다. 다시 시도해주세요.'
        }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '네트워크 오류가 발생했습니다. 다시 시도해주세요.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    '소셜 미디어 마케팅을 자동화하고 싶어요',
    '파트너사 관리를 효율적으로 하고 싶어요',
    '고객 데이터를 분석하고 싶어요',
  ];

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center text-3xl relative group"
        >
          {isOpen ? '✕' : '🤖'}

          {/* Pulse animation */}
          {!isOpen && (
            <>
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75 animate-ping" />
              <span className="absolute inline-flex h-16 w-16 rounded-full bg-primary-400 opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
            </>
          )}

          {/* Tooltip */}
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute right-full mr-4 whitespace-nowrap bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              AI 큐레이터에게 물어보세요!
              <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900" />
            </motion.div>
          )}
        </button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-primary-500 to-cyan-500 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🤖</div>
                <div>
                  <h3 className="font-bold text-lg">AI 큐레이터</h3>
                  <p className="text-sm text-white/80">당신에게 맞는 서비스를 찾아드립니다</p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-6 overflow-y-auto bg-gray-50 space-y-4">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-lg shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-700'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Quick Questions (only show initially) */}
              {messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-gray-600 text-sm mb-3">예를 들어:</p>
                    <div className="space-y-2">
                      {quickQuestions.map((question, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setMessage(question)}
                          className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-primary-50 text-gray-700 hover:text-primary-700 rounded-lg text-sm transition-colors duration-200"
                        >
                          {question}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="메시지를 입력하세요..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  disabled={isLoading}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={isLoading || !message.trim()}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? '...' : '전송'}
                </motion.button>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                <span className="inline-flex items-center gap-1">
                  <span className="text-purple-500">✨</span>
                  Powered by Google Gemini
                </span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
