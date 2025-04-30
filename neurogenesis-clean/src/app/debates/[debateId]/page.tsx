/**
 * @fileoverview Main debate page component - DO NOT MODIFY STRUCTURE
 * 
 * This file is part of the critical debate page structure.
 * Modifications to the component signature, props, or file location
 * will break application routing and server components.
 * 
 * @warning MAINTAIN THIS FILE STRUCTURE FOR PROPER DEPLOYMENT
 */
// @ts-ignore - Bypassing PageProps constraint issue with Next.js 15.3.1
export default function DebateDetailsPage({ params }: any) {
  // Access debateId from params
  const debateId = params?.debateId;
  
  // In a real implementation, this would fetch debate data from your API/database
  const debate = {
    title: "Sample Debate Title", 
    description: "Sample Debate Description",
  };

  const transcript: { content: string } | null = { content: "Sample transcript content" };
  const transcriptStatus: "ready" | "generating" = transcript ? "ready" : "generating";

  return (
    <div>
      <h1 className="text-3xl font-bold">{debate.title}</h1>
      <p className="text-gray-600">{debate.description}</p>
      <p className="text-sm text-blue-500">Debate ID: {debateId}</p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Transcript</h2>
        {transcriptStatus === "generating" ? (
          <p className="text-yellow-500">
            Transcript is being generated. Please refresh the page later.
          </p>
        ) : transcript ? (
          <pre className="rounded bg-gray-100 p-4">{transcript.content}</pre>
        ) : (
          <p className="text-red-500">Transcript is not available.</p>
        )}
      </div>
    </div>
  );
}