import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-lg font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-60 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-6 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-4 focus-visible:ring-offset-2 active:scale-[0.97] shadow-sm border border-transparent relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg focus-visible:ring-primary/40 focus-visible:ring-offset-background",
        destructive:
          "bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 hover:shadow-lg focus-visible:ring-destructive/40 focus-visible:ring-offset-background",
        outline:
          "border-2 border-primary bg-background text-primary shadow-sm hover:bg-primary/10 hover:shadow-md focus-visible:ring-primary/40 focus-visible:ring-offset-background",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-md focus-visible:ring-secondary/40 focus-visible:ring-offset-background",
        success:
          "bg-success text-success-foreground shadow-md hover:bg-success/90 hover:shadow-lg focus-visible:ring-success/40 focus-visible:ring-offset-background",
        warning:
          "bg-warning text-warning-foreground shadow-md hover:bg-warning/90 hover:shadow-lg focus-visible:ring-warning/40 focus-visible:ring-offset-background",
        emergency:
          "bg-emergency text-emergency-foreground shadow-lg hover:bg-emergency/90 hover:shadow-xl focus-visible:ring-emergency/50 focus-visible:ring-offset-background animate-pulse hover:animate-none",
        info:
          "bg-info text-info-foreground shadow-md hover:bg-info/90 hover:shadow-lg focus-visible:ring-info/40 focus-visible:ring-offset-background",
        ghost:
          "hover:bg-accent hover:text-accent-foreground hover:shadow-sm focus-visible:ring-accent/40 focus-visible:ring-offset-background",
        link: "text-primary underline-offset-4 hover:underline focus-visible:ring-primary/40 focus-visible:ring-offset-background px-1",
      },
      size: {
        default: "min-h-[52px] px-6 py-3 text-lg min-w-[140px]", // Enhanced default size
        sm: "min-h-[48px] px-4 py-2 text-base min-w-[120px]", // Increased minimum size
        lg: "min-h-[56px] px-8 py-4 text-xl min-w-[160px]", // Larger for important actions
        xl: "min-h-[64px] px-10 py-5 text-2xl min-w-[200px]", // Emergency actions
        emergency: "min-h-[68px] px-12 py-6 text-2xl min-w-[240px] font-bold", // Dedicated emergency size
        icon: "size-12 min-w-[48px]", // Touch-friendly icon buttons
        "icon-lg": "size-16 min-w-[64px]", // Large icon buttons for accessibility
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
