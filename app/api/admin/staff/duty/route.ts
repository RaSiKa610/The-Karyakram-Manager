export const dynamic = 'force-dynamic';
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

    const { assignmentId, zoneId, taskName, startTime, endTime, notes } = await req.json();

    if (!assignmentId || !zoneId || !taskName || !startTime || !endTime) {
      return NextResponse.json({ error: 'Missing duty details' }, { status: 400 });
    }

    // Verify assignment is ACCEPTED
    const assignment = await prisma.staffAssignment.findUnique({
      where: { id: assignmentId }
    });

    if (!assignment) {
      return NextResponse.json({ error: 'Staff assignment not found' }, { status: 404 });
    }

    if (assignment.status !== 'ACCEPTED') {
      return NextResponse.json({ error: 'Cannot assign duty to staff who has not accepted the event yet.' }, { status: 400 });
    }

    // Create the duty
    const duty = await prisma.staffDuty.create({
      data: {
        assignmentId,
        zoneId,
        taskName,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        notes
      }
    });

    return NextResponse.json({ message: 'Duty Assigned', duty });
  } catch (error) {
    console.error('Duty assignment error:', error);
    return NextResponse.json({ error: 'Failed to assign duty' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) return NextResponse.json({ error: 'Event ID required' }, { status: 400 });

    const duties = await prisma.staffDuty.findMany({
      where: {
        assignment: {
          eventId
        }
      },
      include: {
        assignment: {
          include: {
            staff: {
              select: { firstName: true, lastName: true }
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
