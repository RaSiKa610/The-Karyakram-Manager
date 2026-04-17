import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userRole = (session?.user as any)?.role;
    if (userRole !== 'ADMIN' && userRole !== 'HOST') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { staffId, eventId } = await req.json();

    if (!staffId || !eventId) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }

    // Verify user is a staff member
    const targetUser = await prisma.user.findUnique({
      where: { id: staffId }
    });

    if (targetUser?.role !== 'STAFF') {
      return NextResponse.json({ error: 'User is not a staff member' }, { status: 400 });
    }

    // Create assignment - notification is handled privately by the listener
    const assignment = await prisma.staffAssignment.create({
      data: {
        staffId,
        eventId,
        status: 'PENDING'
      }
    });

    return NextResponse.json({ message: 'Request dispatched', assignment });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Staff member already invited to this event' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Dispatch failed' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) return NextResponse.json({ error: 'Event ID required' }, { status: 400 });

    const assignments = await prisma.staffAssignment.findMany({
      where: { eventId },
      include: {
        staff: {
          select: { firstName: true, lastName: true, email: true, id: true }
        }
      }
    });

    return NextResponse.json({ assignments });
  } catch (error) {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}
