'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface SaasProduct {
  id: string;
  name: string;
  overview: string;
  url: string;
  partners: string[];
  thumbnail?: string;
  category: string;
  planeIssueId?: string | null;
  planeProjectId?: string | null;
}

export default function SaasGallerySection() {
  const [products, setProducts] = useState<SaasProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<SaasProduct | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // API에서 제품 목록 가져오기
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/saas');
      const result = await response.json();
      if (result.success) {
        setProducts(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetail = (product: SaasProduct) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  const closeModal = () => {
    setIsDetailOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

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
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            다양한 카테고리의 SaaS 제품을 한눈에 확인하세요.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">제품 목록을 불러오는 중...</p>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer"
                  onClick={() => handleViewDetail(product)}
                >
                  {/* Thumbnail */}
                  <div className="h-48 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center overflow-hidden">
                    {product.thumbnail ? (
                      <img
                        src={product.thumbnail}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl">🚀</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Category Badge */}
                    <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full mb-3">
                      {product.category}
                    </span>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {product.name}
                    </h3>

                    {/* Overview */}
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {product.overview}
                    </p>

                    {/* Partners */}
                    {product.partners && product.partners.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {product.partners.slice(0, 3).map((partner, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
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

                    {/* View Detail Button */}
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
                  </div>
                </motion.div>
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg">등록된 SaaS 제품이 없습니다.</p>
              </div>
            )}
          </>
        )}

        {/* Detail Modal */}
        {isDetailOpen && selectedProduct && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">제품 상세정보</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Thumbnail */}
                {selectedProduct.thumbnail && (
                  <div className="mb-6 rounded-lg overflow-hidden">
                    <img
                      src={selectedProduct.thumbnail}
                      alt={selectedProduct.name}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}

                {/* Category */}
                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full mb-4">
                  {selectedProduct.category}
                </span>

                {/* Name */}
                <h4 className="text-3xl font-bold text-gray-900 mb-4">
                  {selectedProduct.name}
                </h4>

                {/* Overview */}
                <div className="mb-6">
                  <h5 className="text-lg font-semibold text-gray-900 mb-2">개요</h5>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedProduct.overview}
                  </p>
                </div>

                {/* URL */}
                <div className="mb-6">
                  <h5 className="text-lg font-semibold text-gray-900 mb-2">웹사이트</h5>
                  <a
                    href={selectedProduct.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 underline"
                  >
                    {selectedProduct.url}
                  </a>
                </div>

                {/* Partners */}
                {selectedProduct.partners && selectedProduct.partners.length > 0 && (
                  <div className="mb-6">
                    <h5 className="text-lg font-semibold text-gray-900 mb-2">참여 파트너</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.partners.map((partner, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg"
                        >
                          {partner}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Visit Website Button */}
                <motion.a
                  href={selectedProduct.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="block w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg text-center transition-colors"
                >
                  웹사이트 방문하기 →
                </motion.a>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
