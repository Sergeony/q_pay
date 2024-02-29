import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "shared/i18n/i18n";
import ThemeProvider from "app/providers/ThemeProvider/ui/ThemeProvider";
import App from "app/App";

const root = ReactDOM.createRoot(
    document.getElementById("root")
);

root.render(
    <BrowserRouter>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </BrowserRouter>
);
