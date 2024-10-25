import { queryClient } from './db'
import { formatCurrency } from './utils'

import type {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue
} from './definitions'
import { LOGGER } from './logger'

export async function fetchRevenue() {
  try {
    LOGGER.debug('Fetching revenue data...')
    await new Promise((resolve) => setTimeout(resolve, 3000))
    const data = await queryClient<Revenue[]> /* SQL */`SELECT * FROM revenue`
    LOGGER.debug('Data fetch completed after 3 seconds.', data)
    return data
  } catch (error) {
    LOGGER.error('Database Error:', error)
    throw new Error('Failed to fetch revenue data.')
  }
}

export async function fetchLatestInvoices() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const data = await queryClient<LatestInvoiceRaw[]> /* SQL */`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5
    `

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount)
    }))
    return latestInvoices
  } catch (error) {
    LOGGER.error('Database Error:', error)
    throw new Error('Failed to fetch the latest invoices.')
  }
}

export async function fetchCardData() {
  try {
    // how to initialize multiple queries in parallel with JS:
    const invoiceCountPromise = queryClient /* SQL */`SELECT COUNT(*) FROM invoices`
    const customerCountPromise = queryClient /* SQL */`SELECT COUNT(*) FROM customers`
    const invoiceStatusPromise = queryClient /* SQL */`SELECT
      SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
      SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
      FROM invoices
    `

    const [invoicesCount, customersCount, invoicesStatus] = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise
    ])

    const numberOfInvoices = Number(invoicesCount[0].count ?? '0')
    const numberOfCustomers = Number(customersCount[0].count ?? '0')
    const totalPaidInvoices = formatCurrency(invoicesStatus[0].paid ?? '0')
    const totalPendingInvoices = formatCurrency(invoicesStatus[0].pending ?? '0')

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices
    }
  } catch (error) {
    LOGGER.error('Database Error:', error)
    throw new Error('Failed to fetch card data.')
  }
}

const ITEMS_PER_PAGE = 6
export async function fetchFilteredInvoices(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE

  try {
    const invoices = await queryClient<InvoicesTable[]> /* SQL */`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `

    return invoices
  } catch (error) {
    LOGGER.error('Database Error:', error)
    throw new Error('Failed to fetch invoices.')
  }
}

export async function fetchInvoicesPages(query: string): Promise<number> {
  try {
    const count = await queryClient /* SQL */`
    SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
    `

    const totalPages = Math.ceil(Number(count[0].count) / ITEMS_PER_PAGE)
    return totalPages
  } catch (error) {
    LOGGER.error('Database Error:', error)
    throw new Error('Failed to fetch total number of invoices.')
  }
}

export async function fetchCustomersTotalPages(query: string): Promise<number> {
  try {
    const [result] = await queryClient /* SQL */`
      SELECT COUNT(*) AS count
      FROM customers c
      WHERE c.name ILIKE ${`%${query}%`}
        OR c.email ILIKE ${`%${query}%`}
    `
    const totalPages = Math.ceil(Number(result.count) / ITEMS_PER_PAGE)
    return totalPages
  } catch (error) {
    LOGGER.error('Database Error:', error)
    throw new Error('Failed to fetch total number of customers.')
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await queryClient<InvoiceForm[]> /* SQL */`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `

    const invoice = data.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100
    }))

    return invoice[0]
  } catch (error) {
    LOGGER.error('Database Error:', error)
    throw new Error('Failed to fetch invoice.')
  }
}

export async function fetchCustomers() {
  try {
    const data = await queryClient<CustomerField[]> /* SQL */`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `

    const customers = data
    return customers
  } catch (err) {
    LOGGER.error('Database Error:', err)
    throw new Error('Failed to fetch all customers.')
  }
}

export async function fetchFilteredCustomers(query: string, currentPage = 1) {
  try {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE

    const data = await queryClient<CustomersTableType[]> /* SQL */`
      SELECT
        customers.id,
        customers.name,
        customers.email,
        customers.image_url,
        COUNT(invoices.id) AS total_invoices,
        SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
        SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
      FROM customers
      LEFT JOIN invoices ON customers.id = invoices.customer_id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
          customers.email ILIKE ${`%${query}%`}
      GROUP BY customers.id, customers.name, customers.email, customers.image_url
      ORDER BY customers.name ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
	  `

    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid)
    }))

    await new Promise((resolve) => setTimeout(resolve, 3000))

    return customers
  } catch (err) {
    LOGGER.error('Database Error:', err)
    throw new Error('Failed to fetch customer table.')
  }
}
