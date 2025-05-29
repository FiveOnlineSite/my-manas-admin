import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { scopeBannerData } from "./scopeBannerData";

export const ScopeBannerContext = createContext();

export const ScopeBannerContextProvider = (props) => {
  const [data, setData] = useState(scopeBannerData);

  return (
    <ScopeBannerContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </ScopeBannerContext.Provider>
  );
};
