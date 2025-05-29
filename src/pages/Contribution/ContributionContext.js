import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { contributionData } from "./contributionData";

export const ContributionContext = createContext();

export const ContributionContextProvider = (props) => {
  const [data, setData] = useState(contributionData);

  return (
    <ContributionContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </ContributionContext.Provider>
  );
};
