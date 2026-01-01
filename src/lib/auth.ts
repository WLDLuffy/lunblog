import bcrypt from 'bcrypt';
import { prisma } from './prisma';
import { cookies } from 'next/headers';

const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string): Promise<string> {
  const session = await prisma.session.create({
    data: {
      userId,
      expiresAt: new Date(Date.now() + SESSION_DURATION),
    },
  });

  const cookieStore = await cookies();
  cookieStore.set('session_id', session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_DURATION / 1000,
    path: '/',
  });

  return session.id;
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session_id')?.value;

  if (!sessionId) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.session.delete({ where: { id: sessionId } });
    }
    return null;
  }

  // Extend session (rolling window)
  await prisma.session.update({
    where: { id: sessionId },
    data: { expiresAt: new Date(Date.now() + SESSION_DURATION) },
  });

  return session;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session_id')?.value;

  if (sessionId) {
    await prisma.session.delete({ where: { id: sessionId } }).catch(() => {});
  }

  cookieStore.delete('session_id');
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}
