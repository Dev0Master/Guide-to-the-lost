"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./dialog";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  autoClose?: number; // Auto-close after N milliseconds
  showCancel?: boolean;
  hideClose?: boolean; // Hide close button
}

export function AlertDialog({
  open,
  onOpenChange,
  type = 'info',
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  autoClose,
  showCancel = false,
  hideClose = false
}: AlertDialogProps) {
  useEffect(() => {
    if (open && autoClose) {
      const timer = setTimeout(() => {
        onOpenChange(false);
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [open, autoClose, onOpenChange]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />;
      case 'info':
      default:
        return <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'success':
        return {
          border: 'border-emerald-200 dark:border-emerald-800',
          bg: 'bg-emerald-50 dark:bg-emerald-950/50',
          title: 'text-emerald-900 dark:text-emerald-100',
          desc: 'text-emerald-700 dark:text-emerald-300'
        };
      case 'error':
        return {
          border: 'border-red-200 dark:border-red-800',
          bg: 'bg-red-50 dark:bg-red-950/50',
          title: 'text-red-900 dark:text-red-100',
          desc: 'text-red-700 dark:text-red-300'
        };
      case 'warning':
        return {
          border: 'border-yellow-200 dark:border-yellow-800',
          bg: 'bg-yellow-50 dark:bg-yellow-950/50',
          title: 'text-yellow-900 dark:text-yellow-100',
          desc: 'text-yellow-700 dark:text-yellow-300'
        };
      case 'info':
      default:
        return {
          border: 'border-blue-200 dark:border-blue-800',
          bg: 'bg-blue-50 dark:bg-blue-950/50',
          title: 'text-blue-900 dark:text-blue-100',
          desc: 'text-blue-700 dark:text-blue-300'
        };
    }
  };

  const colors = getColorClasses();

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={hideClose ? undefined : onOpenChange}>
      <DialogContent className={cn("max-w-md", colors.border, colors.bg)}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {getIcon()}
            <DialogTitle className={colors.title}>
              {title}
            </DialogTitle>
          </div>
          {description && (
            <DialogDescription className={colors.desc}>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <div className="flex gap-2 mt-4">
          <Button 
            onClick={handleConfirm}
            className="flex-1"
            variant={type === 'error' ? 'destructive' : 'default'}
          >
            {confirmText || 'موافق'}
          </Button>
          {showCancel && (
            <Button 
              onClick={handleCancel}
              variant="outline"
              className="flex-1"
            >
              {cancelText || 'إلغاء'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook for easier usage
export function useAlertDialog() {
  const [alertState, setAlertState] = useState<{
    open: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    description?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
    autoClose?: number;
    hideClose?: boolean;
  }>({
    open: false,
    type: 'info',
    title: '',
  });

  const showAlert = (config: Omit<typeof alertState, 'open'>) => {
    setAlertState({ ...config, open: true });
  };

  const hideAlert = () => {
    setAlertState(prev => ({ ...prev, open: false }));
  };

  return {
    alertProps: {
      ...alertState,
      onOpenChange: hideAlert,
    },
    showAlert,
    hideAlert,
  };
}