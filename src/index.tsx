import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "shared/i18n/i18n";
import ThemeProvider from "app/providers/ThemeProvider/ui/ThemeProvider";
import App from "app/App";
import { ErrorBoundary } from "app/providers/ErrorBoundary";

const root = ReactDOM.createRoot(
    document.getElementById("root")
);

root.render(
    <BrowserRouter>
        <ErrorBoundary>
            <ThemeProvider>
                <App />
            </ThemeProvider>
        </ErrorBoundary>
    </BrowserRouter>
);
