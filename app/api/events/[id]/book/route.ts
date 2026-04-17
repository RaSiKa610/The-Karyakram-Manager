import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Log in to book tickets' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const eventId = params.id;

    // 1. Check if the event exists and has capacity
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: 'Majestic karyakram not found' }, { status: 404 });
    }

    if (event.currentAttendance >= event.totalCapacity) {
      return NextResponse.json({ error: 'This karyakram has reached its royal capacity' }, { status: 400 });
    }

    // 2. Check if the user is already registered
    const existingRegistration = await prisma.registration.findFirst({
      where: {
        userId,
        eventId,
      },
    });

    if (existingRegistration) {
      return NextResponse.json({ error: 'You are already registered for this karyakram' }, { status: 400 });
    }

    // 3. Perform the booking in a transaction
    const registration = await prisma.$transaction(async (tx: any) => {
      // Create registration
      const reg = await tx.registration.create({
        data: {
          userId,
          eventId,
          ticketType: 'GENERAL', // Default for now
          totalPrice: 0,
          status: 'APPROVED', // Assuming instant approval for free events
          qrCodeUrl: `TKT-${eventId.substring(0, 4)}-${userId.substring(0, 4)}-${Math.random().toString(36).substring(7).toUpperCase()}`,
        },
      });

      // Increment attendance
      await tx.event.update({
        where: { id: eventId },
        data: {
          currentAttendance: {
            increment: 1,
          },
        },
      });

      return reg;
    });

    return NextResponse.json({ 
      message: 'Spot secured successfully',
      registration 
    }, { status: 201 });

  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json({ error: 'Failed to process your reservation' }, { status: 500 });
  }
}
