import { vi } from 'vitest';

// Deep mock factory for Prisma client
// Each model gets findUnique, findFirst, findMany, create, update, delete, etc.
function createModelMock() {
  return {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    upsert: vi.fn(),
    count: vi.fn(),
  };
}

export const prismaMock = {
  partner: createModelMock(),
  partnerWallet: createModelMock(),
  referredUser: createModelMock(),
  referralClick: createModelMock(),
  commissionTransaction: createModelMock(),
  user: createModelMock(),
  payment: createModelMock(),
  subscription: createModelMock(),
  feedback: createModelMock(),
  feedbackReply: createModelMock(),
  $transaction: vi.fn(),
};

// Mock the @/lib/prisma module
vi.mock('@/lib/prisma', () => ({
  prisma: prismaMock,
}));

// Reset all mocks between tests
export function resetPrismaMock() {
  Object.values(prismaMock).forEach((model) => {
    if (typeof model === 'function') {
      (model as ReturnType<typeof vi.fn>).mockReset();
    } else if (typeof model === 'object' && model !== null) {
      Object.values(model).forEach((fn) => {
        if (typeof fn === 'function') {
          (fn as ReturnType<typeof vi.fn>).mockReset();
        }
      });
    }
  });
}
