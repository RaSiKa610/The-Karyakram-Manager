import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session?.user as any)?.role;
    if (userRole !== 'ADMIN' && userRole !== 'HOST') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { eventId, type, message } = await req.json();

    if (!eventId || !type || !message) {
      return NextResponse.json({ error: 'Missing broadcast content' }, { status: 400 });
    }

    // Fetch event name to prepend
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { name: true }
    });

    const personalizedMessage = `[${event?.name || 'Karyakram'}] ${message}`;

    const broadcast = await prisma.broadcast.create({
      data: {
        eventId,
        type,
        message: personalizedMessage,
      }
    });

    return NextResponse.json({ message: 'Royal Dispatch Broadcasted', broadcast });
  } catch (error) {
    console.error('Broadcast error:', error);
    return NextResponse.json({ error: 'Failed to issue dispatch' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get('eventId');

  if (!eventId) return NextResponse.json({ error: 'Event ID required' }, { status: 400 });

  try {
    const session = await getServerSession(authOptions);
    if (!session && eventId !== 'GLOBAL') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is registered for this event (unless check is for global alerts)
    if (session && eventId !== 'GLOBAL') {
      const isRegistered = await prisma.registration.findFirst({
        where: {
          eventId,
          userId: (session.user as any).id
        }
      });
      
      // If not registered and not an admin/host, block the alert
      const role = (session.user as any).role;
      if (!isRegistered && role !== 'ADMIN' && role !== 'HOST') {
        return NextResponse.json({ broadcast: null });
      }
    }

    const latestBroadcast = await prisma.broadcast.findFirst({
      where: { eventId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ broadcast: latestBroadcast });
  } catch (error) {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}
