'use client';

type Status = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'FAILED';

const STATUS_CONFIG: Record<Status, { label: string; className: string }> = {
  DRAFT: { label: '초안', className: 'bg-gray-100 text-gray-600' },
  SCHEDULED: { label: '예약됨', className: 'bg-blue-100 text-blue-700' },
  PUBLISHED: { label: '발행됨', className: 'bg-green-100 text-green-700' },
  FAILED: { label: '실패', className: 'bg-red-100 text-red-700' },
};

export default function PostStatusBadge({ status }: { status: Status }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.DRAFT;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
