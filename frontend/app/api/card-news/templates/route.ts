/**
 * Card News Templates API
 * GET /api/card-news/templates — 사용 가능한 템플릿 목록
 */
import { NextResponse } from 'next/server';
import { TEMPLATES } from '@/lib/card-news/templates';

export async function GET() {
  const templates = Object.values(TEMPLATES);
  return NextResponse.json(templates);
}
