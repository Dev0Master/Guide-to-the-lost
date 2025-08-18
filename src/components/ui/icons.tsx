import * as React from "react"
import { cn } from "@/lib/utils"

interface IconProps extends React.SVGProps<SVGSVGElement> {
  'aria-label'?: string
  size?: 'sm' | 'default' | 'lg' | 'xl'
}

const iconSizeClasses = {
  sm: 'size-4',
  default: 'size-5',
  lg: 'size-6',
  xl: 'size-8'
}

// Emergency and Safety Icons
export function EmergencyIcon({ className, size = 'default', ...props }: IconProps) {
  return (
    <svg
      className={cn(iconSizeClasses[size], className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={props['aria-label'] || 'طوارئ'}
      role="img"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  )
}

export function LocationIcon({ className, size = 'default', ...props }: IconProps) {
  return (
    <svg
      className={cn(iconSizeClasses[size], className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={props['aria-label'] || 'موقع'}
      role="img"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

export function PersonIcon({ className, size = 'default', ...props }: IconProps) {
  return (
    <svg
      className={cn(iconSizeClasses[size], className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={props['aria-label'] || 'شخص'}
      role="img"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}

export function SearchIcon({ className, size = 'default', ...props }: IconProps) {
  return (
    <svg
      className={cn(iconSizeClasses[size], className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={props['aria-label'] || 'بحث'}
      role="img"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

export function PhoneIcon({ className, size = 'default', ...props }: IconProps) {
  return (
    <svg
      className={cn(iconSizeClasses[size], className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={props['aria-label'] || 'هاتف'}
      role="img"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  )
}

// Status Icons
export function CheckCircleIcon({ className, size = 'default', ...props }: IconProps) {
  return (
    <svg
      className={cn(iconSizeClasses[size], className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={props['aria-label'] || 'تم بنجاح'}
      role="img"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

export function XCircleIcon({ className, size = 'default', ...props }: IconProps) {
  return (
    <svg
      className={cn(iconSizeClasses[size], className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={props['aria-label'] || 'خطأ'}
      role="img"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

export function InfoIcon({ className, size = 'default', ...props }: IconProps) {
  return (
    <svg
      className={cn(iconSizeClasses[size], className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={props['aria-label'] || 'معلومات'}
      role="img"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

// Navigation Icons
export function ArrowLeftIcon({ className, size = 'default', ...props }: IconProps) {
  return (
    <svg
      className={cn(iconSizeClasses[size], className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={props['aria-label'] || 'السابق'}
      role="img"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  )
}

export function ArrowRightIcon({ className, size = 'default', ...props }: IconProps) {
  return (
    <svg
      className={cn(iconSizeClasses[size], className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={props['aria-label'] || 'التالي'}
      role="img"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}

export function HomeIcon({ className, size = 'default', ...props }: IconProps) {
  return (
    <svg
      className={cn(iconSizeClasses[size], className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={props['aria-label'] || 'الرئيسية'}
      role="img"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m3 12 2-2m0 0 7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}

// Accessibility Helper Icon (for screen readers)
interface ScreenReaderIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode
}

export function ScreenReaderIcon({ className = "sr-only", children, ...props }: ScreenReaderIconProps) {
  return (
    <span className={className} {...props} aria-hidden="true">
      {children || "أيقونة"}
    </span>
  )
}

// Map and Direction Icons
export function MapIcon({ className, size = 'default', ...props }: IconProps) {
  return (
    <svg
      className={cn(iconSizeClasses[size], className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={props['aria-label'] || 'خريطة'}
      role="img"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  )
}

export function NavigationIcon({ className, size = 'default', ...props }: IconProps) {
  return (
    <svg
      className={cn(iconSizeClasses[size], className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={props['aria-label'] || 'ملاحة'}
      role="img"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8V4l8 8-8 8V16H4a2 2 0 01-2-2v-4a2 2 0 012-2h8z" />
    </svg>
  )
}