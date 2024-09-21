import bcrypt from 'bcrypt'
import {
  invoices,
  customers,
  revenue,
  users
} from '../../functions/placeholder-data'
import { queryClient } from '@/app/functions/db'
import { LOGGER } from '@/app/functions/logger'
import { headers } from 'next/headers'

async function seedUsers() {
  await queryClient`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`
  await queryClient`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10)
      return queryClient`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `
    })
  )

  return insertedUsers
}

async function seedInvoices() {
  await queryClient`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`

  await queryClient`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => queryClient`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  )

  return insertedInvoices
}

async function seedCustomers() {
  await queryClient`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`

  await queryClient`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => queryClient`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  )

  return insertedCustomers
}

async function seedRevenue() {
  await queryClient`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => queryClient`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `
    )
  )

  return insertedRevenue
}

// 
export async function GET() {
  try {
    const AUTHORIZED_API_KEY = 'ce57969350a95e58a436929eeb5f598f'
    const apiKey = headers().get('x-api-key')

    if (apiKey !== AUTHORIZED_API_KEY) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await queryClient.begin(async (_sql) => {
      await seedUsers()
      await seedCustomers()
      await seedInvoices()
      await seedRevenue()
    })

    return Response.json({ message: 'Database seeded successfully' })
  } catch (error) {
    await queryClient`ROLLBACK`
    return Response.json({ error }, { status: 500 })
  }
}
