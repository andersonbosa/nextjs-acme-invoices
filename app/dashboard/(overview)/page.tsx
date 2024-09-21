import { Suspense } from 'react'

import { CardsSkeleton, LatestInvoicesSkeleton, RevenueChartSkeleton } from '@/app/ui/skeletons'
import CardWrapper, { Card } from '../../ui/dashboard/cards'
import LatestInvoices from '../../ui/dashboard/latest-invoices'
import RevenueChart from '../../ui/dashboard/revenue-chart'
import { lusitana } from '../../ui/fonts'

// import { fetchCardData, fetchLatestInvoices, fetchRevenue } from '../../functions/data'

export default async function Page({ children }: { children: React.ReactNode }) {
  // const [revenue, latestInvoices] = await Promise.all([
  //   fetchRevenue(),
  //   fetchLatestInvoices()
  // ])

  // const {
  //   numberOfCustomers,
  //   numberOfInvoices,
  //   totalPaidInvoices,
  //   totalPendingInvoices
  // } = await fetchCardData()

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Dashboard</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          {/* <Card title="Collected" value={totalPaidInvoices} type="collected" /> */}
          {/* <Card title="Pending" value={totalPendingInvoices} type="pending" /> */}
          {/* <Card title="Total Invoices" value={numberOfInvoices} type="invoices" /> */}
          {/* <Card title="Total Customers" value={numberOfCustomers} type="customers" /> */}
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart /* revenue={revenue} */ />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices /* latestInvoices={latestInvoices} */ />
        </Suspense>
      </div>
    </main>
  )
}
