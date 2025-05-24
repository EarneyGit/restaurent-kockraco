import ClientLayout from '@/components/layout/client-layout'

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClientLayout>
      <div className="">{children}</div>
    </ClientLayout>
  )
} 