"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
<<<<<<< HEAD
import { Alert, AlertDescription, AlertTitle, AlertActions } from "@/components/ui/alert";
import { EmergencyIcon, InfoIcon } from "@/components/ui/icons";
=======
import { AlertTriangle, RefreshCw } from "lucide-react";
>>>>>>> 0b8b9e88898342a781af43426cec2fff85362bb8

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
<<<<<<< HEAD
  showErrorDetails?: boolean;
=======
>>>>>>> 0b8b9e88898342a781af43426cec2fff85362bb8
}

interface State {
  hasError: boolean;
  error?: Error;
<<<<<<< HEAD
  errorInfo?: ErrorInfo;
=======
>>>>>>> 0b8b9e88898342a781af43426cec2fff85362bb8
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
<<<<<<< HEAD
    this.setState({ errorInfo });
    
    // Report error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // Add error reporting here
    }
=======
>>>>>>> 0b8b9e88898342a781af43426cec2fff85362bb8
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
<<<<<<< HEAD
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleGoHome = () => {
    window.location.href = '/';
=======
    this.setState({ hasError: false, error: undefined });
>>>>>>> 0b8b9e88898342a781af43426cec2fff85362bb8
  };

  public render() {
    if (this.state.hasError) {
      return (
<<<<<<< HEAD
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <div className="max-w-2xl w-full space-y-6">
            {/* Emergency Alert */}
            <Alert variant="emergency" size="emergency">
              <EmergencyIcon size="lg" />
              <AlertTitle>
                {this.props.fallbackTitle || "حدث خطأ غير متوقع"}
              </AlertTitle>
              <AlertDescription>
                {this.props.fallbackMessage || 
                 "نعتذر، حدث خطأ في النظام. لا تقلق، يمكنك المحاولة مرة أخرى أو العودة للصفحة الرئيسية."}
              </AlertDescription>
              
              <AlertActions>
                <Button 
                  onClick={this.handleReset} 
                  variant="outline" 
                  size="lg"
                  className="font-bold"
                >
                  المحاولة مرة أخرى
                </Button>
                <Button 
                  onClick={this.handleGoHome}
                  variant="default"
                  size="lg"
                  className="font-bold"
                >
                  العودة للرئيسية
                </Button>
                <Button 
                  onClick={this.handleReload} 
                  variant="secondary"
                  size="lg"
                  className="font-bold"
                >
                  إعادة تحميل الصفحة
                </Button>
              </AlertActions>
            </Alert>

            {/* Helpful Information */}
            <Alert variant="info">
              <InfoIcon />
              <AlertTitle>معلومات مفيدة</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>إذا استمر الخطأ، يمكنك:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>التأكد من اتصال الإنترنت</li>
                  <li>تجربة متصفح آخر</li>
                  <li>مسح بيانات المتصفح (Cache)</li>
                  <li>التواصل مع الدعم الفني إذا كان الأمر عاجل</li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* Error Details (for development) */}
            {(this.props.showErrorDetails || process.env.NODE_ENV === 'development') && this.state.error && (
              <Card className="bg-muted p-6">
                <details className="space-y-3">
                  <summary className="cursor-pointer font-semibold text-lg text-foreground hover:text-primary">
                    تفاصيل الخطأ التقنية
                  </summary>
                  
                  <div className="space-y-4 mt-4">
                    <div>
                      <h4 className="font-semibold text-destructive mb-2">رسالة الخطأ:</h4>
                      <pre className="text-sm bg-destructive/10 p-3 rounded overflow-x-auto">
                        {this.state.error.message}
                      </pre>
                    </div>
                    
                    {this.state.error.stack && (
                      <div>
                        <h4 className="font-semibold text-muted-foreground mb-2">مسار الخطأ:</h4>
                        <pre className="text-xs bg-muted p-3 rounded overflow-x-auto max-h-48 overflow-y-auto">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                    
                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <h4 className="font-semibold text-muted-foreground mb-2">مكونات React:</h4>
                        <pre className="text-xs bg-muted p-3 rounded overflow-x-auto max-h-48 overflow-y-auto">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              </Card>
            )}
          </div>
        </div>
=======
        <Card className="p-6 bg-red-50 border-red-200">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <AlertTriangle className="w-12 h-12 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-red-900 mb-2">
                {this.props.fallbackTitle || "Something went wrong"}
              </h2>
              <p className="text-red-700 mb-4">
                {this.props.fallbackMessage || "An unexpected error occurred. Please try refreshing the page."}
              </p>
              {this.state.error && (
                <details className="text-left bg-red-100 rounded p-3 mb-4">
                  <summary className="cursor-pointer font-medium text-red-900">
                    Error Details
                  </summary>
                  <pre className="text-xs text-red-800 mt-2 whitespace-pre-wrap">
                    {this.state.error.message}
                    {this.state.error.stack && '\n\nStack trace:\n' + this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
            <div className="flex justify-center gap-3">
              <Button onClick={this.handleReset} variant="outline">
                Try Again
              </Button>
              <Button onClick={this.handleReload} className="bg-red-600 hover:bg-red-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload Page
              </Button>
            </div>
          </div>
        </Card>
>>>>>>> 0b8b9e88898342a781af43426cec2fff85362bb8
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;