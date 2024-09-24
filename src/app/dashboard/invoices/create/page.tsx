import Form from '@/src/app/ui/invoices/create-form'
import Breadcrumbs from '@/src/app/ui/invoices/breadcrumbs'

import { fetchCustomers } from '@/src/app/functions/data'

import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Create Invoice'
}

export default async function Page() {
  const customers = await fetchCustomers()

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true
          }
        ]}
      />
      <Form customers={customers} />
    </main>
  )
}
