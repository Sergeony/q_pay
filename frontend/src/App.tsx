import React from 'react';
import './App.css';
import RegistrationForm from "./components/RegistrationForm";
import RegistrationPage from "./pages/RegistrationPage";
import {createGlobalStyle, ThemeProvider} from "styled-components";
import {darkTheme, lightTheme} from "./styles/themes";
import {RootState} from "./store/store";
import {useSelector} from "react-redux";
import RegistrationStep2 from "./pages/RegistrationStep2";
import MyPage from "./pages/testPage";
import RegistrationStep3 from "./pages/RegistrationStep3";
import RegistrationStep4 from "./pages/RegistrationStep4";
import LoginStep2 from "./pages/LoginStep2";
import LoginStep1 from "./pages/LoginStep1";
import AdvertismentsPage from "./pages/trader/AdvertismentsPage";

function App() {
  const theme = useSelector((state: RootState) => state.theme.theme);

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <div className="App">
        {/*<RegistrationPage/>*/}
        {/*<RegistrationStep2/>*/}
        {/*<RegistrationStep3/>*/}
        {/*<RegistrationStep4/>*/}
        {/*<LoginStep1/>*/}
        <AdvertismentsPage/>
      </div>
    </ThemeProvider>
  );
}

export default App;
