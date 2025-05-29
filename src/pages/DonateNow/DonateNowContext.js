import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { donateNowData } from "./donateNowData";

export const DonateNowContext = createContext();

export const DonateNowContextProvider = (props) => {
  const [data, setData] = useState(donateNowData);

  return (
    <DonateNowContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </DonateNowContext.Provider>
  );
};
