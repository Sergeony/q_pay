import React from 'react';
import {PageWrapper} from "../../UI/CommonUI";
import Header from "../../components/common/Header";
import {Route, Routes} from "react-router-dom";
import BuyStep1 from "../../views/client/BuyStep1";
import BuyStep2 from "../../views/client/BuyStep2";
import BuyStep3 from "../../views/client/BuyStep3";
import BuyStep4 from "../../views/client/BuyStep4";
import BuyStep5 from "../../views/client/BuyStep5";
import BuyStep6 from "../../views/client/BuyStep6";
import BuyStep7 from "../../views/client/BuyStep7";


const ClientBuyPage = () => {


  return (
    <PageWrapper>
      <Header/>
      <Routes>
        <Route path={"/"} element={<BuyStep1/>}/>
        <Route path={"/2"} element={<BuyStep2/>}/>
        <Route path={"/3"} element={<BuyStep3/>}/>
        <Route path={"/4"} element={<BuyStep4/>}/>
        <Route path={"/5"} element={<BuyStep5/>}/>
        <Route path={"/6"} element={<BuyStep6/>}/>
        <Route path={"/7"} element={<BuyStep7/>}/>
      </Routes>
    </PageWrapper>
  );
};

export default ClientBuyPage;
