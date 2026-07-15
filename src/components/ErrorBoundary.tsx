import { Component, type ErrorInfo, type ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled UI error", error, info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="error-boundary" role="alert">
        <div className="error-boundary-card">
          <h1>Something went wrong</h1>
          <p>
            The map view hit an unexpected error. Your saved schools and notes are stored
            locally and are safe. Reloading usually fixes it.
          </p>
          <button className="primary-button" type="button" onClick={this.handleReload}>
            Reload app
          </button>
          {this.state.error?.message ? (
            <pre className="error-boundary-detail">{this.state.error.message}</pre>
          ) : null}
        </div>
      </div>
    );
  }
}
