import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { vidhyaVanamApplyData } from "./vidhyaVanamApplyData";

export const VidhyaVanamApplyContext = createContext();

export const VidhyaVanamApplyContextProvider = (props) => {
  const [data, setData] = useState(vidhyaVanamApplyData);

  return (
    <VidhyaVanamApplyContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </VidhyaVanamApplyContext.Provider>
  );
};
