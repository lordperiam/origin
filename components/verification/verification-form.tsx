import React from "react"

interface VerificationFormProps {
  userId: string
  isVerified: boolean
}

const VerificationForm: React.FC<VerificationFormProps> = ({
  userId,
  isVerified
}) => {
  return (
    <div className="verification-form">
      <h2 className="text-xl font-bold">Verification Form</h2>
      <p>User ID: {userId}</p>
      <p>Status: {isVerified ? "Verified" : "Not Verified"}</p>
      <button className="btn btn-primary">Submit Verification</button>
    </div>
  )
}

export default VerificationForm
