import { Suspense } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MainPage } from "pages/MainPage/ui/MainPage";
import { ThemeToggle } from "widgets/ThemeToggle";
import { LangSelect } from "widgets/LangSelect";

const App = () => {
    const { t } = useTranslation();

    return (
        <div id="app" className="app">
            <Suspense>
                <div style={{ display: "flex" }}>
                    <Link to="/about/">{t("about")}</Link>
                    <Link to="/">{t("Main Page")}</Link>
                    <LangSelect />
                </div>
                <Routes>
                    <Route path="/about/" element={<MainPage />} />
                    <Route path="/" element={<MainPage />} />
                </Routes>
                <ThemeToggle />
            </Suspense>
        </div>
    );
};

export default App;
