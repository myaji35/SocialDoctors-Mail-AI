import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { encryptToken } from '@/lib/crypto';
import { resolveAuth } from '@/lib/api-auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await resolveAuth(request);
  if (auth.type === 'unauthorized') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { accessToken, status, tokenExpiresAt, channelName } = body as {
    accessToken?: string;
    status?: string;
    tokenExpiresAt?: string;
    channelName?: string;
  };

  const updateData: Record<string, unknown> = {};
  if (accessToken) updateData.accessToken = encryptToken(accessToken);
  if (status) updateData.status = status;
  if (tokenExpiresAt) updateData.tokenExpiresAt = new Date(tokenExpiresAt);
  if (channelName) updateData.channelName = channelName;

  const channel = await prisma.snsChannel.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      clientName: true,
      clientSlug: true,
      platform: true,
      channelName: true,
      pageId: true,
      status: true,
      tokenExpiresAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ channel, message: '채널이 업데이트되었습니다.' });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await resolveAuth(request);
  if (auth.type === 'unauthorized') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await prisma.snsChannel.delete({ where: { id } });
  return NextResponse.json({ success: true, message: '채널이 삭제되었습니다.' });
}
