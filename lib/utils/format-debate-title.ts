/**
 * Utility functions for formatting and cleaning debate titles
 */

/**
 * Cleans and formats a debate title by:
 * - Decoding HTML entities
 * - Removing special characters
 * - Fixing common formatting issues
 * - Ensuring proper capitalization
 * - Removing platform-specific syntax
 *
 * @param title - The raw debate title to clean
 * @returns The cleaned and formatted title
 */
export function formatDebateTitle(title: string): string {
  if (!title) return "Untitled Debate"

  // Create a temporary element to decode HTML entities properly
  const tempElement =
    typeof document !== "undefined"
      ? document.createElement("div")
      : { innerHTML: "", textContent: "" }
  tempElement.innerHTML = title
  let cleaned = tempElement.textContent || title

  // Remove platform-specific syntax
  cleaned = cleaned
    .replace(/\[LIVE\]/gi, "")
    .replace(/\[DEBATE\]/gi, "")
    .replace(/\[HD\]/gi, "")
    .replace(/\[FULL\]/gi, "")
    .replace(/\|\s*\d{4}/g, "") // Remove year at the end with pipe
    .replace(
      /\s*\|\s*.*?(YouTube|Twitter|Twitch|ABC NEWS|NEWS UPDATE).*?$/i,
      ""
    ) // Remove platform names at the end
    .replace(/\s*\+\s*/g, " - ") // Replace + with - for better readability

  // Fix spacing and punctuation
  cleaned = cleaned
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .replace(/\s*([?!.,])\s*/g, "$1 ") // Fix spacing around punctuation
    .replace(/\s+$/g, "") // Remove trailing spaces
    .replace(/^\s+/g, "") // Remove leading spaces
    .replace(/\s*:\s*/g, ": ") // Fix spacing around colons
    .replace(/\s*-\s*/g, " - ") // Fix spacing around hyphens

  // Capitalize first letter of each sentence and after colons
  cleaned = cleaned.replace(/(^\w|\.\s+\w|\:\s+\w)/g, letter =>
    letter.toUpperCase()
  )

  // Remove emojis and special characters
  cleaned = cleaned.replace(
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}]/gu,
    ""
  )

  // Remove excessive punctuation
  cleaned = cleaned.replace(/([!?.]){2,}/g, "$1").replace(/\s*[!?.,]+\s*$/g, "") // Remove trailing punctuation

  // Ensure proper spacing after cleaning
  cleaned = cleaned.trim()

  // If title becomes empty after cleaning, return default
  return cleaned || "Untitled Debate"
}
