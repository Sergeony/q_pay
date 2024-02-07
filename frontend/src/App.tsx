import React, {useEffect} from 'react';
import './App.css';
import {ThemeProvider} from "styled-components";
import {darkTheme, lightTheme} from "./styles/themes";
import {RootState} from "./store/store";
import {useDispatch, useSelector} from "react-redux";
import AdvertisementsPage from "./pages/trader/AdvertisementsPage";
import {Route, Routes} from "react-router-dom";
import RegistrationPage from "./pages/common/RegistrationPage";
import LoginPage from "./pages/common/LoginPage";
import BuyPage from "./pages/trader/BuyPage";
import SellPage from "./pages/trader/SellPage";
import SettingsPage from "./pages/trader/SettingsPage";
import PrivateRoute from "./pages/common/PrivateRoute";
import WithdrawalPage from "./pages/merchant/WithdrawalPage";
import DepositPage from "./pages/merchant/DepositPage";
import MerchantSettingsPage from "./pages/merchant/MerchantSettingsPage";
import TradersPage from "./pages/admin/TradersPage";
import TraderStatsPage from "./pages/admin/TraderStatsPage";
import MerchantsPage from './pages/admin/MerchantsPage';
import MerchantStatsPage from './pages/admin/MerchantStatsPage';
import PublicRoute from "./pages/common/PublicRoute";
import {setUser} from "./store/reducers/authSlice";
import {useGetInputTransactionsQuery, useGetOutputTransactionsQuery} from "./service/transactionsService";
import {getUserTypeFromToken} from "./utils";
import {webSocketService} from "./service/webSocketService";
import {loadTransactions} from "./store/reducers/webSocketSlice";

function App() {
  const theme = useSelector((state: RootState) => state.theme.value);
  const auth = useSelector((state: RootState) => state.auth.auth);

  const dispatch = useDispatch();
  const {data: inputActiveTransactions} = useGetInputTransactionsQuery({statusGroup: 'active'});
  const {data: outputActiveTransactions} = useGetOutputTransactionsQuery({statusGroup: 'active'});

  useEffect(() => {
    const token = localStorage.getItem('access');
    dispatch(setUser({ token }));
    const userType = getUserTypeFromToken();

    if (userType == 1) {
      dispatch(loadTransactions({transactions: inputActiveTransactions || [], transactionType: 'input'}));
      dispatch(loadTransactions({transactions: outputActiveTransactions || [], transactionType: 'output'}));

      webSocketService.connect(auth.token);
    }
  }, [inputActiveTransactions]);

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <div className="App">
        <Routes>
          <Route path={"/sign-up/*"}
                 element={<PublicRoute Component={RegistrationPage} />}
          />
          <Route path={"/sign-in/*"}
                 element={<PublicRoute Component={LoginPage} />}
          />

          <Route path={"/advertisements/*"}
                 element={<PrivateRoute Component={AdvertisementsPage} useTypes={[1]} />}
          />
          <Route path={"/buy/*"}
                 element={<PrivateRoute Component={BuyPage} useTypes={[1]} />}
          />
          <Route path={"/sell/*"}
                 element={<PrivateRoute Component={SellPage} useTypes={[1]} />}
          />
          <Route path={"/settings/*"}
                 element={<PrivateRoute Component={SettingsPage} useTypes={[1]} />}
          />

          <Route path={"/deposit/*"}
                 element={<PrivateRoute Component={DepositPage} useTypes={[2]} />}
          />
          <Route path={"/withdrawal/*"}
                 element={<PrivateRoute Component={WithdrawalPage} useTypes={[2]} />}
          />
          <Route path={"/m/settings/*"}
                 element={<PrivateRoute Component={MerchantSettingsPage} useTypes={[2]} />}
          />

          <Route path={"/traders/"}
                 element={<PrivateRoute Component={TradersPage} useTypes={[3]} />}
          />
          <Route path="/traders/:traderId/*"
                 element={<PrivateRoute Component={TraderStatsPage} useTypes={[3]} />}
          />
          <Route path={"/merchants/*"}
                 element={<PrivateRoute Component={MerchantsPage} useTypes={[3]} />}
          />
          <Route path="/merchants/:merchantId/*"
                 element={<PrivateRoute Component={MerchantStatsPage} useTypes={[3]} />}
          />
          <Route path={"/a/settings/*"}
                 element={<PrivateRoute Component={MerchantSettingsPage} useTypes={[3]} />}
          />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
