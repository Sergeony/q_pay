import React, {Suspense} from 'react';
import {Route, Routes} from "react-router-dom";
const BuyStep1 = React.lazy(() => import('../../views/client/BuyStep1'));
const BuyStep2 = React.lazy(() => import('../../views/client/BuyStep2'));
const BuyStep3 = React.lazy(() => import('../../views/client/BuyStep3'));
const BuyStep4 = React.lazy(() => import('../../views/client/BuyStep4'));
const BuyStep5 = React.lazy(() => import('../../views/client/BuyStep5'));
const BuyStep6 = React.lazy(() => import('../../views/client/BuyStep6'));
const BuyStep7 = React.lazy(() => import('../../views/client/BuyStep7'));
import Header from "../../components/common/Header";
import { PageWrapper } from "../../UI/CommonUI";


const ClientBuyPage = () => {
  return (
    <PageWrapper>
      <Header/>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path={"/"} element={<BuyStep1/>}/>
          <Route path={"/2"} element={<BuyStep2/>}/>
          <Route path={"/3"} element={<BuyStep3/>}/>
          <Route path={"/4"} element={<BuyStep4/>}/>
          <Route path={"/5"} element={<BuyStep5/>}/>
          <Route path={"/6"} element={<BuyStep6/>}/>
          <Route path={"/7"} element={<BuyStep7/>}/>
        </Routes>
      </Suspense>
    </PageWrapper>
);
};

export default ClientBuyPage;
