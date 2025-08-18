import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const loadingVariants = cva(
  "inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "text-primary",
        destructive: "text-destructive",
        success: "text-success",
        warning: "text-warning",
        emergency: "text-emergency",
        muted: "text-muted-foreground",
      },
      size: {
        default: "size-6",
        sm: "size-4",
        lg: "size-8",
        xl: "size-12",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof loadingVariants> {
  'aria-label'?: string
}

function LoadingSpinner({ className, variant, size, ...props }: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label={props["aria-label"] || "جارٍ التحميل"}
      className={cn(loadingVariants({ variant, size }), className)}
      {...props}
    >
      <svg
        className="animate-spin"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="sr-only">جارٍ التحميل...</span>
    </div>
  )
}

interface LoadingDotsProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof loadingVariants> {
  'aria-label'?: string
}

function LoadingDots({ className, variant, size, ...props }: LoadingDotsProps) {
  return (
    <div
      role="status"
      aria-label={props["aria-label"] || "جارٍ التحميل"}
      className={cn("flex items-center space-x-1", loadingVariants({ variant }), className)}
      {...props}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "animate-pulse rounded-full bg-current",
            size === "sm" && "size-2",
            size === "default" && "size-3",
            size === "lg" && "size-4",
            size === "xl" && "size-6"
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: "1.4s"
          }}
        />
      ))}
      <span className="sr-only">جارٍ التحميل...</span>
    </div>
  )
}

interface LoadingOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  message?: string
  variant?: VariantProps<typeof loadingVariants>["variant"]
}

function LoadingOverlay({ className, children, message = "جارٍ التحميل...", variant = "default", ...props }: LoadingOverlayProps) {
  return (
    <div
      role="status"
      aria-label={message}
      className={cn(
        "absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm",
        className
      )}
      {...props}
    >
      <LoadingSpinner variant={variant} size="xl" />
      <p className="mt-4 text-lg font-medium text-foreground text-center max-w-md px-4">
        {message}
      </p>
      {children}
      <span className="sr-only">{message}</span>
    </div>
  )
}

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number
  avatar?: boolean
}

function Skeleton({ className, lines = 1, avatar = false, ...props }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse space-y-3", className)} {...props}>
      {avatar && (
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="rounded-full bg-muted size-12"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      )}
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-4 bg-muted rounded",
              i === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
            )}
          />
        ))}
      </div>
    </div>
  )
}

export { 
  LoadingSpinner, 
  LoadingDots, 
  LoadingOverlay, 
  Skeleton, 
  loadingVariants 
}
export type { 
  LoadingSpinnerProps, 
  LoadingDotsProps, 
  LoadingOverlayProps, 
  SkeletonProps 
}