"use client"

/**
 * @description
 * This client component renders a discussion section for debate analyses in the Neurogenesis app.
 * It provides a form for users to submit comments and displays a list of existing comments.
 *
 * Key features:
 * - Comment Form: Allows authenticated users to submit comments with validation
 * - Comment List: Displays a list of comments with user attribution
 * - Responsive Design: Adapts to screen sizes with Tailwind CSS
 * - Styling: Uses Neurogenesis design system (black bg, gold primary, white text)
 *
 * @dependencies
 * - @clerk/nextjs: Provides useUser for authentication data
 * - react-hook-form: Manages form state and validation
 * - zod: Validates form input schema
 * - @/components/ui/form: Shadcn Form components for UI
 * - @/components/ui/input: Shadcn Input for text entry
 * - @/components/ui/button: Shadcn Button for submission
 * - @/components/discussion/comment: Renders individual comments
 *
 * @notes
 * - Client-side to support form interactivity and state management
 * - Comments are mocked in state; server persistence awaits future server actions
 * - Edge case: Unauthenticated users see a login prompt instead of the form
 * - Limitation: No pagination or real-time updates yet; static comment list
 */

import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Comment from "@/components/discussion/comment"
import Link from "next/link"

/**
 * Schema for comment form validation.
 * Ensures comments are non-empty and within reasonable length limits.
 */
const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(500, "Comment must be 500 characters or less")
})

/**
 * Interface for a comment object.
 * Represents a single comment with user details and content.
 *
 * @property {string} id - Unique identifier for the comment
 * @property {string} userId - Clerk user ID of the commenter
 * @property {string} username - Display name of the commenter
 * @property {string} content - Text content of the comment
 * @property {string} createdAt - ISO timestamp of comment creation
 */
interface CommentData {
  id: string
  userId: string
  username: string
  content: string
  createdAt: string
}

/**
 * Props interface for the CommentSection component.
 *
 * @property {string} analysisId - ID of the analysis being commented on
 */
interface CommentSectionProps {
  analysisId: string
}

/**
 * CommentSection component that renders the discussion UI.
 *
 * @param {CommentSectionProps} props - Component props with analysisId
 * @returns {JSX.Element} The rendered comment section
 */
export default function CommentSection({ analysisId }: CommentSectionProps) {
  const { user, isSignedIn } = useUser()

  // Mock comment state (to be replaced with server data in future steps)
  const [comments, setComments] = useState<CommentData[]>([
    // Example mock comment for initial display
    {
      id: "1",
      userId: "mock_user_1",
      username: "Test User",
      content: "This analysis raises some interesting points!",
      createdAt: new Date().toISOString()
    }
  ])

  // Initialize form with validation schema
  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: "" }
  })

  /**
   * Handles form submission by adding a new comment to the state.
   * In a future step, this will call a server action to persist the comment.
   *
   * @param {z.infer<typeof commentSchema>} values - Form values with comment content
   */
  const onSubmit = (values: z.infer<typeof commentSchema>) => {
    if (!isSignedIn || !user) return // Safety check, though form is hidden if not signed in

    const newComment: CommentData = {
      id: Date.now().toString(), // Temporary ID; will use UUID from server later
      userId: user.id,
      username: user.username || user.firstName || "Anonymous",
      content: values.content,
      createdAt: new Date().toISOString()
    }

    setComments(prev => [newComment, ...prev]) // Add new comment to top
    form.reset() // Clear form after submission
  }

  return (
    <div className="bg-card text-foreground rounded-lg p-6 shadow-lg">
      <h2 className="mb-4 text-2xl font-bold text-white">Discussion</h2>
      {/* Comment Form */}
      {isSignedIn ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mb-6 space-y-4"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Add a Comment</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your thoughts on this analysis..."
                      className="bg-input text-foreground border-border"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Submit
            </Button>
          </form>
        </Form>
      ) : (
        <div className="mb-6 text-center">
          <p className="text-white">
            Please{" "}
            <Link href="/login" className="text-primary hover:underline">
              sign in
            </Link>{" "}
            to add a comment.
          </p>
        </div>
      )}
      {/* Comment List */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map(comment => (
            <Comment
              key={comment.id}
              username={comment.username}
              content={comment.content}
              createdAt={comment.createdAt}
            />
          ))
        ) : (
          <p className="text-muted-foreground">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  )
}
