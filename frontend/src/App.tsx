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
import WithdrawalPage from "./pages/merchant/WithdrawalPage";
import DepositPage from "./pages/merchant/DepositPage";
import MerchantSettingsPage from "./pages/merchant/MerchantSettingsPage";

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
                 element={<PrivateRoute component={AdvertisementsPage} roles={[1]} />}
          />
          <Route path={"/buy/*"}
                 element={<PrivateRoute component={BuyPage} roles={[1]} />}
          />
          <Route path={"/sell/*"}
                 element={<PrivateRoute component={SellPage} roles={[1]} />}
          />
          <Route path={"/settings/*"}
                 element={<PrivateRoute component={SettingsPage} roles={[1]} />}
          />
          <Route path={"/deposit/*"}
                 element={<PrivateRoute component={DepositPage} roles={[1]} />}
          />
          <Route path={"/withdrawal/*"}
                 element={<PrivateRoute component={WithdrawalPage} roles={[1]} />}
          />
          <Route path={"/m/settings/*"}
                 element={<PrivateRoute component={MerchantSettingsPage} roles={[1]} />}
          />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
