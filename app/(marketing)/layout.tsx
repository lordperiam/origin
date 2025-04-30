/*
This server layout provides a shared header and basic structure for (marketing) routes.
*/

"use server"

import Header from "@/components/landing/header"

export default async function MarketingLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    // Changed background to white and default text to black
    <div className="flex min-h-screen flex-col bg-white text-black">
      <Header />
      <main className="relative flex-1">{children}</main>
    </div>
  )
}
