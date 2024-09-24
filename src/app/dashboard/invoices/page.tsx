import { Suspense } from 'react'

import { lusitana } from '@/src/app/ui/fonts'
import Pagination from '@/src/app/ui/pagination'
import Search from '@/src/app/ui/search'
import { InvoicesTableSkeleton } from '@/src/app/ui/skeletons'

import { CreateInvoice } from '@/src/app/ui/invoices/buttons'
import Table from '@/src/app/ui/invoices/table'

import { fetchInvoicesPages } from '@/src/app/functions/data'

import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Invoices'
}

interface PageProps {
  searchParams?: {
    query?: string
    page?: string
  }
}

export default async function Page(props: PageProps) {
  const { searchParams } = props
  const query = searchParams?.query || ''
  const currentPage = Number(searchParams?.page) || 1

  const totalPages = await fetchInvoicesPages(query)

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>

      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  )
}
