/**
 * @description
 * This server page serves as the entry point for the virtual debate simulation feature in the Neurogenesis app.
 * It ensures that only authenticated users can access the simulation and renders the Simulation component.
 *
 * Key features:
 * - Authentication: Uses Clerk to restrict access to authenticated users
 * - Component Rendering: Renders the Simulation component for the user interface
 * - Error Handling: Redirects unauthenticated users to the login page
 * - Styling: Applies Neurogenesis design system via Tailwind CSS
 *
 * @dependencies
 * - @clerk/nextjs/server: Provides auth() for user authentication
 * - "@/components/simulation/simulation": The Simulation component for the user interface
 * - next/navigation: Provides redirect for handling unauthenticated users
 *
 * @notes
 * - Server component for secure access control per project rules
 * - No data fetching implemented yet; placeholders exist for future enhancements
 * - Edge case: Unauthenticated users are redirected to /login
 * - Limitation: Currently a basic shell; simulation data and logic to be added in future steps
 */

"use server"

import { auth } from "@clerk/nextjs/server"
import Simulation from "../../components/simulation/simulation"
import { redirect } from "next/navigation"

/**
 * Simulation page component that handles authentication and renders the simulation UI.
 *
 * @returns {Promise<JSX.Element>} The rendered simulation page or redirects to login
 */
export default async function SimulationPage() {
  // Get authenticated user ID from Clerk
  const { userId } = await auth()

  // Redirect unauthenticated users to login
  if (!userId) {
    redirect("/login")
  }

  // Render the simulation page with the Simulation component
  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-8 text-4xl font-bold text-white">
        Virtual Debate Simulation
      </h1>
      <Simulation />
    </div>
  )
}
