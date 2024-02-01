import React from 'react';
import {Route, Routes} from "react-router-dom";
import RegistrationStep1 from "../../views/common/RegistrationStep1";
import RegistrationStep2 from "../../views/common/RegistrationStep2";
import RegistrationStep3 from "../../views/common/RegistrationStep3";
import RegistrationStep4 from "../../views/common/RegistrationStep4";
import UnauthorizedPage from "./UnauthorizedPage";


const RegistrationPage = () => {
  return (
    <UnauthorizedPage>
      <Routes>
        <Route path={"/"}
               element={<RegistrationStep1/>}
        />
        <Route path={"/2"}
               element={<RegistrationStep2/>}
        />
        <Route path={"/3"}
               element={<RegistrationStep3/>}
        />
        <Route path={"/4"}
               element={<RegistrationStep4/>}
        />
      </Routes>
    </UnauthorizedPage>
  );
};

export default RegistrationPage;
