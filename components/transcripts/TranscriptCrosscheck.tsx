import React from "react"
import type { TranscriptCrosscheckResult } from "@/lib/services/transcript-crosscheck"

export type TranscriptCrosscheckProps = {
  audioUrl?: string
  providedTranscript?: string
  crosscheckResult?: TranscriptCrosscheckResult
  onAudioUpload?: (file: File) => void
  onCheck?: () => void
  loading?: boolean
}

export function TranscriptCrosscheckUI({
  audioUrl,
  providedTranscript,
  crosscheckResult,
  onAudioUpload,
  onCheck,
  loading
}: TranscriptCrosscheckProps) {
  return (
    <div className="rounded border bg-white p-4 shadow">
      <h2 className="mb-2 text-lg font-bold">Transcript Cross-Verification</h2>
      <div className="mb-4">
        <label className="font-semibold">Audio File:</label>
        <input
          type="file"
          accept="audio/*"
          className="ml-2"
          onChange={e => {
            if (e.target.files && e.target.files[0] && onAudioUpload) {
              onAudioUpload(e.target.files[0])
            }
          }}
        />
        {audioUrl && <audio controls src={audioUrl} className="mt-2 w-full" />}
      </div>
      <button
        className="mb-4 rounded bg-blue-600 px-4 py-2 text-white"
        onClick={onCheck}
        disabled={loading || !audioUrl}
      >
        {loading ? "Checking..." : "Cross-Verify Transcript"}
      </button>
      {crosscheckResult && (
        <div>
          <h3 className="mt-4 font-semibold">Results</h3>
          <div className="mb-2">
            Similarity Score:{" "}
            <span className="font-mono">
              {(crosscheckResult.similarity * 100).toFixed(1)}%
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold">Generated Transcript</h4>
              <pre className="whitespace-pre-wrap rounded bg-gray-50 p-2 text-xs">
                {crosscheckResult.generatedTranscript}
              </pre>
            </div>
            <div>
              <h4 className="font-semibold">Provided Transcript</h4>
              <pre className="whitespace-pre-wrap rounded bg-gray-50 p-2 text-xs">
                {crosscheckResult.providedTranscript || "(none)"}
              </pre>
            </div>
          </div>
          {crosscheckResult.diff.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold">Differences</h4>
              <ul className="ml-6 list-disc text-xs text-red-700">
                {crosscheckResult.diff.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
