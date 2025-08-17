import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input flex min-h-[48px] w-full min-w-0 rounded-lg border-2 bg-input px-4 py-3 text-base md:text-lg shadow-sm transition-all duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-base file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60",
        "focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/30 focus-visible:shadow-md",
        "aria-invalid:ring-destructive/30 aria-invalid:border-destructive hover:border-ring/60",
        className
      )}
      {...props}
    />
  )
}

export { Input }
