import * as React from "react"

import { cn } from "@/lib/utils"

interface CardProps extends React.ComponentProps<"div"> {
  as?: 'div' | 'article' | 'section'
  interactive?: boolean
}

function Card({ className, as: Component = 'div', interactive = false, ...props }: CardProps) {
  return (
    <Component
      data-slot="card"
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border-2 border-border py-8 px-6 shadow-lg transition-all duration-200",
        // Enhanced shadow and hover effects
        "hover:shadow-xl focus-within:shadow-xl",
        // Interactive card support
        interactive && "cursor-pointer hover:bg-card/95 focus-visible:ring-4 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        // Better spacing for touch targets
        "min-h-[120px]",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-3 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

interface CardTitleProps extends React.ComponentProps<"h3"> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

function CardTitle({ className, as: Component = 'h3', ...props }: CardTitleProps) {
  return (
    <Component
      data-slot="card-title"
      className={cn(
        "text-2xl md:text-3xl leading-tight font-bold text-foreground mb-2",
        // Enhanced contrast for readability
        "contrast-more:text-black dark:contrast-more:text-white",
        className
      )}
      {...props}
    />
  )
}


function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn(
        "text-muted-foreground text-lg md:text-xl leading-relaxed mb-4",
        // Enhanced contrast and readability
        "contrast-more:text-gray-700 dark:contrast-more:text-gray-300",
        className
      )}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
