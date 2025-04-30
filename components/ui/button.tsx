"use client"

/**
 * @description
 * A customizable button component built with Shadcn.
 * This component provides various styles and sizes for buttons, making it reusable across the Neurogenesis application.
 *
 * Key features:
 * - Variants: Supports styles like default, destructive, outline, secondary, ghost, and link
 * - Sizes: Offers sizes including default, small, large, and icon-only
 * - Customizable: Allows passing additional props and class names for further styling
 *
 * @dependencies
 * - React: Core library for building the component
 * - clsx: Utility for conditional class name concatenation
 * - Tailwind Merge: Merges Tailwind classes efficiently
 * - class-variance-authority: Defines button variants and sizes
 * - @radix-ui/react-slot: Enables composition with the Slot component
 *
 * @notes
 * - Uses forwardRef for DOM access via ref forwarding
 * - Handles disabled state by adjusting opacity and pointer events
 * - The icon variant is optimized for buttons containing only an icon
 * - Follows Neurogenesis design system: gold primary (#FFD700) on black background
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Define button variants and sizes using cva
const buttonVariants = cva(
  "focus-visible:ring-ring ring-offset-background inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] hover:shadow-md",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:scale-[1.02]",
        outline:
          "border-input hover:bg-accent hover:text-accent-foreground border hover:scale-[1.02] hover:shadow-sm",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-[1.02]",
        ghost:
          "hover:bg-accent hover:text-accent-foreground hover:scale-[1.02]",
        link: "text-primary underline-offset-4 hover:scale-[1.01] hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

// Interface for Button props, combining HTML attributes and variant props
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean // Allows the button to render as a child component via Slot
}

// Button component with ref forwarding
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // Use Slot if asChild is true, otherwise use a standard button element
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button" // Set display name for debugging

export { Button, buttonVariants }
