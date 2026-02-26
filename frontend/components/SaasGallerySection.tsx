'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

export default function SaasGallerySection() {
  const router = useRouter();
  const [products, setProducts] = useState<SaasProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/saas');
      const result = await response.json();
      if (result.success) {
        const activeProducts = result.data.filter((p: SaasProduct) => p.isActive !== false);
        setProducts(activeProducts);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetail = (product: SaasProduct) => {
    if (product.url.startsWith('http')) {
      window.open(product.url, '_blank', 'noopener,noreferrer');
    } else {
      router.push(`/saas/${product.id}`);
    }
  };

  const isFeatured = (product: SaasProduct) => product.name === 'CertiGraph';

  return (
    <section id="saas" className="py-20 bg-gradient-to-b from-gray-50 to-white">
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
            SaaS <span className="text-primary-600">마켓플레이스</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            다양한 카테고리의 SaaS 제품을 한눈에 확인하세요.
          </p>
          <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-full px-4 py-2 text-sm text-purple-700 font-medium">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse inline-block" />
            CertiGraph — AI 자격증 플랫폼 투자 회원 모집 중
          </div>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">제품 목록을 불러오는 중...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => {
                const featured = isFeatured(product);
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer ${
                      featured
                        ? 'border-2 border-purple-400 ring-2 ring-purple-200'
                        : 'border border-gray-100'
                    }`}
                    onClick={() => handleViewDetail(product)}
                  >
                    {/* Thumbnail */}
                    <div className={`relative h-48 flex items-center justify-center overflow-hidden ${
                      featured
                        ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500'
                        : 'bg-gradient-to-br from-primary-500 to-primary-700'
                    }`}>
                      {product.thumbnail ? (
                        <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
                      ) : featured ? (
                        <div className="text-center">
                          <div className="text-5xl mb-2">🎓</div>
                          <span className="text-white text-sm font-bold opacity-80">AI 자격증 플랫폼</span>
                        </div>
                      ) : (
                        <span className="text-6xl">🚀</span>
                      )}

                      {/* 관리 페이지로 이동하는 수정 버튼 */}
                      <Link
                        href={`/admin/marketplace/${product.id}`}
                        onClick={(e) => e.stopPropagation()}
                        title="제품 관리"
                        className="absolute top-3 right-3 p-2 bg-white/20 hover:bg-white/50 backdrop-blur-sm rounded-lg text-white transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </Link>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Badges */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                          featured ? 'bg-purple-100 text-purple-700' : 'bg-primary-100 text-primary-700'
                        }`}>
                          {product.category}
                        </span>
                        {featured && (
                          <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full border border-yellow-300">
                            투자 모집 중
                          </span>
                        )}
                        {product.url.startsWith('http') && !featured && (
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            외부 서비스
                          </span>
                        )}
                      </div>

                      <h3 className={`text-2xl font-bold mb-2 ${featured ? 'text-purple-900' : 'text-gray-900'}`}>
                        {product.name}
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {product.overview}
                      </p>

                      {product.partners && product.partners.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {product.partners.slice(0, 3).map((partner, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {partner}
                            </span>
                          ))}
                          {product.partners.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              +{product.partners.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {featured ? (
                        <div className="space-y-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all shadow"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open('https://exams.townin.net', '_blank', 'noopener,noreferrer');
                            }}
                          >
                            무료 체험하기 →
                          </motion.button>
                          <Link
                            href="/funding"
                            className="block w-full py-2.5 text-center border-2 border-purple-400 text-purple-700 font-semibold rounded-lg hover:bg-purple-50 transition-colors text-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            투자 회원 혜택 보기
                          </Link>
                        </div>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetail(product);
                          }}
                        >
                          상세보기 →
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {products.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg">등록된 SaaS 제품이 없습니다.</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
