import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = (session.user as any).id;
    const eventId = params.id;

    // 1. Verify access and fetch assignment
    const assignment = await prisma.staffAssignment.findUnique({
      where: {
        staffId_eventId: {
          staffId: userId,
          eventId: eventId
        }
      }
    });

    if (!assignment || assignment.status !== 'ACCEPTED') {
      return NextResponse.json({ error: 'Forbidden: Mission access denied' }, { status: 403 });
    }

    // 2. Fetch Event Details
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    // 3. Fetch Sovereign Roster (Other accepted staff)
    const roster = await prisma.staffAssignment.findMany({
      where: {
        eventId: eventId,
        status: 'ACCEPTED'
      },
      include: {
        staff: {
          select: { firstName: true, lastName: true, id: true }
        }
      }
    });

    // 4. Fetch My Duties
    const myDuties = await prisma.staffDuty.findMany({
      where: {
        assignmentId: assignment.id
      },
      include: {
        zone: true
      },
      orderBy: { startTime: 'asc' }
    });

    // 5. Fetch Broadcasts
    const broadcasts = await prisma.broadcast.findMany({
      where: { eventId },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    return NextResponse.json({
      event,
      roster,
      myDuties,
      broadcasts
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Console fetch failed' }, { status: 500 });
  }
}
