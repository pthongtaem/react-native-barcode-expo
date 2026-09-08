import React from 'react';
declare class ErrorBoundary extends React.Component<{
    children: any;
}, {
    hasError: boolean;
}> {
    constructor(props: any);
    static getDerivedStateFromError(error: any): {
        hasError: boolean;
    };
    componentDidCatch(error: any, errorInfo: any): void;
    render(): any;
}
export default ErrorBoundary;
