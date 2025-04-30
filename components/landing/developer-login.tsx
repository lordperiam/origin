import { SignedIn, SignedOut } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

export default function DeveloperLogin() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <SignedOut>
        <Button
          variant="outline"
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5 py-2 font-semibold"
          onClick={() => {
            window.location.href = "/login" // Redirect to login page
          }}
        >
          Developer Login
        </Button>
      </SignedOut>
      <SignedIn>
        <Button
          variant="outline"
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-5 py-2 font-semibold"
          onClick={() => {
            window.location.href = "/dashboard" // Redirect to dashboard
          }}
        >
          Go to Dashboard
        </Button>
      </SignedIn>
    </div>
  )
}
