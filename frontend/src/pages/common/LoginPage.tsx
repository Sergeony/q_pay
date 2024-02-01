import React from 'react';
import {Route, Routes} from "react-router-dom";
import LoginStep1 from "../../views/common/LoginStep1";
import LoginStep2 from "../../views/common/LoginStep2";
import UnauthorizedPage from "./UnauthorizedPage";


const LoginPage = () => {

  return (
    <UnauthorizedPage>
      <Routes>
        <Route path={"/"}
               element={<LoginStep1/>}
        />
        <Route path={"/2"}
               element={<LoginStep2/>}
        />
      </Routes>
    </UnauthorizedPage>
  );
};

export default LoginPage;
