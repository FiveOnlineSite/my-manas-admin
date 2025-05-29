import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { OverviewData } from "./OverviewData";
export const OverviewContext = createContext();

export const OverviewContextProvider = (props) => {
  const [data, setData] = useState(OverviewData);

  return (
    <OverviewContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </OverviewContext.Provider>
  );
};
