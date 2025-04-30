import Tutorial from "../../components/onboarding/tutorial"

export default function OnboardingPage() {
  return (
    <div className="container mx-auto py-12">
      <Tutorial userId="exampleUserId" membership="free" />
    </div>
  )
}
