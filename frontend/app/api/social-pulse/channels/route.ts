import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { encryptToken } from '@/lib/crypto';
import { resolveAuth } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  const auth = await resolveAuth(request);
  if (auth.type === 'unauthorized') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const clientSlug = searchParams.get('clientSlug');
  const platform = searchParams.get('platform');

  const channels = await prisma.snsChannel.findMany({
    where: {
      ...(clientSlug ? { clientSlug } : {}),
      ...(platform ? { platform: platform as never } : {}),
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      clientName: true,
      clientSlug: true,
      platform: true,
      channelName: true,
      pageId: true,
      status: true,
      tokenExpiresAt: true,
      metadata: true,
      createdAt: true,
      // accessToken 제외 (보안)
    },
  });

  return NextResponse.json({ channels });
}

export async function POST(request: NextRequest) {
  const auth = await resolveAuth(request);
  if (auth.type === 'unauthorized') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { clientName, clientSlug, platform, channelName, pageId, accessToken, tokenExpiresAt } =
    body as {
      clientName: string;
      clientSlug: string;
      platform: string;
      channelName: string;
      pageId: string;
      accessToken: string;
      tokenExpiresAt?: string;
    };

  if (!clientName || !clientSlug || !platform || !channelName || !pageId || !accessToken) {
    return NextResponse.json({ error: '필수 항목이 누락되었습니다.' }, { status: 400 });
  }

  const encryptedToken = encryptToken(accessToken);

  const channel = await prisma.snsChannel.create({
    data: {
      clientName,
      clientSlug: clientSlug.toLowerCase().replace(/\s+/g, '-'),
      platform: platform as never,
      channelName,
      pageId,
      accessToken: encryptedToken,
      tokenExpiresAt: tokenExpiresAt ? new Date(tokenExpiresAt) : null,
      status: 'ACTIVE',
    },
    select: {
      id: true,
      clientName: true,
      clientSlug: true,
      platform: true,
      channelName: true,
      pageId: true,
      status: true,
      tokenExpiresAt: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ channel, message: '채널이 등록되었습니다.' }, { status: 201 });
}
