import React from "react"

export type ScrapingStatusWidgetProps = {
  lastScrapeTime?: string
  status?: "idle" | "running" | "error"
  errorMessage?: string
}

export function ScrapingStatusWidget({
  lastScrapeTime,
  status = "idle",
  errorMessage
}: ScrapingStatusWidgetProps) {
  return (
    <div className="w-full max-w-sm rounded border bg-white p-4 shadow">
      <h2 className="mb-2 text-lg font-bold">Debate Scraping Status</h2>
      <div className="mb-2">
        <span className="font-semibold">Last Scrape:</span>{" "}
        <span>
          {lastScrapeTime ? new Date(lastScrapeTime).toLocaleString() : "Never"}
        </span>
      </div>
      <div className="mb-2">
        <span className="font-semibold">Status:</span>{" "}
        <span
          className={
            status === "running"
              ? "text-blue-600"
              : status === "error"
                ? "text-red-600"
                : "text-green-600"
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      {status === "error" && errorMessage && (
        <div className="mt-2 text-xs text-red-700">Error: {errorMessage}</div>
      )}
    </div>
  )
}
