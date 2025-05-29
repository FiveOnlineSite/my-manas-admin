import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { FutureLeadersData } from "./futureLeadersData";

export const FutureLeadersContext = createContext();

export const FutureLeadersContextProvider = (props) => {
  const [data, setData] = useState(FutureLeadersData);

  return (
    <FutureLeadersContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </FutureLeadersContext.Provider>
  );
};
