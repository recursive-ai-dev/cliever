import { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../services/logger';
import { AnalyticsService } from '../services/analyticsService';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Production-grade Error Boundary component
 * Catches React component errors and provides graceful fallback UI
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to analytics service (with error handling to prevent cascading failures)
    try {
      AnalyticsService.trackError(error, {
        componentStack: errorInfo.componentStack,
        errorBoundary: true
      }, 'critical');
    } catch (analyticsError) {
      // If analytics fails, log to console as fallback
      console.error('Analytics service failed during error handling:', analyticsError);
    }

    // Log to logger service (also with error handling)
    try {
      logger.error('React Error Boundary caught error', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      });
    } catch (loggerError) {
      // If logger fails, log to console as final fallback
      console.error('Logger service failed during error handling:', loggerError);
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null
    });
  };

  override render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center p-6"
             style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
          <div className="max-w-2xl w-full rounded-2xl p-8"
               style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--error)' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                   style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid var(--error)' }}>
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold font-mono" style={{ color: 'var(--error)' }}>SYSTEM ERROR</h1>
                <p className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>Component failure detected</p>
              </div>
            </div>

            <div className="rounded-xl p-4 mb-6"
                 style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
              <p className="text-sm font-mono mb-2" style={{ color: 'var(--text-secondary)' }}>Error Details:</p>
              <pre className="text-xs overflow-x-auto" style={{ color: 'var(--error)' }}>
                {this.state.error?.message || 'Unknown error'}
              </pre>
            </div>

            <div className="flex gap-4">
              <button
                onClick={this.handleReset}
                className="flex-1 font-mono font-bold py-3 px-6 rounded-lg transition-all"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
              >
                RETRY
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 font-mono py-3 px-6 rounded-lg transition-all"
                style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
              >
                RELOAD PAGE
              </button>
            </div>

            <p className="text-xs font-mono mt-6 text-center" style={{ color: 'var(--text-muted)' }}>
              Error has been logged. If this persists, please contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
