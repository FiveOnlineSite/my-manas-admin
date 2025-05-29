import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { scopeOverviewData } from "./scopeOverviewData";

export const ScopeOverviewContext = createContext();

export const ScopeOverviewContextProvider = (props) => {
  const [data, setData] = useState(scopeOverviewData);

  return (
    <ScopeOverviewContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </ScopeOverviewContext.Provider>
  );
};
