import { Component } from "react";

/**
 * Error boundary that renders nothing (or an optional fallback) on error.
 * Errors are logged to console but never shown to viewers.
 */
export default class ErrorBoundary extends Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.warn("[ErrorBoundary]", error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback ?? null;
        }
        return this.props.children;
    }
}
