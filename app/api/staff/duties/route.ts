export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = (session.user as any).id;

    // Fetch duties for accepted events
    const duties = await prisma.staffDuty.findMany({
      where: {
        assignment: {
          staffId: userId,
          status: 'ACCEPTED'
        }
      },
      include: {
        assignment: {
          include: {
            event: {
              select: { name: true, date: true }
            }
          }
        },
        zone: true
      },
      orderBy: { startTime: 'asc' }
    });

    return NextResponse.json({ duties });
  } catch (error) {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}
