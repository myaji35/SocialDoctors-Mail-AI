import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const limit = Number(searchParams.get('limit') ?? '20');

  const posts = await prisma.socialPost.findMany({
    where: {
      userId: session.user.id,
      ...(status ? { status: status as never } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  // 이번달 통계
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [monthlyCount, totalReach] = await Promise.all([
    prisma.socialPost.count({
      where: { userId: session.user.id, createdAt: { gte: startOfMonth } },
    }),
    prisma.socialPost.count({
      where: { userId: session.user.id, status: 'PUBLISHED' },
    }),
  ]);

  return NextResponse.json({ posts, monthlyCount, totalPublished: totalReach });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { platform, content, scheduledAt, imageUrl } = body as {
    platform: string;
    content: string;
    scheduledAt?: string;
    imageUrl?: string;
  };

  if (!platform || !content?.trim()) {
    return NextResponse.json({ error: 'platform and content are required' }, { status: 400 });
  }

  const post = await prisma.socialPost.create({
    data: {
      userId: session.user.id,
      platform: platform as never,
      content: content.trim(),
      imageUrl,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      status: scheduledAt ? 'SCHEDULED' : 'DRAFT',
    },
  });

  return NextResponse.json({ post }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  await prisma.socialPost.deleteMany({
    where: { id, userId: session.user.id },
  });

  return NextResponse.json({ success: true });
}
