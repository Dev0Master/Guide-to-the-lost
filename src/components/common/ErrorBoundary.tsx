"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle, AlertActions } from "@/components/ui/alert";
import { EmergencyIcon, InfoIcon } from "@/components/ui/icons";
import { errorTranslations } from "@/localization/error/errorTranslations";
import { useLanguageStore } from "@/store/language/languageStore";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  showErrorDetails?: boolean;
}

interface InternalProps extends Props {
  translations: typeof errorTranslations.ar.boundary;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundaryInternal extends Component<InternalProps, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Report error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // Add error reporting here
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <div className="max-w-2xl w-full space-y-6">
            {/* Emergency Alert */}
            <Alert variant="emergency" size="emergency">
              <EmergencyIcon size="lg" />
              <AlertTitle>
                {this.props.fallbackTitle || this.props.translations.unexpectedError}
              </AlertTitle>
              <AlertDescription>
                {this.props.fallbackMessage || this.props.translations.systemErrorDescription}
              </AlertDescription>
              
              <AlertActions>
                <Button 
                  onClick={this.handleReset} 
                  variant="outline" 
                  size="lg"
                  className="font-bold"
                >
                  {this.props.translations.tryAgain}
                </Button>
                <Button 
                  onClick={this.handleGoHome}
                  variant="default"
                  size="lg"
                  className="font-bold"
                >
                  {this.props.translations.returnHome}
                </Button>
                <Button 
                  onClick={this.handleReload} 
                  variant="secondary"
                  size="lg"
                  className="font-bold"
                >
                  {this.props.translations.reloadPage}
                </Button>
              </AlertActions>
            </Alert>

            {/* Helpful Information */}
            <Alert variant="info">
              <InfoIcon />
              <AlertTitle>{this.props.translations.helpfulInfo}</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>{this.props.translations.persistErrorInfo}</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>{this.props.translations.checkInternet}</li>
                  <li>{this.props.translations.tryAnotherBrowser}</li>
                  <li>{this.props.translations.clearCache}</li>
                  <li>{this.props.translations.contactSupport}</li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* Error Details (for development) */}
            {(this.props.showErrorDetails || process.env.NODE_ENV === 'development') && this.state.error && (
              <Card className="bg-muted p-6">
                <details className="space-y-3">
                  <summary className="cursor-pointer font-semibold text-lg text-foreground hover:text-primary">
                    {this.props.translations.technicalDetails}
                  </summary>
                  
                  <div className="space-y-4 mt-4">
                    <div>
                      <h4 className="font-semibold text-destructive mb-2">{this.props.translations.errorMessage}</h4>
                      <pre className="text-sm bg-destructive/10 p-3 rounded overflow-x-auto">
                        {this.state.error.message}
                      </pre>
                    </div>
                    
                    {this.state.error.stack && (
                      <div>
                        <h4 className="font-semibold text-muted-foreground mb-2">{this.props.translations.errorPath}</h4>
                        <pre className="text-xs bg-muted p-3 rounded overflow-x-auto max-h-48 overflow-y-auto">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                    
                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <h4 className="font-semibold text-muted-foreground mb-2">{this.props.translations.reactComponents}</h4>
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
      );
    }

    return this.props.children;
  }
}

// Wrapper component to provide translations to the class component
const ErrorBoundary: React.FC<Props> = (props) => {
  const { currentLanguage } = useLanguageStore();
  const translations = errorTranslations[currentLanguage].boundary;
  
  return <ErrorBoundaryInternal {...props} translations={translations} />;
};

export default ErrorBoundary;