import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { vidhyaVanamHistoryData } from "./vidhyaVanamHistoryData";

export const VidhyaVanamHistoryContext = createContext();

export const VidhyaVanamHistoryContextProvider = (props) => {
  const [data, setData] = useState(vidhyaVanamHistoryData);

  return (
    <VidhyaVanamHistoryContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </VidhyaVanamHistoryContext.Provider>
  );
};
