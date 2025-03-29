"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component that catches errors in its child components
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-app-background-primary">
          <div className="p-6 bg-red-900/20 rounded-lg border border-red-800 max-w-md w-full">
            <h2 className="text-xl font-bold text-red-500 mb-4">
              Something went wrong
            </h2>
            <div className="text-red-300 mb-4">
              {this.state.error?.message || "An unexpected error occurred"}
            </div>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md">
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
