import React, { Suspense } from "react";

import { PageErrorPopup } from "widgets/PageErrorPopup";

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary
    extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error) {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // TODO: implement service for logs
        console.log(`error: ${error}`);
        console.log(`errorInfo: ${JSON.stringify(errorInfo)}`);
        console.log(`componentStack: ${errorInfo.componentStack}`);
    }

    render() {
        const { hasError } = this.state;
        const { children } = this.props;

        if (hasError) {
            return (
                <Suspense fallback="">
                    <PageErrorPopup />
                </Suspense>
            );
        }

        return children;

        // TODO: consider it: perhaps keep the app and show the popup over it
        // return (
        //     <div>
        //         {children}
        //         {
        //             hasError
        //             && (
        //                 <Suspense fallback="">
        //                     <PageErrorPopup />
        //                 </Suspense>
        //             )
        //         }
        //     </div>
        // );
    }
}

export default ErrorBoundary;
