export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userRole = (session?.user as any)?.role;
    if (userRole !== 'ADMIN' && userRole !== 'HOST') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';

    const staffMembers = await prisma.user.findMany({
      where: {
        role: 'STAFF',
        OR: [
          { firstName: { contains: query } },
          { lastName: { contains: query } },
          { email: { contains: query } }
        ]
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true
      },
      take: 10
    });

    return NextResponse.json({ staffMembers });
  } catch (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
