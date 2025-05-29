import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { howToApplyData } from "./howToApplyData";

export const HowToApplyContext = createContext();

export const HowToApplyContextProvider = (props) => {
  const [data, setData] = useState(howToApplyData);

  return (
    <HowToApplyContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </HowToApplyContext.Provider>
  );
};
