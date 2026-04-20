export const dynamic = 'force-dynamic';
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

    const { ticketCode, zoneId, eventId } = await req.json();

    if (!ticketCode || !zoneId || !eventId) {
      return NextResponse.json({ error: 'Missing scanning data' }, { status: 400 });
    }

    // 1. Find the registration
    const registration = await prisma.registration.findFirst({
      where: {
        qrCodeUrl: ticketCode,
        eventId: eventId,
      },
      include: {
        user: true,
      }
    });

    if (!registration) {
      return NextResponse.json({ error: 'Invalid or Fraudulent Pass' }, { status: 404 });
    }

    // 2. Process check-in in a transaction
    const checkIn = await prisma.$transaction(async (tx: any) => {
      // Create check-in log
      const log = await tx.checkIn.create({
        data: {
          registrationId: registration.id,
          eventId: eventId,
          userId: registration.userId,
          zoneId: zoneId,
          method: 'QR_SCAN',
        }
      });

      // Increment zone occupancy
      await tx.eventZone.update({
        where: { id: zoneId },
        data: {
          currentOccupancy: {
            increment: 1,
          }
        }
      });

      return log;
    });

    return NextResponse.json({ 
      message: `Welcome, ${registration.user.firstName}!`, 
      attendee: registration.user.firstName,
      timestamp: checkIn.timestamp 
    });

  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json({ error: 'System error during ingress' }, { status: 500 });
  }
}
