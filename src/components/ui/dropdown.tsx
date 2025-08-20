"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { dropdownAnimations } from "@/lib/animations";

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  align?: 'start' | 'center' | 'end';
  className?: string;
}

export function Dropdown({
  trigger,
  children,
  isOpen,
  onOpenChange,
  align = 'start',
  className
}: DropdownProps) {
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Handle click outside to close
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onOpenChange(false);
      }
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onOpenChange]);

  // Animate dropdown open/close
  React.useEffect(() => {
    if (menuRef.current) {
      if (isOpen) {
        dropdownAnimations.open(menuRef.current);
      }
    }
  }, [isOpen]);

  const alignmentClasses = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0'
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <div
        onClick={() => onOpenChange(!isOpen)}
        className="cursor-pointer"
      >
        {trigger}
      </div>
      
      {isOpen && (
        <div
          ref={menuRef}
          className={cn(
            "absolute top-full mt-2 z-50",
            "bg-popover/95 backdrop-blur-sm rounded-xl shadow-xl border border-border",
            "py-3 px-4 overflow-hidden theme-transition",
            alignmentClasses[align]
          )}
          role="menu"
          aria-orientation="vertical"
          style={{ opacity: 0, transform: 'translateY(-10px) scale(0.95)' }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function DropdownItem({ 
  children, 
  onClick, 
  disabled = false, 
  className 
}: DropdownItemProps) {
  return (
    <button
      className={cn(
        "w-full px-3 py-2 text-sm text-left text-popover-foreground rounded-md",
        "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        "focus:outline-none transition-colors theme-transition",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "whitespace-nowrap",
        className
      )}
      onClick={onClick}
      disabled={disabled}
      role="menuitem"
    >
      {children}
    </button>
  );
}