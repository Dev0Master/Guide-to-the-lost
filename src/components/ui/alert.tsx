import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border-l-4 p-6 [&>svg~*]:pl-8 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-6 [&>svg]:top-6 [&>svg]:text-foreground [&>svg]:size-6",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border-l-border shadow-sm",
        destructive:
          "border-l-destructive/60 text-destructive-foreground bg-destructive/5 [&>svg]:text-destructive shadow-md",
        success:
          "border-l-success/60 text-success-foreground bg-success/5 [&>svg]:text-success shadow-md",
        warning:
          "border-l-warning/60 text-warning-foreground bg-warning/5 [&>svg]:text-warning shadow-md",
        emergency:
          "border-l-emergency/80 text-emergency-foreground bg-emergency/10 [&>svg]:text-emergency shadow-lg animate-pulse",
        info:
          "border-l-info/60 text-info-foreground bg-info/5 [&>svg]:text-info shadow-md",
      },
      size: {
        default: "p-6",
        sm: "p-4 text-sm",
        lg: "p-8 text-lg",
        emergency: "p-8 text-xl border-l-8", // Extra prominent for emergencies
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  icon?: React.ReactNode
}

function Alert({ className, variant, size, icon, children, ...props }: AlertProps) {
  return (
    <div
      role={variant === 'destructive' || variant === 'emergency' ? 'alert' : 'status'}
      aria-live={variant === 'emergency' ? 'assertive' : 'polite'}
      className={cn(alertVariants({ variant, size }), className)}
      {...props}
    >
      {icon && (
        <div className="absolute left-6 top-6 size-6 [&>svg]:size-6">
          {icon}
        </div>
      )}
      <div className={cn("space-y-2", icon && "pl-8")}>
        {children}
      </div>
    </div>
  )
}

function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5
      className={cn("mb-2 font-bold leading-tight text-xl", className)}
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div
      className={cn("text-base leading-relaxed [&_p]:leading-relaxed", className)}
      {...props}
    />
  )
}

function AlertActions({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col sm:flex-row gap-3 mt-4", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertActions, alertVariants }
export type { AlertProps }