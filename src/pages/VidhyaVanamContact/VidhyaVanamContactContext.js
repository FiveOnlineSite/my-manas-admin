import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { vidhyavanamcontactData } from "./vidhyaVanamContactData";

export const VidhyaVanamContactContext = createContext();

export const VidhyaVanamContactContextProvider = (props) => {
  const [data, setData] = useState(vidhyavanamcontactData);

  return (
    <VidhyaVanamContactContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </VidhyaVanamContactContext.Provider>
  );
};
