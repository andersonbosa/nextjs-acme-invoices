'use server'

import { z } from 'zod'
import { queryClient } from './db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string()
})

const CreateInvoiceSchema = FormSchema.omit({ id: true, date: true })
const UpdateInvoiceSchema = FormSchema.omit({ id: true, date: true })

export async function createInvoiceAction(formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries())
  const invoiceInput = CreateInvoiceSchema.parse(rawFormData)
  const { customerId, amount, status } = invoiceInput

  const amountInCents = amount * 100
  const date = new Date().toISOString().split('T')[0]

  try {
    await queryClient`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice.'
    }
  }

  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
}

export async function updateInvoiceAction(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoiceSchema.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status')
  })

  const amountInCents = amount * 100

  try {
    await queryClient /* SQL */`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' }
  }

  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
}

export async function deleteInvoiceAction(id: string) {
  try {
    await queryClient /* SQL */`DELETE FROM invoices WHERE id = ${id}`
    revalidatePath('/dashboard/invoices')
    return { message: 'Deleted Invoice.' }
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' }
  }
}
