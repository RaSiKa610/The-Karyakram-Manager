import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Clean up existing data to prevent unique constraint errors during re-seeding
  await prisma.checkIn.deleteMany()
  await prisma.registration.deleteMany()
  await prisma.ticketType.deleteMany()
  await prisma.eventSchedule.deleteMany()
  await prisma.eventZone.deleteMany()
  await prisma.event.deleteMany()
  await prisma.userPreference.deleteMany()
  await prisma.user.deleteMany()

  console.log('Database cleaned.')

  const testPassword = await bcrypt.hash('password123', 10)

  // 1. Create Users (Admin, Staff, Attendee)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@karyakram.com',
      firstName: 'System',
      lastName: 'Administrator',
      passwordHash: testPassword,
      role: 'ADMIN',
      preferences: {
        create: { theme: 'DARK' }
      }
    }
  })
  
  const staff = await prisma.user.create({
    data: {
      email: 'staff@karyakram.com',
      firstName: 'Gate',
      lastName: 'Staff',
      passwordHash: testPassword,
      role: 'STAFF',
    }
  })

  const attendee = await prisma.user.create({
    data: {
      email: 'attendee@karyakram.com',
      firstName: 'John',
      lastName: 'Doe',
      passwordHash: testPassword,
      role: 'ATTENDEE',
      medicalAllergies: 'None',
    }
  })

  console.log(`Created Users: Admin (${admin.email}), Staff (${staff.email}), Attendee (${attendee.email})`)

  // 2. Create Event
  const demoEvent = await prisma.event.create({
    data: {
      name: 'Global Tech & Sports Summit 2026',
      description: 'The largest convergence of sports and technology in the world.',
      category: 'CONFERENCES',
      venueName: 'Grand National Stadium',
      venueAddress: '100 Stadium Way, Metro City',
      date: new Date('2026-06-15T00:00:00Z'),
      startTime: new Date('2026-06-15T09:00:00Z'),
      endTime: new Date('2026-06-15T22:00:00Z'),
      totalCapacity: 50000,
      creatorId: admin.id,
      status: 'UPCOMING',
    }
  })

  // 3. Add Event Zones
  await prisma.eventZone.createMany({
    data: [
      { eventId: demoEvent.id, name: 'North Pavilion (General)', capacity: 20000, type: 'SEATING', isAccessible: true },
      { eventId: demoEvent.id, name: 'South Field (Standing)', capacity: 25000, type: 'STANDING', isAccessible: false },
      { eventId: demoEvent.id, name: 'VIP Skybox', capacity: 5000, type: 'VIP', isAccessible: true },
    ]
  })

  // 4. Add Ticket Types
  const generalTicket = await prisma.ticketType.create({
    data: {
      eventId: demoEvent.id,
      typeName: 'General Admission',
      price: 50.00,
      quantityAvailable: 45000,
      description: 'Access to North Pavilion and South Field'
    }
  })

  const vipTicket = await prisma.ticketType.create({
    data: {
      eventId: demoEvent.id,
      typeName: 'VIP Access',
      price: 250.00,
      quantityAvailable: 5000,
      description: 'Full access including VIP Skybox and premium catering'
    }
  })

  // 5. Create a Registration for the Attendee
  await prisma.registration.create({
    data: {
      userId: attendee.id,
      eventId: demoEvent.id,
      ticketType: 'VIP',
      quantity: 1,
      totalPrice: 250.00,
      status: 'APPROVED',
      seatZone: 'VIP Skybox',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=example_qr_string'
    }
  })

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
