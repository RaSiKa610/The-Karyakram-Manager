import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = (session.user as any).id;
    const { assignmentId, status } = await req.json();

    if (!assignmentId || !status) {
      return NextResponse.json({ error: 'Missing response data' }, { status: 400 });
    }

    if (status !== 'ACCEPTED' && status !== 'DECLINED') {
      return NextResponse.json({ error: 'Invalid response status' }, { status: 400 });
    }

    // Verify assignment belongs to this user and is still PENDING
    const assignment = await prisma.staffAssignment.findUnique({
      where: { id: assignmentId }
    });

    if (!assignment || assignment.staffId !== userId) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    // Rules: Once accepted, cannot deny event.
    if (assignment.status === 'ACCEPTED') {
      return NextResponse.json({ error: 'Royal Commitment: This event has already been accepted and cannot be declined.' }, { status: 400 });
    }

    const updated = await prisma.staffAssignment.update({
      where: { id: assignmentId },
      data: {
        status,
        respondedAt: new Date()
      }
    });

    return NextResponse.json({ message: `Royal Response: ${status}`, assignment: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Response failed' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = (session.user as any).id;

    const invitations = await prisma.staffAssignment.findMany({
      where: {
        staffId: userId,
        status: 'PENDING'
      },
      include: {
        event: {
          select: { name: true, date: true, venueName: true }
        }
      }
    });

    return NextResponse.json({ invitations });
  } catch (error) {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}
