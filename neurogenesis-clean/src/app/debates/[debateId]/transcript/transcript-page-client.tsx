"use client";

import { useState, useEffect } from "react";

interface TranscriptPageClientProps {
  debateId: string;
}

/**
 * Client component for the transcript page
 * Handles fetching and displaying debate transcript data
 */
export default function TranscriptPageClient({ debateId }: TranscriptPageClientProps) {
  const [transcript, setTranscript] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTranscript() {
      try {
        setLoading(true);
        
        // Replace with your actual API call to fetch transcript
        const response = await fetch(`/api/debates/${debateId}/transcript`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch transcript: ${response.statusText}`);
        }
        
        const data = await response.json();
        setTranscript(data.transcript);
      } catch (err) {
        console.error("Error fetching transcript:", err);
        setError("Unable to load transcript. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    if (debateId) {
      fetchTranscript();
    }
  }, [debateId]);

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-[400px] bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border-l-4 border-red-500 bg-red-50 text-red-700">
        <h3 className="font-bold">Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Debate Transcript</h1>
      <div className="max-w-none">
        {transcript ? (
          <div className="whitespace-pre-wrap">{transcript}</div>
        ) : (
          <p>No transcript available for this debate.</p>
        )}
      </div>
    </div>
  );
}