import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { vidhyaVanamFacilitiesData } from "./vidhyaVanamFacilitiesData";

export const VidhyaVanamFacilitiesContext = createContext();

export const VidhyaVanamFacilitiesContextProvider = (props) => {
  const [data, setData] = useState(vidhyaVanamFacilitiesData);

  return (
    <VidhyaVanamFacilitiesContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </VidhyaVanamFacilitiesContext.Provider>
  );
};
