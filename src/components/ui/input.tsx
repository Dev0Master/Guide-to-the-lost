import * as React from "react"

import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean
  helperText?: string
  label?: string
}

function Input({ className, type, error, helperText, label, ...props }: InputProps) {
  const inputId = React.useId()
  const helperTextId = React.useId()
  
  return (
<<<<<<< HEAD
    <div className="space-y-2 w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-base font-semibold text-foreground leading-relaxed"
        >
          {label}
          {props.required && <span className="text-destructive ml-1 text-lg">*</span>}
        </label>
=======
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input flex min-h-[48px] w-full min-w-0 rounded-lg border-2 bg-input px-4 py-3 text-base md:text-lg shadow-sm transition-all duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-base file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60",
        "focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/30 focus-visible:shadow-md",
        "aria-invalid:ring-destructive/30 aria-invalid:border-destructive hover:border-ring/60",
        className
>>>>>>> 0b8b9e88898342a781af43426cec2fff85362bb8
      )}
      <input
        id={inputId}
        type={type}
        data-slot="input"
        aria-invalid={error || props["aria-invalid"]}
        aria-describedby={helperText ? helperTextId : props["aria-describedby"]}
        className={cn(
          // Base styles with enhanced accessibility
          "file:text-foreground placeholder:text-muted-foreground/70 selection:bg-primary selection:text-primary-foreground border-input flex min-h-[52px] w-full min-w-0 rounded-lg border-2 bg-input px-4 py-3 text-lg shadow-sm transition-all duration-200 outline-none",
          // File input styles
          "file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-base file:font-medium file:mr-4 file:py-1 file:px-2 file:rounded-md file:bg-primary file:text-primary-foreground",
          // Disabled state
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-muted/50",
          // Focus states with enhanced visibility
          "focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:shadow-lg",
          // Hover state
          "hover:border-ring/60 hover:shadow-md",
          // Error state
          error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/40",
          // Valid state (for forms with validation)
          "valid:border-success focus-visible:valid:border-success focus-visible:valid:ring-success/40",
          // Enhanced contrast for better readability
          "placeholder:text-muted-foreground/60",
          className
        )}
        {...props}
      />
      {helperText && (
        <p 
          id={helperTextId}
          className={cn(
            "text-sm leading-relaxed",
            error ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  )
}

export { Input }
