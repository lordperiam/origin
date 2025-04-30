"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface VerificationFormProps {
  userId: string
  isVerified: boolean
  onSubmit?: () => void
}

/**
 * Component that displays the verification status for a user
 * Allows users to submit verification requests
 */
export default function VerificationForm({
  userId,
  isVerified,
  onSubmit
}: VerificationFormProps) {
  return (
    <Card className="verification-form">
      <CardHeader>
        <CardTitle>Verification Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <p className="text-sm font-medium">User ID:</p>
          <p className="text-sm">{userId}</p>
          
          <p className="text-sm font-medium">Status:</p>
          <p className="text-sm">
            {isVerified ? (
              <span className="text-green-600 font-medium">Verified</span>
            ) : (
              <span className="text-amber-600 font-medium">Not Verified</span>
            )}
          </p>
        </div>
        
        <Button 
          onClick={onSubmit} 
          disabled={isVerified} 
          className="w-full"
        >
          {isVerified ? "Already Verified" : "Submit Verification"}
        </Button>
      </CardContent>
    </Card>
  )
}