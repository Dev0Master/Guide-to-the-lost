"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

interface LabelProps extends React.ComponentProps<typeof LabelPrimitive.Root> {
  required?: boolean
  helperText?: string
  error?: boolean
}

function Label({
  className,
  required,
  helperText,
  error,
  children,
  ...props
}: LabelProps) {
  return (
    <div className="space-y-1 w-full">
      <LabelPrimitive.Root
        data-slot="label"
        className={cn(
          // Enhanced typography for accessibility
          "flex items-center gap-2 text-lg md:text-xl leading-relaxed font-semibold select-none",
          // Enhanced color contrast
          "text-foreground",
          // Error state
          error && "text-destructive",
          // Disabled state
          "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
          // Better focus indication
          "focus-within:text-primary",
          className
        )}
        {...props}
      >
        {children}
        {required && (
          <span 
            className={cn(
              "text-destructive text-xl font-bold",
              error ? "text-destructive" : "text-destructive"
            )}
            aria-label="مطلوب"
            title="هذا الحقل مطلوب"
          >
            *
          </span>
        )}
      </LabelPrimitive.Root>
      
      {helperText && (
        <p 
          className={cn(
            "text-sm leading-relaxed mt-1",
            error ? "text-destructive" : "text-muted-foreground"
          )}
          role="description"
        >
          {helperText}
        </p>
      )}
    </div>
  )
}

export { Label }
