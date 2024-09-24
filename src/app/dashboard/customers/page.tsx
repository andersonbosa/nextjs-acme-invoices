import type { Metadata } from 'next'
import { Suspense } from 'react'

import { fetchCustomersTotalPages } from '@/src/app/functions/data'
import CustomersTable from '@/src/app/ui/customers/table'
import Pagination from '@/src/app/ui/pagination'
import { CustomersTableSkeleton } from '@/src/app/ui/skeletons'
import Search from '@/src/app/ui/search'
import { lusitana } from '@/src/app/ui/fonts'

export const metadata: Metadata = {
  title: 'Customers'
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

  const totalPages = await fetchCustomersTotalPages(query)

  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>Customers</h1>
      <Search placeholder="Search customers..." />

      <Suspense key={currentPage + query} fallback={<CustomersTableSkeleton />}>
        <CustomersTable query={query} currentPage={currentPage} />
      </Suspense>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  )
}
