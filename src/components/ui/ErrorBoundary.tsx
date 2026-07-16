import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Reusable Error Boundary component to capture client-side rendering errors.
 */
export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error inside StadiumOps client:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="p-6 max-w-lg mx-auto my-12 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg shadow-md"
        >
          <h2 className="text-xl font-bold text-red-800 dark:text-red-200">
            System Error Occurred
          </h2>
          <p className="mt-2 text-sm text-red-700 dark:text-red-300">
            A rendering or script error prevented this widget from drawing. Try reloading.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-sm font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Reload Console
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
