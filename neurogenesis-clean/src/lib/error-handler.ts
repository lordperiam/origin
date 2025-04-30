type ErrorLogLevel = 'info' | 'warning' | 'error' | 'critical';

interface ErrorDetails {
  message: string;
  stack?: string;
  componentName?: string;
  userId?: string;
  timestamp: number;
  url?: string;
  severity: ErrorLogLevel;
}

/**
 * Global error handler
 * @param error The error that occurred
 * @param componentName Optional component name where error occurred
 * @param level Error severity level
 */
export function handleError(
  error: unknown, 
  componentName?: string, 
  level: ErrorLogLevel = 'error'
): void {
  const errorDetails: ErrorDetails = {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    componentName,
    timestamp: Date.now(),
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    severity: level
  };
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error captured:', errorDetails);
  }
  
  // In production, you would send to a monitoring service
  // sendToMonitoringService(errorDetails);
}

/**
 * Safely execute a function that might throw an error
 * @param fn Function to execute
 * @param fallbackValue Value to return if function throws
 * @param errorHandler Optional custom error handler
 */
export function trySafe<T, F>(
  fn: () => T, 
  fallbackValue: F, 
  errorHandler?: (error: unknown) => void
): T | F {
  try {
    return fn();
  } catch (error) {
    if (errorHandler) {
      errorHandler(error);
    } else {
      handleError(error);
    }
    return fallbackValue;
  }
}