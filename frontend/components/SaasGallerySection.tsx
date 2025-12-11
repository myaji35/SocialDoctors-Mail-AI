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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SaasProduct | null>(null);
  const [formData, setFormData] = useState<Partial<SaasProduct>>({
    name: '',
    overview: '',
    url: '',
    partners: [],
    category: '',
  });

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

  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData({ name: '', overview: '', url: '', partners: [], category: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (product: SaasProduct) => {
    setEditingProduct(product);
    setFormData(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        const response = await fetch(`/api/saas/${id}`, {
          method: 'DELETE',
        });
        const result = await response.json();
        if (result.success) {
          await fetchProducts(); // 목록 새로고침
        } else {
          alert('삭제 실패: ' + result.error);
        }
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingProduct) {
        // 수정
        const response = await fetch(`/api/saas/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const result = await response.json();
        if (!result.success) {
          alert('수정 실패: ' + result.error);
          return;
        }
      } else {
        // 새로 추가
        const response = await fetch('/api/saas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const result = await response.json();
        if (!result.success) {
          alert('등록 실패: ' + result.error);
          return;
        }
      }

      await fetchProducts(); // 목록 새로고침
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  const handlePartnersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const partnersArray = e.target.value.split(',').map((p) => p.trim());
    setFormData({ ...formData, partners: partnersArray });
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
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="text-primary-600">마이크로 SaaS</span> 갤러리
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            혁신적인 마이크로 SaaS 제품들을 만나보세요. 각 제품은 특정 비즈니스 문제를 해결합니다.
          </p>

          {/* Admin Controls */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddNew}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            + 새 SaaS 등록
          </motion.button>
        </motion.div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">제품 목록을 불러오는 중...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">등록된 SaaS 제품이 없습니다.</p>
            <p className="text-gray-500 mt-2">위의 버튼을 눌러 첫 제품을 등록해보세요!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              {/* Thumbnail */}
              <div className="h-48 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <span className="text-6xl">🚀</span>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Category Badge & Plane Status */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                    {product.category}
                  </span>
                  {product.planeIssueId ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      ✈️ Plane 연동
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-500 text-xs font-semibold rounded-full">
                      ⚠️ 미연동
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {product.name}
                </h3>

                {/* Overview */}
                <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                  {product.overview}
                </p>

                {/* URL */}
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium mb-4 block truncate"
                >
                  🔗 {product.url}
                </a>

                {/* Partners */}
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-2">참여 파트너</div>
                  <div className="flex flex-wrap gap-2">
                    {product.partners.map((partner, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                      >
                        {partner}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Plane Link */}
                {product.planeIssueId && (
                  <a
                    href={`http://34.158.192.195/testgraph/projects/SOCIA/issues/${product.planeIssueId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2 mb-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg transition-colors duration-200"
                  >
                    ✈️ Plane에서 보기
                  </a>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEdit(product)}
                    className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
                  >
                    ✏️ 수정
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-colors duration-200"
                  >
                    🗑️ 삭제
                  </motion.button>
                </div>
              </div>
            </motion.div>
            ))}
          </div>
        )}

        {/* Modal for Add/Edit */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {editingProduct ? 'SaaS 수정' : '새 SaaS 등록'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 서비스명 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    서비스명 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white text-gray-900 placeholder:text-gray-500 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="예: Social Pulse"
                  />
                </div>

                {/* 카테고리 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    카테고리 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-white text-gray-900 placeholder:text-gray-500 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="예: 마케팅, AI, 분석"
                  />
                </div>

                {/* 개요 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    개요 *
                  </label>
                  <textarea
                    required
                    value={formData.overview}
                    onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-white text-gray-900 placeholder:text-gray-500 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="서비스에 대한 간단한 설명을 입력하세요"
                  />
                </div>

                {/* URL */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full px-4 py-3 bg-white text-gray-900 placeholder:text-gray-500 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="https://example.com"
                  />
                </div>

                {/* 참여 파트너 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    참여 파트너 (쉼표로 구분)
                  </label>
                  <input
                    type="text"
                    value={formData.partners?.join(', ')}
                    onChange={handlePartnersChange}
                    className="w-full px-4 py-3 bg-white text-gray-900 placeholder:text-gray-500 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="파트너A, 파트너B, 파트너C"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    {editingProduct ? '수정 완료' : '등록하기'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Plane Integration Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 p-6 bg-blue-50 border border-blue-200 rounded-xl"
        >
          <div className="flex items-start gap-4">
            <span className="text-3xl">✈️</span>
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">
                Plane 프로젝트 관리 연동
              </h4>
              <p className="text-gray-600">
                각 SaaS 제품은 Plane 프로젝트 관리 시스템과 연동되어 개발 진행 상황,
                이슈 트래킹, 마일스톤을 실시간으로 확인할 수 있습니다.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
