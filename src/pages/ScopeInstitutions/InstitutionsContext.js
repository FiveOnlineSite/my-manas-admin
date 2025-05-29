import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { institutionsData } from "./institutionsData";

export const InstitutionsContext = createContext();

export const InstitutionsContextProvider = (props) => {
  const [data, setData] = useState(institutionsData);

  return (
    <InstitutionsContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </InstitutionsContext.Provider>
  );
};
