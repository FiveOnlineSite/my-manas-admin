import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { masterBannerData } from "./masterBannerData";

export const MasterBannerContext = createContext();

export const MasterBannerContextProvider = (props) => {
  const [data, setData] = useState(masterBannerData);

  return (
    <MasterBannerContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </MasterBannerContext.Provider>
  );
};
