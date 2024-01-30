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
import PrivateRoute from "./pages/common/PrivateRoute";

function App() {
  const theme = useSelector((state: RootState) => state.theme.value);

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <div className="App">
        <Routes>
          <Route path={"/sign-up/*"}
                 element={<RegistrationPage/>}
          />
          <Route path={"/sign-in/*"}
                 element={<LoginPage/>}
          />

          <Route path={"/test-page/*"}
                 element={<TestPage/>}
          />

          <Route path={"/advertisements/*"}
                 element={<PrivateRoute component={AdvertisementsPage} roles={['trader']} />}
          />
          <Route path={"/buy/*"}
                 element={<PrivateRoute component={BuyPage} roles={['trader']} />}
          />
          <Route path={"/sell/*"}
                 element={<PrivateRoute component={SellPage} roles={['trader']} />}
          />
          <Route path={"/settings/*"}
                 element={<PrivateRoute component={SettingsPage} roles={['trader']} />}
          />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
