import ClientLayout from '@/components/layout/client-layout'

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClientLayout>
      <div className="p-4 md:p-6">{children}</div>
    </ClientLayout>
  )
} 