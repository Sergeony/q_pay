import React from 'react';
import './App.css';
import {ThemeProvider} from "styled-components";
import {darkTheme, lightTheme} from "./styles/themes";
import {RootState} from "./store/store";
import {useSelector} from "react-redux";
import AdvertisementsPage from "./pages/trader/AdvertisementsPage";
import {Route, Routes} from "react-router-dom";
import RegistrationPage from "./pages/common/RegistrationPage";
import LoginPage from "./pages/common/LoginPage";
import BuyPage from "./pages/trader/BuyPage";
import TestPage from "./pages/testPage";
import SellPage from "./pages/trader/SellPage";
import SettingsPage from "./pages/trader/SettingsPage";

function App() {
  const theme = useSelector((state: RootState) => state.theme.theme);

  return (
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
        <div className="App">
          <Routes>
            <Route path={"/advertisements/*"}
                   element={<AdvertisementsPage/>}
            />
            <Route path={"/buy/*"}
                   element={<BuyPage/>}
            />
            <Route path={"/sell/*"}
                   element={<SellPage/>}
            />
            <Route path={"/sign-up/*"}
                   element={<RegistrationPage/>}
            />
            <Route path={"/sign-in/*"}
                   element={<LoginPage/>}
            />
            <Route path={"/settings/*"}
                   element={<SettingsPage/>}
            />
            <Route path={"/test-page/*"}
                   element={<TestPage/>}
            />
          </Routes>
        </div>
      </ThemeProvider>
  );
}

export default App;
