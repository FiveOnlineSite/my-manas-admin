import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { institutionsAboutData } from "./institutionsAboutData";

export const InstitutionsAboutContext = createContext();

export const InstitutionsAboutContextProvider = (props) => {
  const [data, setData] = useState(institutionsAboutData);

  return (
    <InstitutionsAboutContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </InstitutionsAboutContext.Provider>
  );
};
