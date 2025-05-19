/**
 * Follow these steps to fix duplicate sidebars across all pages:
 * 
 * 1. Use the PageLayout component we created at src/components/layout/page-layout.tsx
 * 
 * 2. Update each page with duplicate sidebar following this pattern:
 * 
 * BEFORE:
 * ```
 * "use client"
 * 
 * import React from "react"
 * import Sidebar from "@/components/layout/sidebar"
 * import SomeComponent from "@/components/path/some-component"
 * 
 * export default function SomePage() {
 *   return (
 *     <main className="flex min-h-screen">
 *       <div className="fixed top-0 left-0 bottom-0 w-[240px]" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
 *         <Sidebar />
 *       </div>
 *       <div className="flex-1 ml-[240px]">
 *         <SomeComponent />
 *       </div>
 *     </main>
 *   )
 * }
 * ```
 * 
 * AFTER:
 * ```
 * "use client"
 * 
 * import React from "react"
 * import PageLayout from "@/components/layout/page-layout"
 * import SomeComponent from "@/components/path/some-component"
 * 
 * export default function SomePage() {
 *   return (
 *     <PageLayout>
 *       <SomeComponent />
 *     </PageLayout>
 *   )
 * }
 * ```
 * 
 * 3. For components that include their own sidebars:
 *    - Similar to how we fixed recipe-categories-content.tsx and recipe-list-content.tsx
 *    - Either update the component to work without a sidebar, OR
 *    - Create a new wrapper content component that uses PageLayout
 * 
 * 4. The list of files to check and update (find . -type f -name "page.tsx" -exec grep -l "Sidebar" {} \\;):
 *    - src/app/customers/page.tsx
 *    - src/app/branch-galleries/page.tsx
 *    - src/app/general-settings/location/page.tsx
 *    - src/app/general-settings/page.tsx
 *    - src/app/deliverymen/statistics/page.tsx
 *    - src/app/deliverymen/map/page.tsx
 *    - src/app/deliverymen/list/page.tsx
 *    - src/app/revenue-reports/page.tsx
 *    - src/app/payments/methods/page.tsx
 *    - src/app/payments/payloads/page.tsx
 *    - src/app/referral/page.tsx
 *    - src/app/notification-settings/sms-provider/page.tsx
 *    - src/app/notification-settings/firebase-configuration/page.tsx
 *    - src/app/product-reports/page.tsx
 *    - src/app/social-settings/page.tsx
 *    - src/app/category-reports/page.tsx
 *    - src/app/branch-list/page.tsx
 *    - src/app/reservations/list/page.tsx
 *    - src/app/reservations/new/page.tsx
 *    - src/app/staff-admin/page.tsx
 *    - src/app/gallery/page.tsx
 *    - src/app/kitchen-list/page.tsx
 *    - src/app/reservation/zones/page.tsx
 *    - src/app/reservation/time/page.tsx
 *    - src/app/backup-maintenance/backup/page.tsx
 *    - src/app/banners/page.tsx
 *    - src/app/careers/list/page.tsx
 *    - src/app/careers/categories/page.tsx
 *    - src/app/coupons/page.tsx
 *    - src/app/stock-reports/page.tsx
 *    - src/app/app-settings/page.tsx
 *    - src/app/staff/page.tsx
 *    - src/app/extras-reports/page.tsx
 *    - src/app/payout-requests/page.tsx
 *    - src/app/main-branch/page.tsx
 *    - src/app/page-setup/privacy/page.tsx
 *    - src/app/page-setup/privacy-policy/page.tsx
 *    - src/app/page-setup/faq/page.tsx
 *    - src/app/page-setup/terms/page.tsx
 *    - src/app/page-setup/terms-conditions/page.tsx
 *    - src/app/page-setup/custom-pages/page.tsx
 *    - src/app/page-setup/custom/page.tsx
 *    - src/app/lang-translations/languages/page.tsx
 *    - src/app/lang-translations/translations/page.tsx
 *    - src/app/notifications/page.tsx
 */ 