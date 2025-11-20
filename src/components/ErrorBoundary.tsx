// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, Button, Container } from 'react-bootstrap';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({ error, errorInfo });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <Container className="my-5">
                    <Alert variant="danger">
                        <Alert.Heading>Oops! Terjadi kesalahan</Alert.Heading>
                        <p>
                            Aplikasi mengalami kesalahan tak terduga. Silakan coba refresh halaman
                            atau hubungi administrator jika masalah berlanjut.
                        </p>

                        {process.env.NODE_ENV === 'development' && (
                            <details className="mt-3">
                                <summary>Detail Error (Development Mode)</summary>
                                <pre className="mt-2 p-3 bg-light border rounded">
                                    <code>
                                        {this.state.error?.toString()}
                                        {this.state.errorInfo?.componentStack}
                                    </code>
                                </pre>
                            </details>
                        )}

                        <hr />
                        <div className="d-flex gap-2">
                            <Button variant="outline-danger" onClick={this.handleReset}>
                                Coba Lagi
                            </Button>
                            <Button variant="outline-secondary" onClick={() => window.location.reload()}>
                                Refresh Halaman
                            </Button>
                        </div>
                    </Alert>
                </Container>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;