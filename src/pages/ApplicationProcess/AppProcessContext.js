import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { appProcessData } from "./appProcessData";

export const AppProcessContext = createContext();

export const AppProcessContextProvider = (props) => {
  const [data, setData] = useState(appProcessData);

  return (
    <AppProcessContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </AppProcessContext.Provider>
  );
};
