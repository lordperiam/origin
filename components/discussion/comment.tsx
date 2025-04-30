"use server"

/**
 * @description
 * This server component renders an individual comment in the discussion section of the Neurogenesis app.
 * It displays the username, comment content, and creation timestamp in a card layout.
 *
 * Key features:
 * - Static Display: Shows comment details without interactivity
 * - Consistent Styling: Uses Shadcn Card with Neurogenesis design system
 * - Timestamp Formatting: Converts ISO date to readable format
 *
 * @dependencies
 * - @/components/ui/card: Shadcn Card components for layout
 * - date-fns: Formats the createdAt timestamp
 *
 * @notes
 * - Server component for rendering efficiency per project rules
 * - No client-side logic needed; static display suffices for now
 * - Edge case: Handles missing username/content with fallbacks
 * - Limitation: No edit/delete functionality yet; planned for future steps
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

/**
 * Props interface for the Comment component.
 *
 * @property {string} username - Display name of the commenter
 * @property {string} content - Text content of the comment
 * @property {string} createdAt - ISO timestamp of comment creation
 */
interface CommentProps {
  username: string
  content: string
  createdAt: string
}

/**
 * Comment component that renders a single comment.
 *
 * @param {CommentProps} props - Component props with comment details
 * @returns {JSX.Element} The rendered comment card
 */
export default async function Comment({
  username,
  content,
  createdAt
}: CommentProps) {
  // Format the timestamp into a readable string (e.g., "October 10, 2023, 2:30 PM")
  const formattedDate = format(new Date(createdAt), "MMMM d, yyyy, h:mm a")

  return (
    <Card className="bg-card text-foreground border-border">
      <CardHeader>
        <CardTitle className="text-lg text-white">
          {username || "Anonymous"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-2 text-white">{content || "No content provided"}</p>
        <p className="text-muted-foreground text-sm">
          Posted on {formattedDate}
        </p>
      </CardContent>
    </Card>
  )
}
