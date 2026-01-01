import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createSession } from '@/lib/auth';
import { LoginSchema } from '@/lib/validation/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = LoginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(
      validatedData.password,
      user.passwordHash
    );

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    await createSession(user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
