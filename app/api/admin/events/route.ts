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

    const creatorId = (session?.user as any)?.id;
    if (!creatorId) {
      return NextResponse.json({ error: 'User ID missing from session' }, { status: 400 });
    }

    const body = await req.json();
    const { name, category, venueName, venueAddress, date, startTime, endTime, totalCapacity, latitude, longitude, zones } = body;

    // Basic validation
    if (!name || !category || !venueName || !venueAddress || !date || !startTime || !endTime || !totalCapacity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Convert string times to actual Date objects for Prisma
    // Assuming date is YYYY-MM-DD and time is HH:MM
    // Convert string times to actual Date objects for Prisma
    // Removing 'Z' to allow local-naive construction, matching host's intended time.
    const startDateTime = new Date(`${date}T${startTime}:00`);
    const endDateTime = new Date(`${date}T${endTime}:00`);
    const eventDate = new Date(`${date}T00:00:00`);

    const newEvent = await prisma.event.create({
      data: {
        name,
        category,
        venueName,
        venueAddress,
        latitude,
        longitude,
        date: eventDate,
        startTime: startDateTime,
        endTime: endDateTime,
        totalCapacity,
        creatorId,
        status: 'UPCOMING',
        zones: {
          create: zones.map((z: any) => ({
            name: z.name,
            capacity: z.capacity,
            type: z.type,
          }))
        }
      }
    });

    return NextResponse.json({ message: 'Event created', event: newEvent }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
