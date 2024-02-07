import React from 'react';
import {PageWrapper} from "../../UI/CommonUI";
import Header from "../../components/common/Header";
import {Route, Routes} from "react-router-dom";
import BuyStep1 from "../../views/client/BuyStep1";
import BuyStep2 from "../../views/client/BuyStep2";
import BuyStep3 from "../../views/client/BuyStep3";


const ClientBuyPage = () => {


  return (
    <PageWrapper>
      <Header/>
      <Routes>
        <Route path={"/"} element={<BuyStep1/>}/>
        <Route path={"/2"} element={<BuyStep2/>}/>
        <Route path={"/3"} element={<BuyStep3/>}/>
      </Routes>
    </PageWrapper>
  );
};

export default ClientBuyPage;
