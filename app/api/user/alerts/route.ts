import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Fetch all registrations for the user
    const userRegistrations = await prisma.registration.findMany({
      where: { userId },
      select: { eventId: true }
    });

    const eventIds = userRegistrations.map((r: { eventId: string }) => r.eventId);

    // Fetch all dispatches for these events
    const dispatches = await prisma.broadcast.findMany({
      where: {
        eventId: { in: eventIds }
      },
      include: {
        event: {
          select: { name: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ dispatches });
  } catch (error) {
    console.error('Error fetching royal inbox:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
