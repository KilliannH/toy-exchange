import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET to check if a toy is favorited by the current user
export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ isFavorite: false });
  }

  try {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_toyId: {
          userId: session.user.id,
          toyId: params.toyId,
        },
      },
    });
    return NextResponse.json({ isFavorite: !!favorite });
  } catch (error) {
    console.error('Error checking favorite:', error);
    return NextResponse.json({ isFavorite: false }, { status: 500 });
  }
}

// POST to create a new favorite
export async function POST(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { toyId } = params;

  try {
    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        toyId: toyId,
      },
    });
    return NextResponse.json(favorite);
  } catch (error) {
    // P2002 is the unique constraint violation code in Prisma
    if (error.code === 'P2002') {
        return NextResponse.json({ error: 'Already in favorites' }, { status: 409 });
    }
    console.error('Error adding favorite:', error);
    return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 });
  }
}

// DELETE to remove a favorite
export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { toyId } = params;

  try {
    await prisma.favorite.delete({
      where: {
        userId_toyId: {
          userId: session.user.id,
          toyId: toyId,
        },
      },
    });
    return NextResponse.json({ message: 'Favorite removed' });
  } catch (error) {
    // P2025 is the record not found code in Prisma
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Favorite not found' }, { status: 404 });
    }
    console.error('Error removing favorite:', error);
    return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 });
  }
}