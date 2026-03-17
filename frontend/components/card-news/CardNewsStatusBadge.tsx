'use client';

type CardStatus = 'DRAFT' | 'RENDERED' | 'PUBLISHED' | 'FAILED';

const STATUS_CONFIG: Record<CardStatus, { label: string; bg: string }> = {
  DRAFT:     { label: '초안',     bg: '#6B7280' },
  RENDERED:  { label: '렌더링됨', bg: '#3B82F6' },
  PUBLISHED: { label: '발행됨',   bg: '#22C55E' },
  FAILED:    { label: '실패',     bg: '#EF4444' },
};

export default function CardNewsStatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status as CardStatus] ?? STATUS_CONFIG.DRAFT;
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold"
      style={{ background: config.bg, color: 'white' }}
    >
      {config.label}
    </span>
  );
}
