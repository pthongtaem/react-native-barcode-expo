import React from 'react';
declare class ErrorBoundary extends React.Component<{
    children: React.ReactNode;
}, {
    hasError: boolean;
}> {
    constructor(props: any);
    static getDerivedStateFromError(): {
        hasError: boolean;
    };
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void;
    render(): string | number | bigint | boolean | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode>> | React.JSX.Element;
}
export default ErrorBoundary;
//# sourceMappingURL=ErrorBoundary.d.ts.map