import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-lg text-base font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-4 focus-visible:ring-ring/30 active:scale-[0.98] shadow-sm border border-transparent",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg focus-visible:ring-primary/30",
        destructive:
          "bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 hover:shadow-lg focus-visible:ring-destructive/30",
        outline:
          "border-2 border-primary bg-background text-primary shadow-sm hover:bg-primary/5 hover:shadow-md focus-visible:ring-primary/30",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-md focus-visible:ring-secondary/30",
        success:
          "bg-success text-success-foreground shadow-md hover:bg-success/90 hover:shadow-lg focus-visible:ring-success/30",
        warning:
          "bg-warning text-warning-foreground shadow-md hover:bg-warning/90 hover:shadow-lg focus-visible:ring-warning/30",
        ghost:
          "hover:bg-accent hover:text-accent-foreground hover:shadow-sm focus-visible:ring-accent/30",
        link: "text-primary underline-offset-4 hover:underline focus-visible:ring-primary/30",
      },
      size: {
        default: "min-h-[48px] px-6 py-3 text-base",
        sm: "min-h-[44px] px-4 py-2 text-sm",
        lg: "min-h-[56px] px-8 py-4 text-lg",
        xl: "min-h-[64px] px-10 py-5 text-xl",
        icon: "size-12",
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
