import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { academyHistoryData } from "./AcademyHistoryData";

export const AcademyHistoryContext = createContext();

export const AcademyHistoryContextProvider = (props) => {
  const [data, setData] = useState(academyHistoryData);

  return (
    <AcademyHistoryContext.Provider value={{ contextData: [data, setData] }}>
      <Outlet />
    </AcademyHistoryContext.Provider>
  );
};
